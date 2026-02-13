// redux/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  isEcwidCartOpen: false,
  pendingEcwidProductId: null,
};

const cartDrawer = createSlice({
  name: "cartDrawer",
  initialState,
  reducers: {
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    openEcwidCart(state, action) {
      state.isEcwidCartOpen = true;
      state.pendingEcwidProductId = action.payload || null;
    },
    closeEcwidCart(state) {
      state.isEcwidCartOpen = false;
      state.pendingEcwidProductId = null;
    },
  },
});

export const { openCart, closeCart, toggleCart, openEcwidCart, closeEcwidCart } = cartDrawer.actions;
export default cartDrawer.reducer;
