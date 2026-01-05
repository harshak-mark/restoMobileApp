import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import addressReducer from './slices/addressSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import paymentReducer from './slices/paymentSlice';
import ordersReducer from './slices/ordersSlice';

// Create web-compatible storage
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use noop storage for web (to avoid AsyncStorage issues), AsyncStorage for native
const storage = Platform.OS === 'web' 
  ? createNoopStorage() 
  : AsyncStorage;

// Persist config
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['registeredUsers', 'user', 'isAuthenticated', 'token'], // Only persist these fields
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    address: addressReducer,
    cart: cartReducer,
    payment: paymentReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

