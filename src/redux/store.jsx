// store.js
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./features/userSlice";
import sessionReducer from "./features/sessionSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    session: sessionReducer,
    auth: authReducer,
  },
});

export default store;
