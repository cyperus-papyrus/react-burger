import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createOrder } from "../utils/api";
import { OrderResponse, OrderDetailsState } from "../utils/types";

const initialState: OrderDetailsState = {
  order: {
    number: null,
    name: null,
  },
  isLoading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk(
  "orderDetails/create",
  async (ingredientIds: string[]) => {
    const data = await createOrder(ingredientIds);
    return data;
  },
);

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = { number: null, name: null };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.isLoading = false;
          state.order = {
            number: action.payload.order.number,
            name: action.payload.name,
          };
        },
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.order = { number: null, name: null };
      });
  },
});

export const { resetOrder } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
