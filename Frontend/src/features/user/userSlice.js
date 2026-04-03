import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  googleLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  deleteAccount
  
} from "./userThunk";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  user: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.user = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("user");
    },
    resetError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    }

  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; // ✅ reset error
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // REFRESH TOKEN
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.userInfo = null;
        state.user = null;
        localStorage.removeItem("userInfo");
      })

      // PROFILE
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 GOOGLE LOGIN 
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.success = true;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.success = true;
      })

      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.userInfo = null;
        localStorage.removeItem("userInfo");
      })


  },
});

export const { logout, resetError, resetSuccess } = userSlice.actions;
export default userSlice.reducer;


