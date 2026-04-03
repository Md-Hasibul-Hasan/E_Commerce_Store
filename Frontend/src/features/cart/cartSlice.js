import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../user/userSlice";
import {
  addToCartAsync,
  buyNowAsync,
  clearCartAsync,
  fetchCartAsync,
  removeFromCartAsync,
  syncCartAsync,
  updateCartQuantityAsync,
} from "./cartThunk";

const getCartItemsFromStorage = () => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : [];
};

const shippingFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const paymentFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : "";

const initialState = {
  cartItems: getCartItemsFromStorage(),
  shippingAddress: shippingFromStorage,
  paymentMethod: paymentFromStorage,
  buyNowItem: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
    },

    clearBuyNow: (state) => {
      state.buyNowItem = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(syncCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(syncCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cartItems = [];
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(buyNowAsync.fulfilled, (state, action) => {
        state.buyNowItem = action.payload;
      })
      .addCase(logout, (state) => {
        state.cartItems = getCartItemsFromStorage();
        state.buyNowItem = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { saveShippingAddress, savePaymentMethod, clearBuyNow } =
  cartSlice.actions;

export default cartSlice.reducer;
