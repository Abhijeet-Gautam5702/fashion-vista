import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cartTotal: 0,
};

const cartSlice = createSlice({
  name: "cart", // to be used when registering in the store
  initialState,
  reducers: {
    storeUpdateItemQtInCart: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (
          item.product._id === action.payload.productId &&
          item.size === action.payload.size
        ) {
          item.quantity = action.payload.qt;
        }
        return item;
      });

      // update cart total
      state.cartTotal = 0;
      state.cart.forEach(
        (item) => (state.cartTotal += item.quantity * item.product.price)
      );
      state.cartTotal = Math.round(state.cartTotal * 100) / 100;
    },
    storeDeleteItemFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => {
        if (
          item.product._id === action.payload.productId &&
          item.size === action.payload.size
        ) {
          return;
        }
        return item;
      });

      // update cart total
      state.cartTotal = 0;
      state.cart.forEach(
        (item) => (state.cartTotal += item.quantity * item.product.price)
      );
      state.cartTotal = Math.round(state.cartTotal * 100) / 100;
    },
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
      state.cartTotal = Math.round(state.cartTotal * 100) / 100;
    },
  },
});

// export cartSlice reducers individually
export const {
  storeDeleteItemFromCart,
  storeUpdateItemQtInCart,
  storeClearCart,
  storePopulateCart,
} = cartSlice.actions;

// export all reducers as a single cartReducer and register it in the store
export const cartReducer = cartSlice.reducer;
