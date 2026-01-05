import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { FoodItemCard } from '../components/FoodCards';
import ProfileDrawer from '../components/ProfileDrawer';
import { FoodItem, categoryItemsData, picksYoursData } from '../data/foodItems';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/slices/cartSlice';
import { styles as categoryStyles } from '../styles/CategoryDetailScreen.styles';
import { styles as homeStyles } from '../styles/HomeScreen.styles';
import { useTheme } from '../theme/useTheme';
import {
  getCategoryCarouselImages,
  getCategoryMainImage,
  normalizeCategory,
} from '../utils/categoryAssets';

type CategoryDetailScreenProps = {
  category?: string;
  items?: FoodItem[];
};

export default function CategoryDetailScreen({ category: propCategory, items }: CategoryDetailScreenProps) {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ category?: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);

  const currentUser =
    user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const userInitial =
    currentUser?.name?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    currentUser?.phone?.charAt(0) ||
    'U';

  const resolvedCategory =
    propCategory || (Array.isArray(params?.category) ? params.category[0] : params?.category) || 'Dosa';
  const normalizedCategory = normalizeCategory(resolvedCategory);

  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(4);

  const dataSource = useMemo<FoodItem[]>(() => {
    if (items?.length) {
      return items;
    }

    const mapped = categoryItemsData[normalizedCategory];
    if (mapped?.length) {
      return mapped;
    }

    const filtered = picksYoursData.filter((item) =>
      (item.categories || []).some((cat: string) => {
        const normalizedCat = normalizeCategory(cat);
        return (
          normalizedCat.includes(normalizedCategory) || normalizedCategory.includes(normalizedCat)
        );
      }),
    );

    if (filtered.length) {
      return filtered;
    }

    return picksYoursData;
  }, [items, normalizedCategory]);

  useEffect(() => {
    setVisibleCount(Math.min(4, dataSource.length || 4));
  }, [dataSource.length]);

  const visibleItems = dataSource.slice(0, visibleCount);
  const hasMore = visibleCount < dataSource.length;
  const ctaLabel = hasMore ? 'See More' : 'See Less';

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleAddToCart = (item: FoodItem) => {
    const quantity = quantities[item.id] || 1;
    const imageSource = typeof item.image === 'function' ? undefined : (item.image as any | undefined);
    dispatch(addItem({ item: { ...item, image: imageSource }, quantity }));
  };

  const togglePagination = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(dataSource.length, prev + 4));
    } else {
      setVisibleCount((prev) => Math.max(4, prev - 4));
    }
  };

  const heroImage = getCategoryMainImage(resolvedCategory);
  const carouselImages = getCategoryCarouselImages(resolvedCategory);
  const displayCategory = resolvedCategory
    ? `${resolvedCategory.charAt(0).toUpperCase()}${resolvedCategory.slice(1)}`
    : '';

  return (
    <View style={[homeStyles.root, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={[homeStyles.header, { backgroundColor: theme.buttonPrimary }]}>
        <View style={homeStyles.locationSection}>
          <View style={homeStyles.locationRow}>
            <Ionicons name="home" size={20} color={theme.buttonText} />
            <Text style={[homeStyles.locationText, { color: theme.buttonText }]}>Home</Text>
            <Ionicons name="chevron-down" size={16} color={theme.buttonText} />
          </View>
          <Text style={[homeStyles.addressText, { color: theme.buttonText }]}>XXXXX ,XXXX XXXXXX</Text>
        </View>

        <View style={homeStyles.headerRight}>
          <TouchableOpacity style={homeStyles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.profileButton} onPress={() => setShowProfileDrawer(true)}>
            <View style={[homeStyles.profileAvatar, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[homeStyles.profileInitial, { color: theme.textPrimary }]}>{userInitial}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={[categoryStyles.content, { backgroundColor: theme.background }]}
        contentContainerStyle={categoryStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={[homeStyles.searchContainer, { backgroundColor: theme.buttonPrimary }]}>
          <View style={[homeStyles.searchBar, { backgroundColor: theme.background }]}>
            <Ionicons name="search" size={20} color={theme.textMuted} style={homeStyles.searchIcon} />
            <TextInput
              style={[homeStyles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          {/* Header Hero Title + Image */}
          <View style={[categoryStyles.headerHero, { backgroundColor: theme.buttonPrimary }]}>
            <Text style={[categoryStyles.headerTitle, { color: theme.buttonText }]}>
              {displayCategory}
            </Text>
            <Image
              source={heroImage}
              style={categoryStyles.headerImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Carousel Section */}
        <CategoryCarousel style={categoryStyles.carouselContainer} images={carouselImages} />

        {/* Section Title */}
        <Text style={[categoryStyles.sectionTitle, { color: theme.textPrimary }]}>
          Your favourite {resolvedCategory}
        </Text>

        {/* Food Cards */}
        <View style={categoryStyles.cardsContainer}>
          {visibleItems.map((item) => (
            <View key={item.id} style={categoryStyles.cardWrapper}>
              <FoodItemCard
                image={item.image}
                title={item.name}
                description={item.description}
                price={item.price ?? ''}
                rating={item.rating}
                isVegetarian={item.type === 'veg'}
                isBestseller={item.status === 'bestseller'}
                isNew={item.status === 'new'}
                quantity={quantities[item.id] || 1}
                onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                onAddToCart={() => handleAddToCart(item)}
              />
            </View>
          ))}
        </View>

        {/* See More / Show Less */}
        {dataSource.length > 4 && (
          <TouchableOpacity
            style={[categoryStyles.seeMoreButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={togglePagination}
            activeOpacity={0.85}
          >
            <Text style={[categoryStyles.seeMoreText, { color: theme.buttonText }]}>{ctaLabel}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomNav active="menu" />

      {/* Profile Drawer */}
      <ProfileDrawer visible={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} />
    </View>
  );
}
