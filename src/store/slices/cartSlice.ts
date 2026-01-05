import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodItem } from '../../data/foodItems';
import type { RootState } from '../store';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  // Keep store serializable by only storing string ids/uris, not components
  imageId: string;
  imageUri?: string;
  rating?: number;
  quantity: number;
};

type CartState = {
  items: Record<string, CartItem>;
};

type AddItemPayload = {
  item: FoodItem;
  quantity?: number;
};

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AddItemPayload>) => {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items[item.id];

      if (existing) {
        existing.quantity += quantity;
        return;
      }

      state.items[item.id] = {
        id: item.id,
        name: item.name,
        price: item.price ?? 0,
        imageId: item.id,
        imageUri: typeof item.image === 'string' ? item.image : undefined,
        rating: item.rating,
        quantity,
      };
    },
    increment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].quantity += 1;
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.items[id]) return;

      state.items[id].quantity -= 1;
      if (state.items[id].quantity <= 0) {
        delete state.items[id];
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, increment, decrement, clearCart } = cartSlice.actions;

// Memoize selectCartItems to prevent unnecessary rerenders
export const selectCartItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => Object.values(items)
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

export const selectCartTotals = createSelector(selectCartSubtotal, (subtotal) => {
  const gst = subtotal * 0.05;
  const serviceCharge = 10;
  const discount = 0;
  const total = subtotal + gst + serviceCharge - discount;

  return {
    subtotal,
    gst,
    serviceCharge,
    discount,
    total,
  };
});

export default cartSlice.reducer;
