import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";  
import orderReducer from "../features/order/orderSlice";
import userReducer from "../features/user/userSlice";

export const mystore = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    user: userReducer

  },
});