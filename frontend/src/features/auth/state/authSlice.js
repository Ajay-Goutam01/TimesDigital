import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

const initialState = {
  admin: null,
  isAuthenticated: false,
  mustChangePassword: false,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const admin = action.payload;
      state.admin = admin;
      state.isAuthenticated = !!admin;
      state.mustChangePassword = !!admin?.mustChangePassword;
      state.isInitialized = true;
    },
    clearCredentials: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.mustChangePassword = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        const admin = action.payload?.data?.admin || action.payload?.data;
        state.admin = admin;
        state.isAuthenticated = !!admin;
        state.mustChangePassword = !!admin?.mustChangePassword;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.mustChangePassword = false;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const admin = action.payload?.data?.admin || action.payload?.data;
        state.admin = admin;
        state.isAuthenticated = !!admin;
        state.mustChangePassword = !!admin?.mustChangePassword;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.mustChangePassword = false;
        state.isInitialized = true;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
