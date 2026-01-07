import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PaymentFailedSvg from '../../assets/images/paymentFailed.svg';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { selectCartTotals } from '../store/slices/cartSlice';
import { CardPayment, UpiAccount } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

// Date formatting function: "dd mon yyyy, HH:MM AM/PM"
const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = hours.toString().padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hoursStr}:${minutes} ${ampm}`;
};

// Helper function to get card brand name
const getCardBrandName = (brand: string): string => {
  switch (brand) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'MasterCard';
    case 'amex':
      return 'AmEx';
    case 'discover':
      return 'Discover';
    default:
      return 'Card';
  }
};

// Format payment method display
const getPaymentMethodDisplay = (
  method: string | undefined,
  cardId: string | undefined,
  upiId: string | undefined,
  type: string | undefined,
  cardList: CardPayment[],
  upiList: UpiAccount[]
): string => {
  if (method === 'card' && cardId) {
    const card = cardList.find((c) => c.id === cardId);
    if (card) {
      return `Card (${getCardBrandName(card.brand)})`;
    }
    return 'Card';
  }
  
  if (method === 'upi') {
    if (type === 'qr') {
      return 'UPI Payment Method';
    }
    if (upiId) {
      const upi = upiList.find((u) => u.id === upiId);
      if (upi) {
        return `UPI (${upi.upiId})`;
      }
      // If UPI ID is provided but not found in list, still show it
      return `UPI (${upiId})`;
    }
    // If UPI method but no ID, show generic
    return 'UPI Payment Method';
  }
  
  // Fallback
  return 'Payment Method';
};

const PaymentFailureScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ method?: string; cardId?: string; upiId?: string; type?: string }>();
  const [countdown, setCountdown] = useState(15);
  const attemptedAt = useMemo(() => formatDate(new Date()), []);
  
  // Get Redux state
  const cardList = useAppSelector((state) => state.payment.cardList);
  const upiList = useAppSelector((state) => state.payment.upiList);
  const totals = useAppSelector(selectCartTotals);
  
  // Get payment method display
  const paymentMethodDisplay = useMemo(() => {
    return getPaymentMethodDisplay(
      params.method,
      params.cardId,
      params.upiId,
      params.type,
      cardList,
      upiList
    );
  }, [params.method, params.cardId, params.upiId, params.type, cardList, upiList]);
  
  // Format currency
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;
  
  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-redirect when timer reaches 0
      router.replace('/payment');
    }
  }, [countdown]);
  
  const handleGoNow = () => {
    router.replace('/payment');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
          <TouchableOpacity onPress={() => router.replace('/checkout')} style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Payment Failed</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card || '#fff', shadowColor: theme.shadow }]}>
          <View style={styles.center}>
            <View style={[styles.iconContainer, { backgroundColor: theme.background, shadowColor: theme.shadow }]}>
              <PaymentFailedSvg width={120} height={120} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Payment Failed — But We've Got You Covered!</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your order hasn't been cancelled. Please retry to confirm it.
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,0,0,0.1)' : theme.mode === 'orange' ? 'rgba(255,0,0,0.1)' : '#FDEDEC' }]}>
              <Ionicons name="close-circle" size={18} color={theme.error} />
              <Text style={[styles.badgeText, { color: theme.error }]}>Transaction Failed</Text>
            </View>
          </View>

          {/* Transaction Details in 2x2 Matrix */}
          <View style={[styles.transactionSection, { backgroundColor: theme.transactionDetailsBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Transaction Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Order ID</Text>
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>#RESTO4587</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Payment Method</Text>
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{paymentMethodDisplay}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Attempted On</Text>
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{attemptedAt}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Amount</Text>
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{formatCurrency(totals.total)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Refund Information */}
          <View style={styles.refundInfo}>
            <Ionicons name="information-circle" size={20} color={theme.textSecondary} />
            <Text style={[styles.refundText, { color: theme.textSecondary }]}>
              If your amount was debited, it will be auto-refunded within 3-5 business days.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.primary, { backgroundColor: theme.buttonPrimary }]} 
              onPress={() => router.replace('/payment')}
            >
              <Ionicons name="refresh" size={20} color={theme.buttonText} />
              <Text style={[styles.primaryText, { color: theme.buttonText }]}>Retry Secure Payment</Text>
            </TouchableOpacity>
            
            <Text style={[styles.alternativeText, { color: theme.textSecondary }]}>
              Alternatively, you can try another option
            </Text>
            
            <TouchableOpacity 
              style={[styles.secondary, { backgroundColor: theme.tryAnotherMethodBg, borderColor: theme.tryAnotherMethodBg }]} 
              onPress={() => router.replace('/payment')}
            >
              <Ionicons name="card-outline" size={18} color={theme.tryAnotherMethodText} />
              <Text style={[styles.secondaryText, { color: theme.tryAnotherMethodText }]}>Try with Another Method</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondary, { backgroundColor: theme.contactSupportBg, borderColor: theme.contactSupportBg }]} 
              onPress={() => router.replace('/contact')}
            >
              <Ionicons name="headset-outline" size={18} color={theme.contactSupportText} />
              <Text style={[styles.secondaryText, { color: theme.contactSupportText }]}>Contact Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondary, { backgroundColor: theme.backToCheckoutBg, borderColor: theme.backToCheckoutBg }]} 
              onPress={() => router.replace('/checkout')}
            >
              <Ionicons name="arrow-back" size={18} color={theme.backToCheckoutText} />
              <Text style={[styles.secondaryText, { color: theme.backToCheckoutText }]}> Back to Checkout</Text>
            </TouchableOpacity>
          </View>

          {/* Countdown Timer */}
          <View style={[styles.timerContainer, { borderColor: theme.divider }]}>
            <Text style={[styles.timerText, { color: theme.textSecondary }]}>
              Redirecting you to your order summary in <Text style={[styles.timerNumber, { color: theme.textPrimary }]}>{countdown}</Text> seconds...
            </Text>
            <TouchableOpacity 
              style={[styles.goNowButton, { backgroundColor: theme.buttonPrimary }]} 
              onPress={handleGoNow}
            >
              <Text style={[styles.goNowText, { color: theme.buttonText }]}>Go Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNav active="cart" />
    </View>
  );
};


const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 120 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  center: { 
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 14, 
    fontWeight: '400', 
    textAlign: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  badgeText: { 
    fontSize: 13,
    fontWeight: '700' 
  },
  transactionSection: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 16 
  },
  detailsGrid: {
    gap: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  detailLabel: { 
    fontSize: 13, 
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: { 
    fontSize: 14, 
    fontWeight: '700' 
  },
  refundInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  refundText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: { 
    gap: 12, 
    marginTop: 8 
  },
  primary: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14, 
    borderRadius: 12,
  },
  primaryText: { 
    fontSize: 15,
    fontWeight: '800' 
  },
  alternativeText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: { 
    fontSize: 14,
    fontWeight: '700' 
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  timerText: {
    flex: 1,
    fontSize: 13,
  },
  timerNumber: {
    fontWeight: '700',
  },
  goNowButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  goNowText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default PaymentFailureScreen;
