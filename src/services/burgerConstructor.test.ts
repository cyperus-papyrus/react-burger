import constructorReducer, {
    addIngredient,
    removeIngredient,
    moveIngredient,
    resetConstructor,
} from './burgerConstructor';
import { Ingredient } from '../utils/types';
import { UnknownAction } from '@reduxjs/toolkit';

describe('burgerConstructor slice', () => {
    const mockIngredient: Ingredient = {
        _id: '1',
        name: 'Тестовая булка',
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

    const mockIngredientMain: Ingredient = {
        _id: '2',
        name: 'Тестовая начинка',
        type: 'main',
        proteins: 5,
        fat: 10,
        carbohydrates: 15,
        calories: 80,
        price: 30,
        image: '',
        image_mobile: '',
        image_large: '',
        __v: 0,
    };

    const initialState = {
        bun: null,
        ingredients: [],
    };

    it('должен возвращать начальное состояние', () => {
        expect(constructorReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать addIngredient для булки', () => {
        const action = addIngredient(mockIngredient);
        const newState = constructorReducer(initialState, action);
        expect(newState.bun).toEqual(mockIngredient);
        expect(newState.ingredients).toEqual([]);
    });

    it('должен обрабатывать addIngredient для начинки (добавляет uniqueId)', () => {
        const action = addIngredient(mockIngredientMain);
        const newState = constructorReducer(initialState, action);
        expect(newState.bun).toBeNull();
        expect(newState.ingredients).toHaveLength(1);
        expect(newState.ingredients[0]).toMatchObject(mockIngredientMain);
        expect(newState.ingredients[0].uniqueId).toBeDefined();
    });

    it('должен обрабатывать removeIngredient', () => {
        const addAction = addIngredient(mockIngredientMain);
        let state = constructorReducer(initialState, addAction);
        const uniqueId = state.ingredients[0].uniqueId;

        const removeAction = removeIngredient(uniqueId);
        state = constructorReducer(state, removeAction);
        expect(state.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать moveIngredient', () => {
        const ingredient1 = { ...mockIngredientMain, _id: '1', name: 'Первый' };
        const ingredient2 = { ...mockIngredientMain, _id: '2', name: 'Второй' };
        let state = constructorReducer(initialState, addIngredient(ingredient1));
        state = constructorReducer(state, addIngredient(ingredient2));
        const ids = state.ingredients.map(i => i.uniqueId);

        const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
        state = constructorReducer(state, moveAction);
        expect(state.ingredients[0].uniqueId).toBe(ids[1]);
        expect(state.ingredients[1].uniqueId).toBe(ids[0]);
    });

    it('должен обрабатывать resetConstructor', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient));
        state = constructorReducer(state, addIngredient(mockIngredientMain));
        state = constructorReducer(state, resetConstructor());
        expect(state).toEqual(initialState);
    });
});