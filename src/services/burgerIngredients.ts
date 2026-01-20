import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchIngredients } from "../utils/api";
import { Ingredient, BurgerIngredientsState } from "../utils/types";

const initialState: BurgerIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredientsThunk = createAsyncThunk(
  "burgerIngredients/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchIngredients();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const burgerIngredientsSlice = createSlice({
  name: "burgerIngredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredientsThunk.fulfilled,
        (state, action: PayloadAction<Ingredient[]>) => {
          state.items = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.items = [];
      });
  },
});

export default burgerIngredientsSlice.reducer;
