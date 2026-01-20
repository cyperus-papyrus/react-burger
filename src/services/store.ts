import { configureStore } from "@reduxjs/toolkit";
import burgerIngredientsReducer from "./burgerIngredients";
import burgerConstructorReducer from "./burgerConstructor";
import ingredientDetailsReducer from "./ingredientDetails";
import orderDetailsReducer from "./orderDetails";

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    burgerIngredients: burgerIngredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    orderDetails: orderDetailsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;