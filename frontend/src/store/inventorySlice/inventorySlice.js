import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const inventorySlice = createSlice({
  name: "inventory", // to be used when registering in the store
  initialState,
  reducers: {
    storePopulateInventory: (state, action) => {},
    storeDeleteItemFromInventory: (state, action) => {},
  },
});
// export inventorySlice reducers individually
export const { storePopulateInventory, storeDeleteItemFromInventory } =
  inventorySlice.actions;

// export all reducers as a single inventoryReducer and register it in the store
export const inventoryReducer = inventorySlice.reducer;
