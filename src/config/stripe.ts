/**
 * Stripe Configuration
 * 
 * For test mode, use your test publishable key from Stripe Dashboard
 * Get your keys from: https://dashboard.stripe.com/test/apikeys
 * 
 * IMPORTANT: Never commit your secret key to version control
 * For production, use environment variables or secure key management
 */

// Stripe Publishable Key (Test Mode)
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S2r4MHjbGwgUKZoTqQXnCDcdRfkf3BDPA7u8gnsdGxLUIqu88TQpQre9tqTWsngYyRZ0wz8CMhajt34mMMjXbJq000yu0OmRw';

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  merchantIdentifier: 'merchant.com.anonymous.ReactNative', // For Apple Pay (iOS)
  // Set to true for production
  isProduction: false,
};

// Currency configuration
export const CURRENCY = 'inr'; // Indian Rupee
export const CURRENCY_SYMBOL = '₹';

// Helper function to convert amount to Stripe's smallest currency unit (paise for INR)
export const convertToStripeAmount = (amount: number): number => {
  // For INR, multiply by 100 to convert to paise
  return Math.round(amount * 100);
};

// Helper function to convert from Stripe amount back to display amount
export const convertFromStripeAmount = (amount: number): number => {
  // For INR, divide by 100 to convert from paise
  return amount / 100;
};

