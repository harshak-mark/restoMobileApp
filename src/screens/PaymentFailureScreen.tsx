import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

const PaymentFailureScreen = () => {
  const { theme } = useTheme();
  const attemptedAt = useMemo(() => new Date().toLocaleString(), []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
          <TouchableOpacity onPress={() => router.replace('/payment')} style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Payment Failed</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card || '#fff', shadowColor: theme.shadow }]}>
          <View style={styles.center}>
            <Ionicons name="sad-outline" size={48} color={theme.buttonPrimary} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Payment Failed</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your order isn’t cancelled. Retry to confirm it.
            </Text>
          <View style={[styles.badge, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,0,0,0.1)' : '#FDEDEC' }]}>
            <Ionicons name="close-circle" size={18} color={theme.error} />
            <Text style={[styles.badgeText, { color: theme.error }]}>Transaction Failed</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Transaction Details</Text>
            <Detail label="Order ID" value="#RESTO4587" />
            <Detail label="Payment Method" value="UPI" />
            <Detail label="Attempted On" value={attemptedAt} />
            <Detail label="Amount" value="₹520.00" />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primary, { backgroundColor: theme.buttonPrimary }]} onPress={() => router.replace('/payment')}>
              <Text style={[styles.primaryText, { color: theme.buttonText }]}>Retry Secure Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondary, { borderColor: theme.divider }]} onPress={() => router.replace('/payment')}>
              <Ionicons name="repeat-outline" size={18} color={theme.textPrimary} />
              <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Try another method</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondary, { borderColor: theme.divider }]} onPress={() => router.replace('/payment')}>
              <Ionicons name="call-outline" size={18} color={theme.textPrimary} />
              <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Contact support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondary, { borderColor: theme.divider }]} onPress={() => router.replace('/payment')}>
              <Ionicons name="arrow-back-outline" size={18} color={theme.textPrimary} />
              <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Back to checkout</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.notice, { color: theme.textSecondary }]}>
            If your amount was debited, it will be auto-refunded within 3-5 business days.
          </Text>
        </View>
      </ScrollView>
      <BottomNav active="cart" />
    </View>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  return (
  <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
  </View>
);
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 120 },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    margin: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  center: { alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  badgeText: { fontWeight: '700' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  detailLabel: { fontSize: 13, fontWeight: '600' },
  detailValue: { fontSize: 13, fontWeight: '600' },
  actions: { gap: 10, marginTop: 14 },
  primary: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { fontWeight: '800' },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: { fontWeight: '700' },
  notice: { marginTop: 12, fontSize: 12, textAlign: 'center' },
});

export default PaymentFailureScreen;
