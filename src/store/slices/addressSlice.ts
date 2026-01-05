import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  address: string;
  city: string;
  pinCode: string;
  landmark?: string;
  label: AddressLabel;
  coords?: {
    lat: number;
    lng: number;
  };
}

export interface AddressState {
  items: Address[];
  selectedAddressId: string | null;
}

const initialState: AddressState = {
  items: [],
  selectedAddressId: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
      const newAddress: Address = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.items.push(newAddress);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const idx = state.items.findIndex((addr) => addr.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((addr) => addr.id !== action.payload);
      // If removed address was selected, clear selection or select first available
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.items.length > 0 ? state.items[0].id : null;
      }
    },
    clearAddresses: (state) => {
      state.items = [];
      state.selectedAddressId = null;
    },
    setSelectedAddress: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
    },
  },
});

export const { addAddress, updateAddress, removeAddress, clearAddresses, setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
