import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type OrderStatus = 'ongoing' | 'history';

export type Order = {
  id: string;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  placedAt: string;
  status: OrderStatus;
};

type OrdersState = {
  list: Order[];
};

const initialState: OrdersState = {
  list: [],
};

type PlaceOrderPayload = {
  orderId: string;
  total: number;
  items: CartItem[];
  paymentMethod: string;
  status?: OrderStatus;
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<PlaceOrderPayload>) => {
      const { orderId, total, items, paymentMethod, status = 'history' } = action.payload;
      state.list.unshift({
        id: orderId,
        total,
        paymentMethod,
        placedAt: new Date().toISOString(),
        status,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });
    },
    clearOrders: (state) => {
      state.list = [];
    },
  },
});

export const { placeOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

