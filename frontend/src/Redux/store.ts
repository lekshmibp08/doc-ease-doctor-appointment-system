import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth reducer
  },
});

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
