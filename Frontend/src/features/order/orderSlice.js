// import { createSlice } from "@reduxjs/toolkit";
// import {
//   createOrder,
//   fetchOrderDetails,
//   payOrder,
//   fetchMyOrders,
//   fetchOrders,
//   deliverOrder,
// } from "./orderThunk";

// const initialState = {
//   order: {},
//   orders: [],
//   myOrders: [],

//   loading: false,
//   error: null,
//   success: false,
// };

// const orderSlice = createSlice({
//   name: "order",
//   initialState,

//   reducers: {
//     resetOrder: (state) => {
//       state.success = false;
//       state.order = {};
//     },
//     resetPay: (state) => {
//       state.success = false;
//     },
//     resetDeliver: (state) => {
//       state.success = false;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       // ========= CREATE =========
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.order = action.payload;
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ========= DETAILS =========
//       .addCase(fetchOrderDetails.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrderDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.order = action.payload;
//       })
//       .addCase(fetchOrderDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ========= PAY =========
//       .addCase(payOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(payOrder.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(payOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ========= MY ORDERS =========
//       .addCase(fetchMyOrders.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchMyOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.myOrders = action.payload;
//       })
//       .addCase(fetchMyOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ========= ALL ORDERS =========
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ========= DELIVER =========
//       .addCase(deliverOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deliverOrder.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(deliverOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetOrder, resetPay, resetDeliver } =
//   orderSlice.actions;

// export default orderSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import {
  createOrderAsync,
  getOrderDetailsAsync,
  payOrderAsync,
  sslPayAsync,
  listMyOrdersAsync,
  listOrdersAsync,
} from "./orderThunk";

const initialState = {
  loading: false,
  success: false,
  order: null,
  orders: [],
  error: null,

  // 🔥 ADD THESE
  loadingPay: false,
  successPay: false,

  loadingSSL: false,
  successSSL: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.success = false;
      state.order = null;
      state.error = null;
    },

    resetOrders: (state) => {
      state.orders = [];
    },

    // 🔥 ADD RESET PAY
    resetPay: (state) => {
      state.loadingPay = false;
      state.successPay = false;
    },

    // 🔥 ADD RESET SSL
    resetSSL: (state) => {
      state.loadingSSL = false;
      state.successSSL = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ CREATE
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ DETAILS
      .addCase(getOrderDetailsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 PAY (UPDATED)
      .addCase(payOrderAsync.pending, (state) => {
        state.loadingPay = true;
      })
      .addCase(payOrderAsync.fulfilled, (state) => {
        state.loadingPay = false;
        state.successPay = true;
      })
      .addCase(payOrderAsync.rejected, (state, action) => {
        state.loadingPay = false;
        state.error = action.payload;
      })

      // ✅ SSL PAY
      .addCase(sslPayAsync.pending, (state) => {
        state.loadingSSL = true;
      })
      .addCase(sslPayAsync.fulfilled, (state) => {
        state.loadingSSL = false;
        state.successSSL = true;
      })
      .addCase(sslPayAsync.rejected, (state, action) => {
        state.loadingSSL = false;
        state.error = action.payload;
      })

      // ✅ MY ORDERS
      .addCase(listMyOrdersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(listMyOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listMyOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ALL ORDERS
      .addCase(listOrdersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(listOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder, resetOrders, resetPay, resetSSL } = orderSlice.actions;
export default orderSlice.reducer;