import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient, IngredientDetailsState } from "../utils/types";

const initialState: IngredientDetailsState = {
  item: null,
};

const ingredientDetailsSlice = createSlice({
  name: "ingredientDetails",
  initialState,
  reducers: {
    setDetails: (state, action: PayloadAction<Ingredient>) => {
      state.item = action.payload;
    },
    resetDetails: (state) => {
      state.item = null;
    },
  },
});

export const { setDetails, resetDetails } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
