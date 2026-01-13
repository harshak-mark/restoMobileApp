import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Redux store or AsyncStorage
    // For now, we'll handle this in the component level
    // You can enhance this later with token from store
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token, redirect to login
      // This can be enhanced later
    }
    return Promise.reject(error);
  }
);

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  token: string;
}

export interface SignupResponse {
  success: boolean;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  token: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authAPI = {
  sendOTP: async (emailOrPhone: string): Promise<SendOTPResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/send-otp', { emailOrPhone });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'OTP sent successfully',
        });
      }, 1000);
    });
  },

  verifyOTP: async (emailOrPhone: string, otp: string): Promise<VerifyOTPResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/verify-otp', { emailOrPhone, otp });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'OTP verified successfully',
          token: 'mock-token-' + Date.now(),
        });
      }, 1000);
    });
  },

  login: async (emailOrPhone: string, password: string): Promise<LoginResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/login', { emailOrPhone, password });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
            phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
          },
          token: 'mock-token-' + Date.now(),
        });
      }, 1000);
    });
  },

  signup: async (emailOrPhone: string, password: string): Promise<SignupResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/signup', { emailOrPhone, password });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
            phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
          },
          token: 'mock-token-' + Date.now(),
        });
      }, 1000);
    });
  },

  googleSignIn: async (token: string): Promise<LoginResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/google', { token });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            email: 'user@gmail.com',
            name: 'Google User',
          },
          token: 'mock-token-' + Date.now(),
        });
      }, 1000);
    });
  },

  resetPassword: async (oldPassword: string, newPassword: string): Promise<ResetPasswordResponse> => {
    // TODO: Replace with actual API endpoint
    // const response = await apiClient.post('/auth/reset-password', { oldPassword, newPassword });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset successfully',
        });
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    // TODO: Replace with actual API endpoint
    // await apiClient.post('/auth/logout');
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};

export default apiClient;






