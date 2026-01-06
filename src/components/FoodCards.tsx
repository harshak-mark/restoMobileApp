import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Dimensions, Image, ImageSourcePropType, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../styles/FoodCards.styles';
import { useTheme } from '../theme/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FOOD_ITEM_CARD_WIDTH = (SCREEN_WIDTH - 56) / 2; // Match grid layout
const FOOD_ITEM_IMAGE_HEIGHT = 130;

// ============================================
// Type 1: Food Item Card (Full Featured)
// ============================================
export interface FoodItemCardProps {
  image: ImageSourcePropType | string | React.ComponentType<any> | undefined;
  title: string;
  description?: string;
  price: string | number;
  rating?: number;
  isVegetarian?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: () => void;
}

export const FoodItemCard = React.memo(function FoodItemCard({
  image,
  title,
  description,
  price,
  rating,
  isVegetarian = false,
  isBestseller = false,
  isNew = false,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
}: FoodItemCardProps) {
  const { theme } = useTheme();
  const priceText = useMemo(() => typeof price === 'number' ? `₹${price}` : price, [price]);

  const handleDecrease = React.useCallback(() => {
    if (quantity > 1 && onQuantityChange) {
      onQuantityChange(quantity - 1);
    }
  }, [quantity, onQuantityChange]);

  const handleIncrease = React.useCallback(() => {
    if (onQuantityChange) {
      onQuantityChange(quantity + 1);
    }
  }, [onQuantityChange]);

  const darkBorder =
    theme.mode === 'dark'
      ? { borderWidth: 1, borderColor: theme.buttonPrimary }
      : { borderWidth: 0, borderColor: 'transparent' };

  return (
    <View
      style={[
        styles.foodItemCard,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          ...darkBorder,
        },
      ]}
    >
      {/* Image */}
      <View style={styles.foodItemImageContainer}>
        {(() => {
          // Handle string URIs
          if (typeof image === 'string') {
            return (
              <Image 
                source={{ uri: image }} 
                style={styles.foodItemImage} 
                resizeMode="cover"
                defaultSource={require('../../assets/images/food/biriyani.png')}
              />
            );
          }
          
          // Handle React components (SVG files)
          if (image && typeof image === 'function') {
            const SvgComponent = image as React.ComponentType<any>;
            return (
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <SvgComponent 
                  width={FOOD_ITEM_CARD_WIDTH} 
                  height={FOOD_ITEM_IMAGE_HEIGHT} 
                  preserveAspectRatio="xMidYMid meet"
                />
              </View>
            );
          }
          
          // Handle ImageSourcePropType (PNG/JPG via require)
          if (image) {
            return (
              <Image 
                source={image as ImageSourcePropType} 
                style={styles.foodItemImage} 
                resizeMode="cover"
              />
            );
          }
          
          return null;
        })()}
      </View>

      {/* Content */}
      <View style={styles.foodItemContent}>
        {/* Title and Dietary Info */}
        <View style={styles.foodItemHeader}>
          <Text
            style={[styles.foodItemTitle, { color: theme.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View style={styles.dietaryInfo}>
            <View
              style={[
                styles.dietaryDot,
                { backgroundColor: isVegetarian ? theme.success : theme.error },
              ]}
            />
            <Text style={[styles.dietaryText, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
              {isVegetarian ? 'Veg' : 'Non-Veg'}
            </Text>
          </View>
        </View>

        {/* Description */}
        {description && (
          <Text
            style={[styles.foodItemDescription, { color: theme.textSecondary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}

        {/* Price, Rating and Bestseller/New Tag Row */}
        <View style={styles.foodItemPriceRow}>
          <View style={styles.priceRatingContainer}>
            <Text style={[styles.foodItemPrice, { color: theme.textPrimary }]}>{priceText}</Text>
            {rating !== undefined && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={theme.buttonPrimary} />
                <Text style={[styles.ratingText, { color: theme.textPrimary }]}>{rating}</Text>
              </View>
            )}
          </View>
          {(isBestseller || isNew) && (
            <View style={styles.tagRow}>
              {isBestseller && (
                <View style={[styles.bestsellerTag, { backgroundColor: theme.buttonPrimary }]}>
                  <Text style={styles.bestsellerText}>Bestseller</Text>
                </View>
              )}
              {isNew && (
                <View style={[styles.bestsellerTag, { backgroundColor: theme.textMuted }]}>
                  <Text style={styles.bestsellerText}>New</Text>
                </View>
              )}
              <TouchableOpacity style={styles.infoIcon}>
                <Ionicons name="information-circle-outline" size={14} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quantity Selector and Add to Cart */}
        <View style={styles.foodItemActions}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.buttonSecondary }]}
              onPress={handleDecrease}
              disabled={quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={12}
                color={quantity <= 1 ? theme.textMuted : theme.buttonPrimary}
              />
            </TouchableOpacity>
            <Text style={[styles.quantityText, { color: theme.textPrimary }]}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleIncrease}
            >
              <Ionicons name="add" size={12} color={theme.buttonText} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={onAddToCart}
          >
            <Text style={[styles.addToCartText, { color: theme.buttonText }]}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ============================================
// Type 2: Category Card (Simple with Image and Title)
// ============================================
export interface CategoryCardProps {
  image: ImageSourcePropType | string;
  title: string;
  onPress?: () => void;
}

export function CategoryCard({ image, title, onPress }: CategoryCardProps) {
  const { theme } = useTheme();
  const darkBorder =
    theme.mode === 'dark'
      ? { borderWidth: 1, borderColor: theme.buttonPrimary }
      : { borderWidth: 0, borderColor: 'transparent' };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: theme.card, shadowColor: theme.shadow, ...darkBorder },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.categoryImageContainer}>
        {typeof image === 'string' ? (
          <Image source={{ uri: image }} style={styles.categoryImage} resizeMode="cover" />
        ) : (
          <Image source={image} style={styles.categoryImage} resizeMode="cover" />
        )}
      </View>
      <Text style={[styles.categoryTitle, { color: theme.textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// ============================================
// Type 2b: Category Card with SVG Support
// ============================================
export interface CategoryCardSVGProps {
  image: React.ComponentType<any> | ImageSourcePropType | string;
  title: string;
  onPress?: () => void;
}

export function CategoryCardSVG({ image, title, onPress }: CategoryCardSVGProps) {
  const { theme } = useTheme();
  const darkBorder =
    theme.mode === 'dark'
      ? { borderWidth: 1, borderColor: theme.buttonPrimary }
      : { borderWidth: 0, borderColor: 'transparent' };
  const ImageComponent = typeof image === 'function' ? image : null;
  const imageSource = typeof image !== 'function' ? image : null;

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: theme.card, shadowColor: theme.shadow, ...darkBorder },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.categoryImageContainer}>
        {ImageComponent ? (
          <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <ImageComponent width={100} height={100} />
          </View>
        ) : typeof imageSource === 'string' ? (
          <Image source={{ uri: imageSource }} style={styles.categoryImage} resizeMode="cover" />
        ) : (
          <Image source={imageSource as ImageSourcePropType} style={styles.categoryImage} resizeMode="cover" />
        )}
      </View>
      <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.categoryTitle, { color: theme.textPrimary }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ============================================
// Type 3: Category Card with Subtitle
// ============================================
export interface CategoryCardWithSubtitleProps {
  image: ImageSourcePropType | string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function CategoryCardWithSubtitle({
  image,
  title,
  subtitle,
  onPress,
}: CategoryCardWithSubtitleProps) {
  const { theme } = useTheme();

  const darkBorder =
    theme.mode === 'dark'
      ? { borderWidth: 1, borderColor: theme.buttonPrimary }
      : { borderWidth: 0, borderColor: 'transparent' };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCardWithSubtitle,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          ...darkBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.categoryImageContainer}>
        {typeof image === 'string' ? (
          <Image source={{ uri: image }} style={styles.categoryImage} resizeMode="cover" />
        ) : (
          <Image source={image} style={styles.categoryImage} resizeMode="cover" />
        )}
      </View>
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryTitle, styles.categoryTitleWithSubtitle, { color: theme.textPrimary }]}>{title}</Text>
        <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ============================================
// Type 4: Simple Food Card (Image, Title, Price, Add to Cart)
// ============================================
export interface SimpleFoodCardProps {
  image: ImageSourcePropType | string;
  title: string;
  price: string | number;
  onAddToCart?: () => void;
}

export function SimpleFoodCard({ image, title, price, onAddToCart }: SimpleFoodCardProps) {
  const { theme } = useTheme();
  const priceText = typeof price === 'number' ? `₹${price}` : price;

  const darkBorder =
    theme.mode === 'dark'
      ? { borderWidth: 1, borderColor: theme.buttonPrimary }
      : { borderWidth: 0, borderColor: 'transparent' };

  return (
    <View
      style={[
        styles.simpleFoodCard,
        { backgroundColor: theme.card, shadowColor: theme.shadow, ...darkBorder },
      ]}
    >
      <View style={styles.simpleFoodImageContainer}>
        {typeof image === 'string' ? (
          <Image source={{ uri: image }} style={styles.simpleFoodImage} resizeMode="cover" />
        ) : (
          <Image source={image} style={styles.simpleFoodImage} resizeMode="cover" />
        )}
      </View>
      <View style={styles.simpleFoodContent}>
        <Text style={[styles.simpleFoodTitle, { color: theme.textPrimary }]}>{title}</Text>
        <View style={styles.simpleFoodActions}>
          <Text style={[styles.simpleFoodPrice, { color: theme.textPrimary }]}>{priceText}</Text>
          <TouchableOpacity
            style={[styles.simpleAddToCartButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={onAddToCart}
          >
            <Text style={[styles.simpleAddToCartText, { color: theme.buttonText }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

