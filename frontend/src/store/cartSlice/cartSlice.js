import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart", // to be used when registering in the store
  initialState,
  reducers: {
    storeAddItemToCart: (state, action) => {
      state.cart.push(action.payload.cartItem);
    },
    storeUpdateItemInCart: (state, action) => {},
    storeDeleteItemFromCart: (state, action) => {
      const productId = action.payload.productId;
      state.cart = state.cart.filter((item) => item._id !== productId);
    },
    // See if the above three reducers are ever used
    storeClearCart: (state, action) => {
      state.cart = [];
    },
    storePopulateCart: (state, action) => {
      state.cart = action.payload.cart;
    },
  },
});

// export cartSlice reducers individually
export const {
  storeAddItemToCart,
  storeDeleteItemFromCart,
  storeUpdateItemInCart,
  storeClearCart,
  storePopulateCart,
} = cartSlice.actions;

// export all reducers as a single cartReducer and register it in the store
export const cartReducer = cartSlice.reducer;
