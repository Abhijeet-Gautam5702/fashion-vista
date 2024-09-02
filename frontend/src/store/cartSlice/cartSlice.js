import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const cartSlice = createSlice({
  name: "cart", // to be used when registering in the store
  initialState,
  reducers: {
    storeAddItemToCart: (state, action) => {},
    storeDeleteItemFromCart: (state, action) => {},
    storeUpdateItemInCart: (state, action) => {},
    storeClearCart: (state, action) => {},
    storePopulateCart: (state, action) => {},
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
