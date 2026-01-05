import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartTotals } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

const OrderSummaryScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ method?: string }>();
  const method = params.method?.toString() || 'online';
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const addresses = useAppSelector((state) => state.address.items);

  const primaryAddress = addresses[0];
  const orderId = useMemo(() => `#ORD${Date.now().toString().slice(-6)}`, []);
  const paymentStatus =
    method === 'cash'
      ? 'Cash on Delivery'
      : method === 'upi'
      ? 'Paid via UPI'
      : method === 'card'
      ? 'Paid via Card'
      : 'Paid';

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Order Summary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.card || '#fff' }]}>
          <View style={[styles.statusIcon, { backgroundColor: theme.buttonPrimary }]}>
            <Ionicons name="checkmark" size={26} color={theme.buttonText} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Order Placed Successfully!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Thank you for ordering with Resto Way.
          </Text>
          <TouchableOpacity
            style={[styles.trackButton, { backgroundColor: '#F0F4FF' }]}
            onPress={() => router.replace('/tracking')}
          >
            <Text style={[styles.trackText, { color: theme.buttonPrimary }]}>Track My Order</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Order Details</Text>
          <Detail label="Order ID" value={orderId} />
          <Detail label="Estimated Delivery" value="25-30 mins" />
          <Detail label="Payment Status" value={paymentStatus} />
          <Detail label="Order Type" value="Delivery" />
        </View>

        {primaryAddress && (
          <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Deliver To</Text>
            <Text style={[styles.bodyText, { color: theme.textPrimary, fontWeight: '700' }]}>
              {primaryAddress.label}
            </Text>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              {primaryAddress.address}, {primaryAddress.city} - {primaryAddress.pinCode}
            </Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Items</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.bodyText, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.bodyText, { color: theme.textSecondary }]}>{`x${item.quantity}`}</Text>
              <Text style={[styles.bodyText, { color: theme.textPrimary, fontWeight: '700' }]}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Payment Summary</Text>
          <SummaryRow label="Subtotal" value={totals.subtotal} />
          <SummaryRow label="GST (5%)" value={totals.gst} />
          <SummaryRow label="Service Charge" value={totals.serviceCharge} />
          <SummaryRow label="Discount" value={totals.discount} />
          <View style={styles.divider} />
          <SummaryRow label="Total Amount" value={totals.total} bold />
        </View>

        <View style={styles.feedbackRow}>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.divider }]} onPress={() => router.replace('/payment')}>
            <Ionicons name="document-text-outline" size={18} color={theme.textPrimary} />
            <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Download Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.divider }]} onPress={() => router.replace('/home')}>
            <Ionicons name="home-outline" size={18} color={theme.textPrimary} />
            <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const SummaryRow = ({ label, value, bold }: { label: string; value: number; bold?: boolean }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, bold && { fontWeight: '800' }]}>{label}</Text>
    <Text style={[styles.detailValue, bold && { fontWeight: '800' }]}>{`₹${value.toFixed(2)}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: {
    padding: 16,
    paddingBottom: 140,
    gap: 12,
  },
  heroCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  trackButton: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  trackText: { fontWeight: '700' },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  bodyText: { fontSize: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  detailValue: { fontSize: 13, color: '#111', fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryText: { fontSize: 14, fontWeight: '700' },
});

export default OrderSummaryScreen;

