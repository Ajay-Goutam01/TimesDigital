import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../services/api/baseApi';
import authReducer from '../features/auth/state/authSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
