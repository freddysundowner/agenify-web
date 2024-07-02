import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  Lists: [],
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    setLists: (state, action) => {
      state.Lists = action.payload;
    },
  },
});

export const { updateUser, setUser, clearUser, setLists } = UserSlice.actions;
export default UserSlice.reducer;
