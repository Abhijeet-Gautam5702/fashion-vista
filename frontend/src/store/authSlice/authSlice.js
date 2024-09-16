import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: false,
  adminLoginStatus: false,
  userData: {}, // adminPermission field will also be stored here itself
  adminData: {},
};

const authSlice = createSlice({
  name: "auth",
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
    storeAdminLogin: (state, action) => {
      state.adminLoginStatus = true;
      state.adminData = action.payload.adminData;
    },
    storeAdminLogout: (state, action) => {
      state.adminLoginStatus = false;
      state.adminData = {};
    },
  },
});

// export authSlice reducers individually
export const { storeAdminLogout, storeAdminLogin, storeLogin, storeLogout } =
  authSlice.actions;

// export all reducers as a single authReducer and register it in the store
export const authReducer = authSlice.reducer;
