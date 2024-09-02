import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice/authSlice.js";
import { cartReducer } from "./cartSlice/cartSlice.js";
import { orderReducer } from "./orderSlice/orderSlice.js";
import { inventoryReducer } from "./inventorySlice/inventorySlice.js";

// Create and configure store
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    inventory: inventoryReducer,
  },
});

export default store;
