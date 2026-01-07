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
}

const initialState: PaymentState = {
  upiList: [],
  cardList: [],
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
    },
    addCard: (state, action: PayloadAction<Omit<CardPayment, 'id'>>) => {
      const newItem: CardPayment = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.cardList.push(newItem);
    },
    removeUpi: (state, action: PayloadAction<string>) => {
      state.upiList = state.upiList.filter((item) => item.id !== action.payload);
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cardList = state.cardList.filter((item) => item.id !== action.payload);
    },
    updateUpiStatus: (state, action: PayloadAction<{ id: string; status: VerificationStatus }>) => {
      const idx = state.upiList.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.upiList[idx].status = action.payload.status;
    },
    updateCardStatus: (state, action: PayloadAction<{ id: string; status: VerificationStatus }>) => {
      const idx = state.cardList.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.cardList[idx].status = action.payload.status;
    },
  },
});

export const { addUpi, addCard, removeUpi, removeCard, updateUpiStatus, updateCardStatus } =
  paymentSlice.actions;
export default paymentSlice.reducer;
