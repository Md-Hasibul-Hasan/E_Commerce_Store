import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API = import.meta.env.VITE_API_URL;


// ================= LIST =================
// export const fetchProducts = createAsyncThunk(
//     "product/fetchProducts",
//     async (_, { rejectWithValue }) => {
//         try {
//             const { data } = await axios.get(`${API}/api/products/`);
//             return data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params.search) query.append("search", params.search);
      if (params.category) query.append("category", params.category);
      if (params.brand) query.append("brand", params.brand);
      if (params.ordering) query.append("ordering", params.ordering);
      if (params.page) query.append("page", params.page);
      if (params.page_size) query.append("page_size", params.page_size);
      if (params.minPrice) query.append("price__gte", params.minPrice);
      if (params.maxPrice) query.append("price__lte", params.maxPrice);

      const { data } = await axios.get(`${API}/api/products/?${query.toString()}`);

      return data; // 🔥 return full (for pagination)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);


// ================= DETAILS =================
export const fetchProductDetails = createAsyncThunk(
    "product/fetchDetails",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API}/api/products/${id}/`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// ================= DELETE =================
export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (id, { getState, rejectWithValue }) => {
        try {
            const {
                user: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            await axios.delete(`${API}/api/products/${id}/`, config);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// ================= CREATE =================
export const createProduct = createAsyncThunk(
    "product/create",
    async (productData, { getState, rejectWithValue }) => {
        try {
            const {
                user: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const { data } = await axios.post(
                `${API}/api/products/`,
                productData,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// ================= UPDATE =================
export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ id, productData }, { getState, rejectWithValue }) => {
        try {
            const {
                user: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const { data } = await axios.put(
                `${API}/api/products/${id}/`,
                productData,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// ================= REVIEW =================
export const createReview = createAsyncThunk(
    "product/review",
    async ({ productId, reviewData }, { getState, rejectWithValue }) => {
        try {
            const {
                user: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const { data } = await axios.post(
                `${API}/api/products/${productId}/reviews/`,
                reviewData,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// ================= TOP PRODUCTS =================
// ⚠️ Use only if backend supports it
export const fetchTopProducts = createAsyncThunk(
    "product/top",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API}/api/products/top/`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);