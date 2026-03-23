import ingredientsReducer, { fetchIngredientsThunk } from './burgerIngredients';
import { Ingredient } from '../utils/types';
import { UnknownAction } from 'redux';
import { initialState } from './burgerIngredients';

describe('burgerIngredients slice', () => {
    const mockIngredients: Ingredient[] = [
        {
            _id: '1',
            name: 'Булка',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 100,
            price: 50,
            image: '',
            image_mobile: '',
            image_large: '',
            __v: 0,
        },
    ];

    it('должен возвращать начальное состояние', () => {
        expect(ingredientsReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать fetchIngredientsThunk.pending', () => {
        const action = { type: fetchIngredientsThunk.pending.type };
        const state = ingredientsReducer(initialState, action);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('должен обрабатывать fetchIngredientsThunk.fulfilled', () => {
        const action = { type: fetchIngredientsThunk.fulfilled.type, payload: mockIngredients };
        const state = ingredientsReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.items).toEqual(mockIngredients);
    });

    it('должен обрабатывать fetchIngredientsThunk.rejected', () => {
        const action = { type: fetchIngredientsThunk.rejected.type, payload: 'Ошибка загрузки' };
        const state = ingredientsReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка загрузки');
        expect(state.items).toEqual([]);
    });
});