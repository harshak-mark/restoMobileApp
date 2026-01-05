import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PaymentBg from '../../assets/images/paymentbg.svg';
import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCart, selectCartItems, selectCartTotals } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/ordersSlice';
import { useTheme } from '../theme/useTheme';

const PaymentSuccessScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const params = useLocalSearchParams<{ method?: string }>();
  const method = params.method?.toString() || 'online';
  const paidVia = method === 'cash' ? 'Cash' : method.toUpperCase();
  const orderId = useMemo(() => `#RESTO${Date.now().toString().slice(-6)}`, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(
        placeOrder({
          orderId,
          total: totals.total,
          items: cartItems,
          paymentMethod: paidVia,
          status: 'history',
        }),
      );
      dispatch(clearCart());
    }
  }, [cartItems, dispatch, orderId, paidVia, totals.total]);

  return (
    <View style={styles.root}>
      <PaymentBg width="100%" height="100%" style={StyleSheet.absoluteFillObject} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.iconCircle, { backgroundColor: '#FF9700' }]}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: '#000000' }]}>Thank You!</Text>
          <Text style={[styles.subtitle, { color: '#000000' }]}>Payment successful</Text>
          <Text style={[styles.meta, { color: '#000000' }]}>{`Order ${orderId}`}</Text>
          <Text style={[styles.meta, { color: '#000000' }]}>{`Paid via ${paidVia}`}</Text>
          <Text style={[styles.helper, { color: '#000000' }]}>View your order summary.</Text>

          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: '#FF9700' }]}
            onPress={() => router.replace(`/order-summary?method=${method}`)}
            activeOpacity={0.9}
          >
            <Text style={[styles.ctaText, { color: '#FFFFFF' }]}>Go to Order Summary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    //paddingBottom: 120,
    paddingTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  dot: {
    width: 12,
    height: 12,
    margin: 10,
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
  },
  heroCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: 13, marginTop: 2 },
  helper: { marginTop: 12, fontSize: 13 },
  ctaButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PaymentSuccessScreen;
