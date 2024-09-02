import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: false,
  userData: {}, // adminPermission field will also be stored here itself
};

const authSlice = createSlice({
  name: "auth", // to be used when registering in the store
  initialState,
  reducers: {
    storeLogin: (state, action) => {
      state.loginStatus = true;
      state.userData = action.payload.userData;
    },
    storeLogout: (state, action) => {
      state.loginStatus = false;
      state.userData = {};
    },
  },
});

// export authSlice reducers individually
export const { storeLogin, storeLogout } = authSlice.actions;

// export all reducers as a single authReducer and register it in the store
export const authReducer = authSlice.reducer;
