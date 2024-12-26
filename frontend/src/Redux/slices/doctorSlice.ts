import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPractitioner } from '../../types/interfaces';

interface DoctorAuthState {
  token: string | null;
  currentUser: IPractitioner | null;
}

const initialState: DoctorAuthState = {
  token: null,
  currentUser: null,
};

const doctorSlice = createSlice({
  name: 'doctorAuth',
  initialState,
  reducers: {
    setDoctorToken: (
      state,
      action: PayloadAction<{ token: string; currentUser: IPractitioner }>
    ) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;

      sessionStorage.setItem('doctorToken', action.payload.token);
    },
    clearDoctorToken: (state) => {
      state.token = null;
      state.currentUser = null;
      sessionStorage.removeItem('doctorToken');
    },
  },
});

export const { setDoctorToken, clearDoctorToken } = doctorSlice.actions;
export default doctorSlice.reducer;
