import { User } from '@/interfaces/admin';
import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
  currentUser: User | null;
};

const initialState: UserState = {
  currentUser: {
    id: 0,
    name: '',
    email: '',
    coins: 5000, // Increased default coins amount for testing
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateCoins: (state, action) => {
      if (state.currentUser) {
        state.currentUser.coins = action.payload;
      }
    },
    spendCoins: (state, action) => {
      if (state.currentUser && state.currentUser.coins) {
        state.currentUser.coins -= action.payload;
      }
    },
    addCoins: (state, action) => {
      if (state.currentUser && state.currentUser.coins) {
        state.currentUser.coins += action.payload;
      }
    },
  },
});

export const { setUser, updateCoins, spendCoins, addCoins } = userSlice.actions;

export default userSlice.reducer;
