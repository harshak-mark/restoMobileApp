// This file is only imported on native platforms, so it's safe to import Stripe here
// @ts-ignore - Stripe React Native types may not be available
import { PaymentSheetError, StripeError, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { CURRENCY, convertToStripeAmount } from '../config/stripe';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export interface PaymentIntentParams {
  amount: number; // Amount in main currency unit (e.g., ₹52.00)
  currency?: string;
  customerId?: string;
  paymentMethodId?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Backend API endpoint for creating Payment Intent
 * Uses API_BASE_URL from constants, or falls back to environment variable
 */
const BACKEND_API_URL = API_BASE_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';

/**
 * Create a Payment Intent
 * 
 * IMPORTANT: This MUST be done on your backend server for security.
 * Never create Payment Intents on the client side in production.
 * 
 * Backend endpoint should:
 * 1. Receive the amount from the client
 * 2. Create a Payment Intent using your Stripe secret key
 * 3. Return the client_secret to the client
 * 
 * Example backend implementation (Node.js):
 * ```javascript
 * app.post('/api/create-payment-intent', async (req, res) => {
 *   const { amount, currency } = req.body;
 *   const paymentIntent = await stripe.paymentIntents.create({
 *     amount: amount,
 *     currency: currency || 'inr',
 *   });
 *   res.json({
 *     clientSecret: paymentIntent.client_secret,
 *     paymentIntentId: paymentIntent.id,
 *   });
 * });
 * ```
 */
export const createPaymentIntent = async (
  params: PaymentIntentParams
): Promise<PaymentIntentResponse> => {
  const { amount, currency = CURRENCY } = params;
  
  // Convert amount to smallest currency unit (paise for INR)
  const amountInSmallestUnit = convertToStripeAmount(amount);

  try {
    // Call your backend API to create Payment Intent
    const response = await fetch(`${BACKEND_API_URL}${API_ENDPOINTS.PAYMENT.CREATE_PAYMENT_INTENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInSmallestUnit,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.clientSecret) {
      throw new Error('Invalid response from backend: missing clientSecret');
    }

    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId || data.id || '',
    };
  } catch (error) {
    console.warn('Error creating payment intent:', error);
    
    // For development/testing: If backend is not available, provide helpful error
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Network'))) {
      const helpfulError = new Error(
        'Unable to connect to payment server. Please check your internet connection and ensure the backend API is running. ' +
        'For development, make sure the Go backend server is running. Start it with: cd server && go run main.go'
      );
      (helpfulError as any).isNetworkError = true;
      throw helpfulError;
    }
    
    // Re-throw with more context if it's already an Error
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Unknown error occurred while creating payment intent');
  }
};

/**
 * Initialize Payment Sheet with Payment Intent
 */
export const initializePaymentSheet = async (
  clientSecret: string,
  customerId?: string,
  customerEphemeralKeySecret?: string
): Promise<{ error?: StripeError<PaymentSheetError> }> => {
  try {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Restaurant App',
      paymentIntentClientSecret: clientSecret,
      customerId,
      customerEphemeralKeySecret,
      defaultBillingDetails: {
        // You can pre-fill billing details if available
      },
      allowsDelayedPaymentMethods: true,
      returnURL: 'reactnative://stripe-redirect',
      // Enable Apple Pay (iOS)
      applePay: {
        merchantCountryCode: 'IN', // India
      },
      // Enable Google Pay (Android)
      googlePay: {
        merchantCountryCode: 'IN', // India
        testEnv: true, // Set to false in production
        currencyCode: 'INR',
      },
    });

    if (error) {
      console.error('Error initializing payment sheet:', error);
      return { error };
    }

    return {};
  } catch (error) {
    console.warn('Exception initializing payment sheet:', error);
    const paymentSheetError: StripeError<PaymentSheetError> = {
      code: PaymentSheetError.Failed,
      message: error instanceof Error ? error.message : 'Unknown error',
      localizedMessage: error instanceof Error ? error.message : 'Unknown error',
      declineCode: undefined,
      stripeErrorCode: undefined,
      type: undefined,
    };
    return { error: paymentSheetError };
  }
};

/**
 * Present Payment Sheet to user
 */
export const presentPaymentSheetToUser = async (): Promise<{
  error?: StripeError<PaymentSheetError>;
}> => {
  try {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.warn('Error presenting payment sheet:', error);
      return { error };
    }

    return {};
  } catch (error) {
    console.warn('Exception presenting payment sheet:', error);
    const paymentSheetError: StripeError<PaymentSheetError> = {
      code: PaymentSheetError.Failed,
      message: error instanceof Error ? error.message : 'Unknown error',
      localizedMessage: error instanceof Error ? error.message : 'Unknown error',
      declineCode: undefined,
      stripeErrorCode: undefined,
      type: undefined,
    };
    return { error: paymentSheetError };
  }
};

/**
 * Complete payment flow
 * This combines creating payment intent, initializing, and presenting the sheet
 */
export const processPayment = async (
  amount: number,
  onSuccess?: () => void,
  onError?: (error: StripeError<PaymentSheetError>) => void
): Promise<void> => {
  try {
    // Step 1: Create Payment Intent
    const paymentIntent = await createPaymentIntent({ amount });
    
    // Step 2: Initialize Payment Sheet
    const initResult = await initializePaymentSheet(paymentIntent.clientSecret);
    if (initResult.error) {
      onError?.(initResult.error);
      return;
    }

    // Step 3: Present Payment Sheet
    const presentResult = await presentPaymentSheetToUser();
    if (presentResult.error) {
      onError?.(presentResult.error);
      return;
    }

    // Payment successful
    onSuccess?.();
  } catch (error) {
    console.warn('Error processing payment:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check if it's a network/backend error
      if (error.message.includes('Unable to connect') || error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to payment server. Please ensure the backend server is running at http://localhost:3000';
      }
    }
    
    const paymentSheetError: StripeError<PaymentSheetError> = {
      code: PaymentSheetError.Failed,
      message: errorMessage,
      localizedMessage: errorMessage,
      declineCode: undefined,
      stripeErrorCode: undefined,
      type: undefined,
    };
    onError?.(paymentSheetError);
  }
};

