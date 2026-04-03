import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/auth/jwt/create/`, {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      // 🔥 IMPORTANT: fetch profile after login
      dispatch(getUserProfile());

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ✅ GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (access_token, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/auth/google/`, {
        access_token,
      });

      // save tokens
      localStorage.setItem("userInfo", JSON.stringify(data));

      // 🔥 IMPORTANT: fetch profile after login
      dispatch(getUserProfile());

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data ||
        error.message
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.refresh) {
        throw new Error("No refresh token available");
      }

      const { data } = await axios.post(`${API}/auth/jwt/refresh/`, {
        refresh: userInfo.refresh,
      });

      const updatedInfo = {
        ...userInfo,
        access: data.access,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      return updatedInfo;
    } catch (error) {
      localStorage.removeItem("userInfo");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password, re_password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/auth/users/`, {
        name,
        email,
        password,
        re_password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ GET PROFILE
export const getUserProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log("Fetching profile with token:", userInfo?.access);

      const { data } = await axios.get(`${API}/auth/users/me/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });


      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.patch(
        `${API}/auth/users/me/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ current_password, new_password, re_new_password }, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.post(
        `${API}/auth/users/set_password/`,
        { current_password, new_password, re_new_password },
        {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(`${API}/auth/users/reset_password/`, { email });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (password, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.delete(`${API}/auth/users/me/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
        data: { current_password: password },
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

