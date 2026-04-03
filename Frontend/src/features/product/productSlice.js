import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductDetails,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  fetchTopProducts,
} from "./productThunk";

const initialState = {
  products: [],
  product: {
    images: [],
    reviews: [],
  },

  topProducts: [],
  loadingTop: false,
  errorTop: null,

  // 🔥 ADD THESE
  page: 1,
  pages: 1,
  count: 0,
  page_size: 3,

  next: null,
  previous: null,

  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    // 🔥 RESET STATES (important)
    resetCreate: (state) => {
      state.success = false;
    },
    resetUpdate: (state) => {
      state.success = false;
    },
    resetReview: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= LIST =================
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.products = action.payload.results;
        state.count = action.payload.count;

        state.next = action.payload.next;
        state.previous = action.payload.previous;

        state.page = action.meta.arg?.page || 1;

        // 🔥 store page_size
        const pageSize = action.payload.page_size || 3;
        state.page_size = pageSize;

        state.pages = Math.ceil(action.payload.count / pageSize);
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= DETAILS =================
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= DELETE =================
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= CREATE =================
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= UPDATE =================
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= REVIEW =================
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔥 TOP PRODUCTS
      .addCase(fetchTopProducts.pending, (state) => {
        state.loadingTop = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loadingTop = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loadingTop = false;
        state.errorTop = action.payload;
      })



      
  },
});

export const { resetCreate, resetUpdate, resetReview } =
  productSlice.actions;

export default productSlice.reducer;