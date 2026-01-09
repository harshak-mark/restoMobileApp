import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VerificationStatus = 'verified' | 'unverified';

export interface UpiAccount {
  id: string;
  provider: 'gpay' | 'phonepe' | 'paytm' | 'other';
  upiId: string;
  status: VerificationStatus;
}

export interface CardPayment {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  name: string; // Cardholder name
  maskedNumber: string; // e.g., **** 1234
  expires: string; // MM/YYYY
  status: VerificationStatus;
}

export interface PaymentState {
  upiList: UpiAccount[];
  cardList: CardPayment[];
  defaultUpiId: string | null;
  defaultCardId: string | null;
}

const initialState: PaymentState = {
  upiList: [],
  cardList: [],
  defaultUpiId: null,
  defaultCardId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addUpi: (state, action: PayloadAction<Omit<UpiAccount, 'id'>>) => {
      const newItem: UpiAccount = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.upiList.push(newItem);
      // If this is the first UPI, automatically set it as default
      if (state.upiList.length === 1) {
        state.defaultUpiId = newItem.id;
      }
    },
    addCard: (state, action: PayloadAction<Omit<CardPayment, 'id'>>) => {
      const newItem: CardPayment = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.cardList.push(newItem);
      // If this is the first card, automatically set it as default
      if (state.cardList.length === 1) {
        state.defaultCardId = newItem.id;
      }
    },
    removeUpi: (state, action: PayloadAction<string>) => {
      state.upiList = state.upiList.filter((item) => item.id !== action.payload);
      // If removed UPI was default, set first remaining UPI as default (or null if none)
      if (state.defaultUpiId === action.payload) {
        state.defaultUpiId = state.upiList.length > 0 ? state.upiList[0].id : null;
      }
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cardList = state.cardList.filter((item) => item.id !== action.payload);
      // If removed card was default, set first remaining card as default (or null if none)
      if (state.defaultCardId === action.payload) {
        state.defaultCardId = state.cardList.length > 0 ? state.cardList[0].id : null;
      }
    },
    updateUpiStatus: (state, action: PayloadAction<{ id: string; status: VerificationStatus }>) => {
      const idx = state.upiList.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.upiList[idx].status = action.payload.status;
    },
    updateCardStatus: (state, action: PayloadAction<{ id: string; status: VerificationStatus }>) => {
      const idx = state.cardList.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.cardList[idx].status = action.payload.status;
    },
    updateCard: (state, action: PayloadAction<CardPayment>) => {
      const idx = state.cardList.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.cardList[idx] = action.payload;
      }
    },
    updateUpi: (state, action: PayloadAction<UpiAccount>) => {
      const idx = state.upiList.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.upiList[idx] = action.payload;
      }
    },
    setDefaultUpi: (state, action: PayloadAction<string>) => {
      // Only set as default if the UPI exists
      const upiExists = state.upiList.some((upi) => upi.id === action.payload);
      if (upiExists) {
        state.defaultUpiId = action.payload;
      }
    },
    setDefaultCard: (state, action: PayloadAction<string>) => {
      // Only set as default if the card exists
      const cardExists = state.cardList.some((card) => card.id === action.payload);
      if (cardExists) {
        state.defaultCardId = action.payload;
      }
    },
  },
});

export const { addUpi, addCard, removeUpi, removeCard, updateUpiStatus, updateCardStatus, updateCard, updateUpi, setDefaultUpi, setDefaultCard } =
  paymentSlice.actions;
export default paymentSlice.reducer;
