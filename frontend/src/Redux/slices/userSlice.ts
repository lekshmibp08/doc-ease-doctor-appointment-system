import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAuthState {
  token: string | null;
  currentUser: string | null;
}

const initialState: UserAuthState = {
  token: null,
  currentUser: null,
};

const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserToken: (
      state,
      action: PayloadAction<{ token: string; currentUser: string }>
    ) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;

      sessionStorage.setItem('userToken', action.payload.token);
    },
    clearUserToken: (state) => {
      state.token = null;
      state.currentUser = null;
      sessionStorage.removeItem('userToken');
    },
  },
});

export const { setUserToken, clearUserToken } = userSlice.actions;
export default userSlice.reducer;
