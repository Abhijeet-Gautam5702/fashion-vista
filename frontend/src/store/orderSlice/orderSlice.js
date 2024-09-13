import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order", // to be used when registering in the store
  initialState,
  reducers: {
    storePopulateOrders: (state, action) => {
      state.orders=action.payload.orders
    },
    storeAddOrder: (state, action) => {
      state.orders.push(action.payload.order);
    },
    storeCancelOrder: (state, action) => {}, // only if the status of the order is not "shipped" or "out for delivery" or "delivered"
  },
});
// export orderSlice reducers individually
export const {storeAddOrder, storePopulateOrders, storeCancelOrder } = orderSlice.actions;

// export all reducers as a single orderReducer and register it in the store
export const orderReducer = orderSlice.reducer;
