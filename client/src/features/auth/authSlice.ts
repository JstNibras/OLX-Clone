import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types/auth";
import { loginApi, registerApi, type LoginInput, type RegisterInput } from "./authService";
import api from "../../services/api";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: false,
    error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginInput, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      if (!response.token) {
        return rejectWithValue("Token missing from login response");
      }

      localStorage.setItem("token", response.token);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterInput, { rejectWithValue }) => {
    try {
      return await registerApi(userData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");

      return response.data.user as User;
    } catch {
      localStorage.removeItem("token");

      return rejectWithValue("Session expired");
    }
  }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(initializeAuth.pending, (state) => {
            state.isInitializing = true;
        })
        .addCase(initializeAuth.fulfilled, (state, action) => {
            state.isInitializing = false;
            state.user = action.payload;
            state.token = localStorage.getItem("token");
            state.isAuthenticated = true;
        })
        .addCase(initializeAuth.rejected, (state) => {
            state.isInitializing = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        })
    }
})

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;