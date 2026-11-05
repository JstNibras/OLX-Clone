import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../../services/cartService";

interface CartState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  removingId: string | null;
  isAdding: boolean;
}

const initialState: CartState = {
  products: [],
  isLoading: false,
  error: null,
  removingId: null,
  isAdding: false,
};

export const fetchCart = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await getCart();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load cart"
    );
  }
});

export const addProductToCart = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("cart/addProduct", async (productId, { rejectWithValue }) => {
  try {
    await addToCart(productId);

    return await getCart();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add product to cart"
    );
  }
});

export const removeCartProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/removeProduct", async (productId, { rejectWithValue }) => {
  try {
    await removeFromCart(productId);
    return productId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove product"
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load cart";
      })

      .addCase(addProductToCart.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.isAdding = false;
        state.products = action.payload;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload || "Failed to add product";      })

      .addCase(removeCartProduct.pending, (state, action) => {
        state.removingId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeCartProduct.fulfilled, (state, action) => {
        state.removingId = null;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(removeCartProduct.rejected, (state, action) => {
        state.removingId = null;
        state.error = action.payload || "Failed to remove product";
      });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;