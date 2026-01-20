import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  Ingredient,
  ConstructorIngredient,
  BurgerConstructorState,
} from "../utils/types";

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: "burgerConstructor",
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<ConstructorIngredient | Ingredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === "bun") {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient as ConstructorIngredient);
        }
      },
      prepare: (ingredient: Ingredient) => {
        if (ingredient.type === "bun") {
          return { payload: ingredient };
        }
        return {
          payload: {
            ...ingredient,
            uniqueId: uuidv4(),
          },
        };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, resetConstructor } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
