import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  token: string | null;
  currentUser: any;
}

const initialState: AdminAuthState = {
  token: null,
  currentUser: null,
};

const adminSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminToken: (
      state,
      action: PayloadAction<{ token: string; currentUser: string }>
    ) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;

      sessionStorage.setItem('adminToken', action.payload.token);
    },
    clearAdminToken: (state) => {
      state.token = null;
      state.currentUser = null;
      sessionStorage.removeItem('adminToken');
    },

    refreshAdminToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;

      // Update sessionStorage with the new token
      sessionStorage.setItem('adminToken', action.payload);
    },

  },
});

export const { setAdminToken, clearAdminToken, refreshAdminToken } = adminSlice.actions;
export default adminSlice.reducer;
