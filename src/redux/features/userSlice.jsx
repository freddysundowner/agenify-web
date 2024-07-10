import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  Lists: [],
  favorites: [],
  subscribedItems: [],
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
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setSubscribedItems: (state, action) => {
      state.subscribedItems = action.payload;
    },
  },
});

export const { updateUser, setUser, clearUser, setLists, setFavorites, setSubscribedItems } = UserSlice.actions;
export default UserSlice.reducer;
