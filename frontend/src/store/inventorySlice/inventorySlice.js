import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventory: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    storePopulateInventory: (state, action) => {
      state.inventory = action.payload.inventory;
    },
    storeDeleteItemFromInventory: (state, action) => {
      const productId = action.payload.productId;
      state.inventory = state.inventory.filter(
        (item) => item._id !== productId
      );
    },
  },
});
// export inventorySlice reducers individually
export const { storePopulateInventory, storeDeleteItemFromInventory } =
  inventorySlice.actions;

// export all reducers as a single inventoryReducer and register it in the store
export const inventoryReducer = inventorySlice.reducer;
