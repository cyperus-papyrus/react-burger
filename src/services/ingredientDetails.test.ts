import detailsReducer, { setDetails, resetDetails } from './ingredientDetails';
import { Ingredient } from '../utils/types';
import { UnknownAction } from 'redux';

describe('ingredientDetails slice', () => {
    const initialState = { item: null };
    const mockIngredient: Ingredient = {
        _id: '1',
        name: 'Тест',
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
    };

    it('должен возвращать начальное состояние', () => {
        expect(detailsReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать setDetails', () => {
        const action = setDetails(mockIngredient);
        const state = detailsReducer(initialState, action);
        expect(state.item).toEqual(mockIngredient);
    });

    it('должен обрабатывать resetDetails', () => {
        const filledState = detailsReducer(initialState, setDetails(mockIngredient));
        const resetState = detailsReducer(filledState, resetDetails());
        expect(resetState).toEqual(initialState);
    });
});