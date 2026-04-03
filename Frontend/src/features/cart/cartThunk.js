import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getStoredCartItems = () => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : [];
};

const saveStoredCartItems = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const getAuthConfig = (getState) => {
  const {
    user: { userInfo },
  } = getState();

  if (!userInfo?.access) {
    return null;
  }

  return {
    headers: {
      Authorization: `Bearer ${userInfo.access}`,
    },
  };
};

const fetchProductCartShape = async (id, qty) => {
  const { data } = await axios.get(`${API}/api/products/${id}/`);

  return {
    id: data.id,
    name: data.name,
    image: data.images?.[0]?.image || null,
    price: Number(data.price),
    countInStock: data.countInStock,
    quantity: qty,
  };
};

export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCartAsync",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (!config) {
        return getStoredCartItems();
      }

      const { data } = await axios.get(`${API}/api/cart/`, config);
      return data.map((item) => ({
        ...item,
        price: Number(item.price),
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const syncCartAsync = createAsyncThunk(
  "cart/syncCartAsync",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (!config) {
        return getStoredCartItems();
      }

      const localItems = getStoredCartItems();

      if (localItems.length > 0) {
        const { data } = await axios.post(
          `${API}/api/cart/sync/`,
          {
            items: localItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          },
          config
        );

        localStorage.removeItem("cartItems");
        return data.map((item) => ({
          ...item,
          price: Number(item.price),
        }));
      }

      const { data } = await axios.get(`${API}/api/cart/`, config);
      return data.map((item) => ({
        ...item,
        price: Number(item.price),
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ id, qty }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (config) {
        await axios.post(
          `${API}/api/cart/`,
          {
            product_id: Number(id),
            quantity: qty,
          },
          config
        );

        const { data } = await axios.get(`${API}/api/cart/`, config);
        return data.map((item) => ({
          ...item,
          price: Number(item.price),
        }));
      }

      const item = await fetchProductCartShape(id, qty);
      const cartItems = getStoredCartItems();
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = cartItems.map((cartItem) =>
          cartItem.id === item.id ? item : cartItem
        );
      } else {
        updatedCartItems = [...cartItems, item];
      }

      saveStoredCartItems(updatedCartItems);
      return updatedCartItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const updateCartQuantityAsync = createAsyncThunk(
  "cart/updateCartQuantityAsync",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (config) {
        await axios.patch(
          `${API}/api/cart/${id}/`,
          { quantity },
          config
        );

        const { data } = await axios.get(`${API}/api/cart/`, config);
        return data.map((item) => ({
          ...item,
          price: Number(item.price),
        }));
      }

      const updatedCartItems = getStoredCartItems().map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      saveStoredCartItems(updatedCartItems);
      return updatedCartItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (config) {
        await axios.delete(`${API}/api/cart/${id}/`, config);
        const { data } = await axios.get(`${API}/api/cart/`, config);
        return data.map((item) => ({
          ...item,
          price: Number(item.price),
        }));
      }

      const updatedCartItems = getStoredCartItems().filter(
        (item) => item.id !== id
      );

      saveStoredCartItems(updatedCartItems);
      return updatedCartItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);

      if (config) {
        await axios.delete(`${API}/api/cart/clear/`, config);
      }

      localStorage.removeItem("cartItems");
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);

export const buyNowAsync = createAsyncThunk(
  "cart/buyNowAsync",
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      return await fetchProductCartShape(id, qty);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.message
      );
    }
  }
);
