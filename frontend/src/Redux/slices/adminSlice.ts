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
  },
});

export const { setAdminToken, clearAdminToken } = adminSlice.actions;
export default adminSlice.reducer;
