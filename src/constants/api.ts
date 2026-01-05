// API Configuration
// TODO: Replace with your actual API base URL
import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api' // Development URL
    : 'https://api.yourdomain.com/api'); // Production URL

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    GOOGLE_SIGNIN: '/auth/google',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
  },
} as const;

