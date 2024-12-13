import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorAuthState {
  token: string | null;
}

const initialState: DoctorAuthState = {
  token: null,
};

const doctorSlice = createSlice({
  name: 'doctorAuth',
  initialState,
  reducers: {
    setDoctorToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      sessionStorage.setItem('doctorToken', action.payload);
    },
    clearDoctorToken: (state) => {
      state.token = null;
      sessionStorage.removeItem('doctorToken');
    },
  },
});

export const { setDoctorToken, clearDoctorToken } = doctorSlice.actions;
export default doctorSlice.reducer;
