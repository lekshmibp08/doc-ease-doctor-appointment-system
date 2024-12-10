import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the token and role
    setAuth: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    // Action to clear the token and role (logout)
    clearAuth: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

// Export actions
export const { setAuth, clearAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
