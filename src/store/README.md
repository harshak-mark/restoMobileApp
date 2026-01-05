# Redux Store Setup

This directory contains the Redux store configuration using Redux Toolkit.

## Structure

```
store/
├── store.ts              # Store configuration
├── slices/
│   └── authSlice.ts      # Authentication slice with async thunks
├── services/
│   └── authAPI.ts       # API service layer using axios
└── hooks.ts             # Typed Redux hooks
```

## Usage

### In Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, sendOTP, verifyOTP } from '../store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(login({ emailOrPhone: 'user@example.com', password: 'password123' })).unwrap();
      // Login successful
    } catch (error) {
      // Handle error
      console.error('Login failed:', error);
    }
  };

  return (
    // Your component JSX
  );
}
```

### API Integration

To integrate with your actual API:

1. Update `src/constants/api.ts` with your API base URL
2. Update `src/store/services/authAPI.ts` with your actual API endpoints
3. Replace mock implementations with actual axios calls

Example:
```typescript
// In authAPI.ts
sendOTP: async (emailOrPhone: string): Promise<SendOTPResponse> => {
  const response = await apiClient.post('/auth/send-otp', { emailOrPhone });
  return response.data;
},
```

### Adding New Slices

To add a new slice (e.g., for user profile):

1. Create `src/store/slices/userSlice.ts`
2. Add the reducer to `src/store/store.ts`:
```typescript
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Add here
  },
});
```

## Available Actions

### Auth Slice

- `sendOTP(emailOrPhone)` - Send OTP to email/phone
- `verifyOTP({ emailOrPhone, otp })` - Verify OTP
- `login({ emailOrPhone, password })` - Login user
- `signup({ emailOrPhone, password })` - Signup user
- `googleSignIn(token)` - Google OAuth sign in
- `resetPassword({ oldPassword, newPassword })` - Reset password
- `logout()` - Logout user
- `clearError()` - Clear error state
- `clearOTPState()` - Clear OTP state
- `setUser(user)` - Set user manually

## State Shape

```typescript
{
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    otpSent: boolean;
    otpVerified: boolean;
  }
}
```





