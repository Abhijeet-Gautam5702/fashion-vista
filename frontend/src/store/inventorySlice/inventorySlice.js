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
    storeUpdateProductStockStatus: (state, action) => {
      const productId = action.payload.productId;
      state.inventory = state.inventory.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            stock: !item.stock,
          };
        }
        return item;
      });
    },
  },
});
// export inventorySlice reducers individually
export const {
  storeUpdateProductStockStatus,
  storePopulateInventory,
  storeDeleteItemFromInventory,
} = inventorySlice.actions;

// export all reducers as a single inventoryReducer and register it in the store
export const inventoryReducer = inventorySlice.reducer;
