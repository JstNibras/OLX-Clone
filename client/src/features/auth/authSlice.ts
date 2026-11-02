import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types/auth";
import { loginApi, registerApi, type LoginInput, type RegisterInput } from "./authService";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: LoginInput, { rejectWithValue }) => {
        try {
            return await loginApi(credentials);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            )
        }
    }
)

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
    }
})

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;