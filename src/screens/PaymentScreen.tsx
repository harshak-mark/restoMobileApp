import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { selectCartTotals } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

// Conditionally import Stripe service based on platform
// This prevents web bundler from processing native Stripe imports
let processPayment: any = null;
let STRIPE_CONFIG: any = null;

if (Platform.OS === 'web') {
  // On web, use web implementation (no Stripe imports)
  const webService = require('../services/stripeService.web');
  processPayment = webService.processPayment;
} else {
    // On native, use native implementation
    try {
      STRIPE_CONFIG = require('../config/stripe').STRIPE_CONFIG;
      // Try to require the native service
      // Note: If this fails with OnrampSdk error, the native app needs to be rebuilt
      const nativeService = require('../services/stripeService.native');
      if (nativeService && nativeService.processPayment) {
        processPayment = nativeService.processPayment;
      } else {
        throw new Error('Stripe native service not properly exported');
      }
    } catch (error: any) {
      console.error('Failed to load Stripe native service:', error);
      // Check if it's the OnrampSdk error (native modules not properly linked)
      if (error && error.message && error.message.includes('OnrampSdk')) {
        console.error(
          'OnrampSdk module not found. This usually means the native app needs to be rebuilt.\n' +
          'Please run: npx expo prebuild && npx expo run:ios (or npx expo run:android)'
        );
      }
      // On native, don't fallback to web service - it won't work
      // Instead, set processPayment to null so we can show proper error
      processPayment = null;
    }
  }

// Conditionally import StripeProvider only on native platforms
let StripeProvider: any = null;

if (Platform.OS !== 'web') {
  try {
    // Use dynamic require to prevent web bundler from processing
    const stripeModule = require('@stripe/stripe-react-native');
    StripeProvider = stripeModule.StripeProvider;
  } catch (error) {
    console.warn('Stripe module not available:', error);
  }
}


const PaymentScreenContent = () => {
  const { theme } = useTheme();
  const totals = useAppSelector(selectCartTotals);

  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  // Handle Pay Online button - opens Stripe Payment Sheet directly
  const handlePayOnline = () => {
    // Check if platform is web
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Payment Not Available',
        'Online payments are only available on mobile devices. Please use the mobile app or select Cash on Delivery.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if Stripe is available (only on native platforms)
    if (!processPayment) {
      const errorMessage = Platform.OS === 'ios' || Platform.OS === 'android'
        ? '⚠️ Stripe requires a Development Build\n\n' +
          'If you\'re using Expo Go, Stripe won\'t work.\n\n' +
          'To fix this:\n' +
          '1. Stop the app\n' +
          '2. Run: npx expo prebuild --clean\n' +
          '3. Run: npx expo run:ios (or android)\n\n' +
          'First build takes 10-15 minutes.\n\n' +
          '💡 Use "Cash on Delivery" for now.'
        : 'Stripe payment is only available on iOS and Android devices. Please use the mobile app.';
      
      Alert.alert(
        'Development Build Required',
        errorMessage,
        [
          { text: 'Use Cash Instead', style: 'cancel', onPress: () => handleCashOnDelivery() },
          { text: 'OK' }
        ]
      );
      return;
    }

    setIsProcessingStripe(true);
    setStripeError(null);
    
    // Process payment using Stripe - this will show the Payment Sheet
    processPayment(
      totals.total,
      () => {
        // Payment successful
        setIsProcessingStripe(false);
        router.push(`/payment/success?method=card&amount=${totals.total}`);
      },
      (error: any) => {
        // Payment failed or was cancelled (including user closing the sheet)
        setIsProcessingStripe(false);
        // Clear any previous error text and navigate to the unified failure screen.
        setStripeError(null);
        router.push('/payment/failure?method=card&type=stripe');
      }
    ).catch((error: any) => {
      // Handle unexpected errors
      setIsProcessingStripe(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setStripeError(null);
      router.push('/payment/failure?method=card&type=stripe');
    });
  };

  // Handle Cash on Delivery button
  const handleCashOnDelivery = () => {
    router.push('/payment/success?method=cash');
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
        {/* Simplified Payment Options - 2 Columns */}
        <View style={styles.paymentOptionsRow}>
          {/* Pay Online - Column 1 */}
          <TouchableOpacity
            style={[
              styles.paymentOptionColumn,
              {
                backgroundColor: theme.card,
                shadowColor: theme.shadow,
                borderColor: theme.divider,
              },
            ]}
            onPress={handlePayOnline}
            disabled={isProcessingStripe}
          >
            {/* Row 1: Icon */}
            <Ionicons name="card-outline" size={32} color={theme.buttonPrimary} />
            {/* Row 2: Main Text */}
            <Text style={[styles.paymentOptionTitle, { color: theme.textPrimary }]}>
              Pay Online
            </Text>
            {/* Row 3: Subtitle */}
            <Text style={[styles.paymentOptionSubtitle, { color: theme.textSecondary }]}>
              Card, Apple Pay, Google Pay
            </Text>
          </TouchableOpacity>

          {/* Cash on Delivery - Column 2 */}
          <TouchableOpacity
            style={[
              styles.paymentOptionColumn,
              {
                backgroundColor: theme.card,
                shadowColor: theme.shadow,
                borderColor: theme.divider,
              },
            ]}
            onPress={handleCashOnDelivery}
          >
            {/* Row 1: Icon */}
            <Ionicons name="cash-outline" size={32} color={theme.buttonPrimary} />
            {/* Row 2: Main Text */}
            <Text style={[styles.paymentOptionTitle, { color: theme.textPrimary }]}>
              Cash on Delivery
            </Text>
            {/* Row 3: Subtitle */}
            <Text style={[styles.paymentOptionSubtitle, { color: theme.textSecondary }]}>
              Pay when you receive
            </Text>
          </TouchableOpacity>
        </View>

        {stripeError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.error }]}>{stripeError}</Text>
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
          {/* Processing indicator when Stripe is processing */}
          {isProcessingStripe && (
            <View style={styles.processingIndicator}>
              <ActivityIndicator size="small" color={theme.buttonText} />
              <Text style={[styles.processingText, { color: theme.buttonText }]}>
                Processing payment...
              </Text>
            </View>
          )}
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
    gap: 20,
  },
  paymentOptionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentOptionColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  paymentOptionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(211, 5, 5, 0.1)',
  },
  methods: {
    gap: 10,
  },
  listCard: {
    borderRadius: 12,
    padding: 12,
  },
  cardInfo: {
    flex: 1,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
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
    alignItems: 'center',
    gap: 12,
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
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  processingText: {
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

// Main PaymentScreen component wrapped with StripeProvider (only on native)
const PaymentScreen = () => {
  // On web, render without StripeProvider
  if (Platform.OS === 'web') {
    return <PaymentScreenContent />;
  }

  // On native platforms, wrap with StripeProvider if available
  if (StripeProvider && STRIPE_CONFIG) {
    return (
      <StripeProvider
        publishableKey={STRIPE_CONFIG.publishableKey}
        merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
      >
        <PaymentScreenContent />
      </StripeProvider>
    );
  }

  // Fallback if Stripe is not available
  return <PaymentScreenContent />;
};

export default PaymentScreen;
