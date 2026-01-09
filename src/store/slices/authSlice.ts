import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../services/authAPI';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface RegisteredUser {
  id: string;
  emailOrPhone: string;
  password: string;
  email?: string;
  phone?: string;
  name?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
}

export interface PasswordResetState {
  email: string;
  otpVerified: boolean;
  step: 'email' | 'otp' | 'password' | 'complete';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  registeredUsers: RegisteredUser[]; // Store all registered users
  passwordReset: PasswordResetState;
  signupPending: {
    emailOrPhone: string;
    password: string;
    email?: string;
    phone?: string;
    name?: string;
  } | null;
  twoFactorEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  registeredUsers: [], // Initialize empty array
  passwordReset: {
    email: '',
    otpVerified: false,
    step: 'email',
  },
  signupPending: null,
  twoFactorEnabled: false,
};

// Async thunks for API calls
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (emailOrPhone: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendOTP(emailOrPhone);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ emailOrPhone, otp }: { emailOrPhone: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(emailOrPhone, otp);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ emailOrPhone, password }: { emailOrPhone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(emailOrPhone, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { emailOrPhone, password }: { emailOrPhone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.signup(emailOrPhone, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.googleSignIn(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Google sign in failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.resetPassword(oldPassword, newPassword);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    return null;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOTPState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // Set pending signup data (before OTP verification)
    setSignupPending: (state, action: PayloadAction<AuthState['signupPending']>) => {
      state.signupPending = action.payload;
    },
    // Clear pending signup data
    clearSignupPending: (state) => {
      state.signupPending = null;
    },
    // Complete signup after OTP verification
    completeSignup: (state) => {
      if (state.signupPending) {
        const newUser: RegisteredUser = {
          ...state.signupPending,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        state.registeredUsers.push(newUser);
        state.signupPending = null;
      }
    },
    // Register a new user (for direct signup without OTP)
    registerUser: (state, action: PayloadAction<Omit<RegisteredUser, 'id' | 'createdAt'>>) => {
      const newUser: RegisteredUser = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.registeredUsers.push(newUser);
    },
    // Update user password
    updateUserPassword: (state, action: PayloadAction<{ emailOrPhone: string; newPassword: string }>) => {
      const userIndex = state.registeredUsers.findIndex(
        (u) => u.emailOrPhone === action.payload.emailOrPhone
      );
      if (userIndex !== -1) {
        state.registeredUsers[userIndex].password = action.payload.newPassword;
      }
    },
    // Password reset actions
    setPasswordResetEmail: (state, action: PayloadAction<string>) => {
      state.passwordReset.email = action.payload;
      state.passwordReset.step = 'otp';
    },
    setPasswordResetOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.passwordReset.otpVerified = action.payload;
      if (action.payload) {
        state.passwordReset.step = 'password';
      }
    },
    resetPasswordComplete: (state) => {
      state.passwordReset = {
        email: '',
        otpVerified: false,
        step: 'complete',
      };
    },
    clearPasswordReset: (state) => {
      state.passwordReset = {
        email: '',
        otpVerified: false,
        step: 'email',
      };
    },
    setTwoFactorEnabled: (state, action: PayloadAction<boolean>) => {
      state.twoFactorEnabled = action.payload;
    },
    // Login user (set as current user)
    loginUser: (state, action: PayloadAction<string>) => {
      const user = state.registeredUsers.find((u) => u.emailOrPhone === action.payload);
      if (user) {
        state.user = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          fullName: user.fullName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        };
        state.isAuthenticated = true;
      }
    },
    // Logout user
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    // Check if user exists (helper - actual check happens in selector)
    checkUserExists: (state, action: PayloadAction<string>) => {
      return state;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      const fallbackId =
        state.user?.id ||
        (state.registeredUsers.length > 0 ? state.registeredUsers[state.registeredUsers.length - 1].id : null);

      if (!fallbackId) return;

      state.user = { ...(state.user || { id: fallbackId }), ...action.payload };

      const userIndex = state.registeredUsers.findIndex((u) => u.id === fallbackId);
      if (userIndex !== -1) {
        state.registeredUsers[userIndex] = {
          ...state.registeredUsers[userIndex],
          ...action.payload,
          name: action.payload.fullName ?? state.registeredUsers[userIndex].name,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.otpSent = false;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpVerified = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.otpVerified = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Google Sign In
    builder
      .addCase(googleSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpVerified = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearOTPState, 
  setUser, 
  registerUser,
  setSignupPending,
  clearSignupPending,
  completeSignup,
  updateUserPassword,
  setPasswordResetEmail,
  setPasswordResetOtpVerified,
  resetPasswordComplete,
  clearPasswordReset,
  loginUser,
  logoutUser,
  updateProfile,
  setTwoFactorEnabled,
} = authSlice.actions;

// Selectors
export const selectRegisteredUsers = (state: { auth: AuthState }) => state.auth.registeredUsers;
export const selectUserByEmailOrPhone = (state: { auth: AuthState }, emailOrPhone: string) =>
  state.auth.registeredUsers.find((user) => user.emailOrPhone === emailOrPhone);

export default authSlice.reducer;

