/**
 * Web-compatible version of Stripe Service
 * Stripe React Native SDK doesn't work on web, so this provides a fallback
 */

export interface PaymentIntentParams {
  amount: number;
  currency?: string;
  customerId?: string;
  paymentMethodId?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const createPaymentIntent = async (
  params: PaymentIntentParams
): Promise<PaymentIntentResponse> => {
  throw new Error('Stripe Payment Sheet is not available on web platform. Please use mobile app for card payments.');
};

export const initializePaymentSheet = async (
  clientSecret: string,
  customerId?: string,
  customerEphemeralKeySecret?: string
): Promise<{ error?: any }> => {
  throw new Error('Stripe Payment Sheet is not available on web platform.');
};

export const presentPaymentSheetToUser = async (): Promise<{
  error?: any;
}> => {
  throw new Error('Stripe Payment Sheet is not available on web platform.');
};

export const processPayment = async (
  amount: number,
  onSuccess?: () => void,
  onError?: (error: any) => void
): Promise<void> => {
  onError?.({
    code: 'WebNotSupported',
    message: 'Card payments are only available on mobile devices. Please use UPI or Cash payment methods.',
    localizedMessage: 'Card payments are only available on mobile devices.',
    declineCode: null,
    type: 'WebNotSupported',
  });
};
