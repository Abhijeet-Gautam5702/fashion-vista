import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cartTotal: 0,
};

const cartSlice = createSlice({
  name: "cart", // to be used when registering in the store
  initialState,
  reducers: {
    storeClearCart: (state, action) => {
      state.cart = [];
      state.cartTotal = 0;
    },
    storePopulateCart: (state, action) => {
      state.cart = action.payload.cart;
      // update cart total
      state.cartTotal = 0;
      state.cart.forEach(
        (item) => (state.cartTotal += item.quantity * item.product.price)
      );
    },
  },
});

// export cartSlice reducers individually
export const { storeClearCart, storePopulateCart } = cartSlice.actions;

// export all reducers as a single cartReducer and register it in the store
export const cartReducer = cartSlice.reducer;
