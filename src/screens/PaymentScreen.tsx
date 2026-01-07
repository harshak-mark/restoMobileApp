import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { selectCartTotals } from '../store/slices/cartSlice';
import { CardPayment, UpiAccount } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

type TabKey = 'card' | 'upi' | 'cash';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'card', label: 'Card', icon: 'card-outline' },
  { key: 'upi', label: 'UPI', icon: 'qr-code-outline' },
  { key: 'cash', label: 'Cash', icon: 'cash-outline' },
];

const PaymentScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();
  const cardList = useAppSelector((state) => state.payment.cardList);
  const upiList = useAppSelector((state) => state.payment.upiList);
  const totals = useAppSelector(selectCartTotals);

  const [tab, setTab] = useState<TabKey>('card');
  const [showCardOtp, setShowCardOtp] = useState(false);
  const [cardOtp, setCardOtp] = useState('');
  const [cardOtpError, setCardOtpError] = useState('');
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showPaymentButtons, setShowPaymentButtons] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState<string | null>(null);

  // Read tab from URL params
  useEffect(() => {
    if (params.tab && (params.tab === 'card' || params.tab === 'upi' || params.tab === 'cash')) {
      setTab(params.tab as TabKey);
    }
  }, [params.tab]);

  // Timer for processing modal - show buttons after 5 seconds
  useEffect(() => {
    if (showProcessingModal && !showPaymentButtons) {
      const timer = setTimeout(() => {
        setShowPaymentButtons(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showProcessingModal, showPaymentButtons]);

  const hasMethods = useMemo(() => {
    if (tab === 'card') return cardList.length > 0;
    if (tab === 'upi') return true; // allow QR even without saved IDs
    return true;
  }, [tab, cardList.length]);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  const handleAdd = () => {
    if (tab === 'card') {
      router.push('/settings/payment/card?next=/payment');
    } else if (tab === 'upi') {
      router.push('/settings/payment/upi?next=/payment');
    }
  };

  const handleContinue = () => {
    if (tab === 'cash') {
      router.push('/payment/success?method=cash');
      return;
    }

    // For UPI with no saved IDs, fall back to QR flow
    if (tab === 'upi' && upiList.length === 0) {
      router.push('/payment/qr');
      return;
    }

    // Card flow requires OTP before success
    if (tab === 'card') {
      setShowCardOtp(true);
      return;
    }

    // UPI flow - show processing modal
    if (tab === 'upi' && upiList.length > 0) {
      // Use first UPI ID if available
      setSelectedUpiId(upiList[0]?.id || null);
      setShowProcessingModal(true);
      setShowPaymentButtons(false);
      return;
    }

    router.push(`/payment/success?method=${tab}`);
  };

  const handlePaid = () => {
    setShowProcessingModal(false);
    setShowPaymentButtons(false);
    if (selectedUpiId) {
      router.push(`/payment/success?method=upi&upiId=${selectedUpiId}`);
    } else {
      router.push('/payment/success?method=upi');
    }
  };

  const handleNotPaid = () => {
    setShowProcessingModal(false);
    setShowPaymentButtons(false);
    if (selectedUpiId) {
      router.push(`/payment/failure?method=upi&upiId=${selectedUpiId}`);
    } else {
      router.push('/payment/failure?method=upi');
    }
  };

  const renderCardItem = (item: CardPayment) => (
    <View key={item.id} style={[styles.listCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <View style={styles.listHeader}>
        <View style={styles.listLeft}>
          <Ionicons name="card-outline" size={22} color={theme.textPrimary} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{cardTitle(item.brand)}</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>Card no : {item.maskedNumber}</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>Expires : {item.expires}</Text>
          </View>
        </View>
        <Verification status={item.status} />
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity>
          <Ionicons name="pencil" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUpiItem = (item: UpiAccount) => (
    <View key={item.id} style={[styles.listCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <View style={styles.listHeader}>
        <View style={styles.listLeft}>
          <Ionicons name="logo-google" size={22} color={theme.textPrimary} />
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{providerLabel(item.provider)}</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>UPI ID : {item.upiId}</Text>
          </View>
        </View>
        <Verification status={item.status} />
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity>
          <Ionicons name="pencil" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMethods = () => {
    if (tab === 'card') {
      if (cardList.length === 0) return <EmptyState text="No cards saved. Add new." />;
      return cardList.map(renderCardItem);
    }
    if (tab === 'upi') {
      if (upiList.length === 0) return <EmptyState text="No UPI ID exists. Add new or pay via QR." />;
      return upiList.map(renderUpiItem);
    }
    return (
      <View style={[styles.cashCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Cash on delivery</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Due to handling costs a nominal fee of ₹9 will be charged for orders placed using this option.
          Avoid this fee by paying online now.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Payment Method</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const selected = t.key === tab;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tab,
                  {
                    backgroundColor: selected ? theme.backgroundSecondary : theme.background,
                    borderColor: selected ? theme.buttonPrimary : theme.divider,
                  },
                ]}
                onPress={() => setTab(t.key)}
              >
                <Ionicons
                  name={t.icon}
                  size={22}
                  color={selected ? theme.buttonPrimary : theme.textSecondary}
                  style={{ marginBottom: 6 }}
                />
                <Text style={[styles.tabLabel, { color: selected ? theme.buttonPrimary : theme.textSecondary }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.methods}>{renderMethods()}</View>

        {tab !== 'cash' && (
          <View style={styles.addRow}>
            <TouchableOpacity style={styles.addLink} onPress={handleAdd}>
              <Ionicons name="add" size={16} color={theme.buttonPrimary} />
              <Text style={[styles.addText, { color: theme.buttonPrimary }]}>
                {tab === 'card' ? 'Add New Card' : 'Add New UPI'}
              </Text>
            </TouchableOpacity>
            {tab === 'upi' && (
                <TouchableOpacity style={styles.addLink} onPress={() => router.push('/payment/qr')}>
                <Ionicons name="qr-code-outline" size={16} color={theme.buttonPrimary} />
            <Text style={[styles.addText, { color: theme.buttonPrimary }]}>Pay via QR</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={[styles.summaryCard, { backgroundColor: theme.buttonPrimary }]}>
          <Text style={[styles.summaryTitle, { color: theme.buttonText }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>GST (5%)</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.gst)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Service Charge</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.serviceCharge)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Discount</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.discount)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.buttonText }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: theme.buttonText }]}>{formatCurrency(totals.total)}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={16} color={theme.buttonText} />
            <Text style={[styles.deliveryText, { color: theme.buttonText }]}>
              Your order will be ready in 25 mins
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.payButton,
              { backgroundColor: hasMethods ? theme.buttonText : '#ddd' },
            ]}
            disabled={!hasMethods}
            onPress={handleContinue}
          >
            <Text style={[styles.payText, { color: theme.buttonPrimary }]}>Continue Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />

      {/* Card OTP Modal */}
      {showCardOtp && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setShowCardOtp(false)}>
          <View style={styles.otpOverlay}>
            <View style={[styles.otpCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.otpTitle, { color: theme.textPrimary }]}>Enter 6-digit OTP</Text>
              <Text style={[styles.otpSubtitle, { color: theme.textSecondary }]}>
                We sent an OTP to your bank-registered number.
              </Text>
              <TextInput
                style={[
                  styles.otpInput,
                  {
                    borderColor: cardOtpError ? theme.error : theme.divider,
                    color: theme.textPrimary,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                value={cardOtp}
                onChangeText={(text) => {
                  const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
                  setCardOtp(digits);
                  if (cardOtpError) setCardOtpError('');
                }}
                placeholder="******"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={6}
              />
              {!!cardOtpError && <Text style={[styles.otpError, { color: theme.error }]}>{cardOtpError}</Text>}
              <View style={styles.otpActions}>
                <TouchableOpacity
                  style={[styles.otpButton, { backgroundColor: theme.buttonSecondary }]}
                  onPress={() => setShowCardOtp(false)}
                >
                  <Text style={[styles.otpButtonText, { color: theme.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.otpButton, { backgroundColor: theme.buttonPrimary }]}
                  onPress={() => {
                    if (cardOtp.length !== 6) {
                      setCardOtpError('Enter 6 digits');
                      return;
                    }
                    setShowCardOtp(false);
                    router.push(`/payment/success?method=${tab}`);
                  }}
                >
                  <Text style={[styles.otpButtonText, { color: theme.buttonText }]}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Processing Modal */}
      {showProcessingModal && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setShowProcessingModal(false)}>
          <View style={styles.otpOverlay}>
            <View style={[styles.otpCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.otpTitle, { color: theme.textPrimary }]}>Redirecting to payment</Text>
              {!showPaymentButtons ? (
                <>
                  <ActivityIndicator size="large" color={theme.buttonPrimary} style={styles.processingSpinner} />
                  <Text style={[styles.otpSubtitle, { color: theme.textSecondary, marginTop: 16 }]}>
                    You will be redirected to your bank's website. It might take a few seconds.
                  </Text>
                  <Text style={[styles.otpSubtitle, { color: theme.textSecondary, marginTop: 8, fontSize: 12 }]}>
                    Please do not refresh the page or click the "Back" or "Close" button of your browser.
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.paymentButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.paymentButton, { backgroundColor: theme.success }]}
                      onPress={handlePaid}
                    >
                      <Text style={[styles.paymentButtonText, { color: theme.buttonText }]}>Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.paymentButton, { backgroundColor: theme.error }]}
                      onPress={handleNotPaid}
                    >
                      <Text style={[styles.paymentButtonText, { color: theme.buttonText }]}>Not Paid</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const Verification = ({ status }: { status: 'verified' | 'unverified' }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.verification}>
      <Ionicons
        name={status === 'verified' ? 'checkmark-circle' : 'alert-circle-outline'}
        size={16}
        color={status === 'verified' ? theme.success : theme.textSecondary}
      />
      <Text style={[styles.verificationText, { color: status === 'verified' ? theme.success : theme.textSecondary }]}>
        {status === 'verified' ? 'Verified' : 'Unverified'}
      </Text>
    </View>
  );
};

const EmptyState = ({ text }: { text: string }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  );
};

const providerLabel = (provider: string) => {
  switch (provider) {
    case 'gpay':
      return 'Google Pay';
    case 'phonepe':
      return 'Phone Pe';
    case 'paytm':
      return 'Paytm';
    default:
      return 'UPI';
  }
};

const cardTitle = (brand: string) => {
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  content: {
    padding: 20,
    paddingBottom: 160,
    gap: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  methods: {
    gap: 10,
  },
  listCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cashCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addText: {
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  payButton: {
    marginTop: 6,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontSize: 16,
    fontWeight: '700',
  },
  verification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  otpOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpCard: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  otpSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    letterSpacing: 6,
    textAlign: 'center',
  },
  otpError: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  otpButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  otpButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  processingSpinner: {
    marginVertical: 24,
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentScreen;
