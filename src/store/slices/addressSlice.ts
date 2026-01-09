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
  defaultAddressId: string | null;
}

const initialState: AddressState = {
  items: [],
  selectedAddressId: null,
  defaultAddressId: null,
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
      // If this is the first address, automatically set it as default
      if (state.items.length === 1) {
        state.defaultAddressId = newAddress.id;
      }
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
      // If removed address was default, set first remaining address as default (or null if none)
      if (state.defaultAddressId === action.payload) {
        state.defaultAddressId = state.items.length > 0 ? state.items[0].id : null;
      }
    },
    clearAddresses: (state) => {
      state.items = [];
      state.selectedAddressId = null;
    },
    setSelectedAddress: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      // Only set as default if the address exists
      const addressExists = state.items.some((addr) => addr.id === action.payload);
      if (addressExists) {
        state.defaultAddressId = action.payload;
      }
    },
  },
});

export const { addAddress, updateAddress, removeAddress, clearAddresses, setSelectedAddress, setDefaultAddress } = addressSlice.actions;
export default addressSlice.reducer;
