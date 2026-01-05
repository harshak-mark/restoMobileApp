import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { foodItems } from '../data/foodItems';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { CartItem, decrement, increment, selectCartItems, selectCartTotals } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

const CartScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);

  const renderImage = (cartItem: CartItem) => {
    const food = foodItems.find((f) => f.id === cartItem.id);
    const image = food?.image;

    if (typeof image === 'string') {
      return <Image source={{ uri: image }} style={styles.itemImage} resizeMode="cover" />;
    }

    if (image && typeof image === 'function') {
      const SvgComponent = image as React.ComponentType<any>;
      return (
        <View style={styles.svgWrapper}>
          <SvgComponent width={70} height={70} />
        </View>
      );
    }

    if (image) {
      return <Image source={image as ImageSourcePropType} style={styles.itemImage} resizeMode="cover" />;
    }

    // Fallback to stored uri if provided
    if (cartItem.imageUri) {
      return <Image source={{ uri: cartItem.imageUri }} style={styles.itemImage} resizeMode="cover" />;
    }

    return <View style={[styles.itemImage, { backgroundColor: theme.backgroundSecondary }]} />;
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => {
            if (backToSettings) {
              router.replace('/settings');
            } else {
              router.back();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Your Cart</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Add delicious items from the menu to get started.
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={() => router.push('/menu')}
            >
              <Text style={[styles.browseButtonText, { color: theme.buttonText }]}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  {renderImage(item)}
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.price, { color: theme.buttonPrimary }]}>{`₹${item.price}`}</Text>
                    {item.rating && (
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: theme.textPrimary }]}>{item.rating}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => dispatch(decrement(item.id))}
                    >
                      <Ionicons name="remove" size={16} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.quantityText, { color: theme.textPrimary }]}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => dispatch(increment(item.id))}
                    >
                      <Ionicons name="add" size={16} color={theme.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.promoCard}>
              <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>Promo Code</Text>
              <View style={styles.promoRow}>
                <TextInput
                  placeholder="Enter Promo Code"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.promoInput,
                    { borderColor: theme.divider, color: theme.textPrimary },
                  ]}
                />
                <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.buttonPrimary }]}>
                  <Text style={[styles.applyButtonText, { color: theme.buttonText }]}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: theme.buttonPrimary }]}>
              <Text style={[styles.summaryTitle, { color: theme.buttonText }]}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: theme.buttonText }]}>
                  {formatCurrency(totals.subtotal)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>GST (5%)</Text>
                <Text style={[styles.summaryValue, { color: theme.buttonText }]}>
                  {formatCurrency(totals.gst)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Service Charge</Text>
                <Text style={[styles.summaryValue, { color: theme.buttonText }]}>
                  {formatCurrency(totals.serviceCharge)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: theme.buttonText }]}>
                  {formatCurrency(totals.discount)}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: theme.buttonText }]}>Total Amount</Text>
                <Text style={[styles.totalValue, { color: theme.buttonText }]}>
                  {formatCurrency(totals.total)}
                </Text>
              </View>

              <View style={styles.deliveryInfo}>
                <Ionicons name="time-outline" size={16} color={theme.buttonText} />
                <Text style={[styles.deliveryText, { color: theme.buttonText }]}>
                  Your order will be ready in 25 mins
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.checkoutButton, { backgroundColor: theme.buttonText }]}
                onPress={() => router.push('/checkout')}
              >
                <Text style={[styles.checkoutText, { color: theme.buttonPrimary }]}>Continue order</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
      paddingTop: 80,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
    gap: 14,
  },
  card: {
      backgroundColor: theme?.card || '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  svgWrapper: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
      borderColor: theme?.divider || '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quantityText: {
    minWidth: 26,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  promoCard: {
      backgroundColor: theme?.card || '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  applyButton: {
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
      backgroundColor: theme?.divider || 'rgba(255,255,255,0.6)',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutButton: {
    marginTop: 6,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  browseButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartScreen;
