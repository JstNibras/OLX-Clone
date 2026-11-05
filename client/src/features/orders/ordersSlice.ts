import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Order } from "../../types/order";
import { getMyOrders } from "../../services/orderService";
import { getOrderById } from "../../services/orderService";

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  selectedOrder: null,
  detailsLoading: false,
  detailsError: null,
};

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    return await getMyOrders();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load orders"
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    return await getOrderById(orderId);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load order"
    );
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load orders";
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || "Failed to load order";
      })
  },
});

export default ordersSlice.reducer;