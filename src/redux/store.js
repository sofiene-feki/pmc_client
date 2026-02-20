import { configureStore } from "@reduxjs/toolkit";
import cartDrawer from "./ui/cartDrawer";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    cartDrawer: cartDrawer,
    auth: authReducer,
  },
});
