// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// // ✅ CREATE ORDER
// export const createOrder = createAsyncThunk(
//   "order/create",
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(`${API}/orders/`, orderData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // ✅ ORDER DETAILS
// export const fetchOrderDetails = createAsyncThunk(
//   "order/details",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${API}/orders/${id}/`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // ✅ PAY ORDER
// export const payOrder = createAsyncThunk(
//   "order/pay",
//   async ({ id, paymentResult }, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.put(
//         `${API}/orders/${id}/pay/`,
//         paymentResult
//       );
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // ✅ MY ORDERS
// export const fetchMyOrders = createAsyncThunk(
//   "order/myOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${API}/orders/myorders/`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // ✅ ALL ORDERS (admin)
// export const fetchOrders = createAsyncThunk(
//   "order/list",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${API}/orders/`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // ✅ DELIVER
// export const deliverOrder = createAsyncThunk(
//   "order/deliver",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.put(`${API}/orders/${id}/deliver/`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );





import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearBuyNow } from "../cart/cartSlice";
import { clearCartAsync } from "../cart/cartThunk";


const API = import.meta.env.VITE_API_URL;

export const createOrderAsync = createAsyncThunk(
  "order/create",
  async (orderData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { user, cart } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.post(
        `${API}/api/orders/`,
        orderData,
        config
      );

      // 🔥 FIX START
      if (cart.buyNowItem) {
        // 👉 Buy Now → only clear buyNow
        dispatch(clearBuyNow());
      } else {
        // 👉 Cart checkout → clear cart
        await dispatch(clearCartAsync());
      }
      // 🔥 FIX END

      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);


// ✅ ORDER DETAILS
export const getOrderDetailsAsync = createAsyncThunk(
  "order/details",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/orders/${id}/`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

// ✅ PAY ORDER
export const payOrderAsync = createAsyncThunk(
  "order/pay",
  async ({ id, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.put(
        `${API}/api/orders/${id}/pay/`,
        paymentResult,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

// ✅ SSL PAY
export const sslPayAsync = createAsyncThunk(
  "order/sslPay",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.post(
        `${API}/api/orders/${id}/ssl_init/`,
        {},
        config
      );

      // 🔥 redirect to SSL page
      window.location.href = data.url;

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);


// ✅ MY ORDERS
export const listMyOrdersAsync = createAsyncThunk(
  "order/myOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/orders/`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

// ✅ ALL ORDERS (ADMIN)
export const listOrdersAsync = createAsyncThunk(
  "order/list",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.access}`,
        },
      };

      const { data } = await axios.get(
        `${API}/orders/`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);
