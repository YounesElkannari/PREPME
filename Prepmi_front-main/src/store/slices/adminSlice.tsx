import { Admin } from '@/interfaces/admin';
import { createSlice } from '@reduxjs/toolkit';

export type AdminState = Admin | null;

const initialState: AdminState = {
  token: '',
  user: {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    token: '',
  },
  favoris: []

};

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },

    logout: (state: any) => {
      state = null;
      return state;

    },
    updateUserCoins: (state, action) => {
      if (state?.user) {
        state.user.coins = action.payload;
      }
    },
    spendCoins: (state, action) => {
      if (state?.user?.coins !== undefined) {
        state.user.coins -= action.payload;
      }
    },
  },
});

export const { login, logout, updateUserCoins, spendCoins } = adminSlice.actions;

export default adminSlice.reducer;