import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAuthState {
  token: string | null;
}

const initialState: UserAuthState = {
  token: null,
};

const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      sessionStorage.setItem('userToken', action.payload);
    },
    clearUserToken: (state) => {
      state.token = null;
      sessionStorage.removeItem('userToken');
    },
  },
});

export const { setUserToken, clearUserToken } = userSlice.actions;
export default userSlice.reducer;
