import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  token: string | null;
}

const initialState: AdminAuthState = {
  token: null,
};

const adminSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      sessionStorage.setItem('adminToken', action.payload);
    },
    clearAdminToken: (state) => {
      state.token = null;
      sessionStorage.removeItem('adminToken');
    },
  },
});

export const { setAdminToken, clearAdminToken } = adminSlice.actions;
export default adminSlice.reducer;
