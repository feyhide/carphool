import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.currentUser = action.payload;
    },
    resetUser: (state) => {
      state.currentUser = null;
    },
    addCurrencyPreference: (state, action) => {
      if (state.currentUser) {
        state.currentUser.currencyPreference = action.payload;
      }
    },
  },
});

export const { addUser, resetUser, addCurrencyPreference } = userSlice.actions;

export default userSlice.reducer;
