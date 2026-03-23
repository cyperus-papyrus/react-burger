import orderReducer, { createOrderThunk, resetOrder } from './orderDetails';
import { UnknownAction } from 'redux';
import { initialState } from './orderDetails';

describe('orderDetails slice', () => {
    it('должен возвращать начальное состояние', () => {
        expect(orderReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать createOrderThunk.pending', () => {
        const action = { type: createOrderThunk.pending.type };
        const state = orderReducer(initialState, action);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('должен обрабатывать createOrderThunk.fulfilled', () => {
        const payload = {
            name: 'Тестовый заказ',
            order: { number: 12345 },
        };
        const action = { type: createOrderThunk.fulfilled.type, payload };
        const state = orderReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.order).toEqual({ number: 12345, name: 'Тестовый заказ' });
    });

    it('должен обрабатывать createOrderThunk.rejected', () => {
        const action = { type: createOrderThunk.rejected.type, payload: 'Ошибка создания' };
        const state = orderReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка создания');
        expect(state.order).toEqual({ number: null, name: null });
    });

    it('должен обрабатывать resetOrder', () => {
        const filledState = orderReducer(
            initialState,
            { type: createOrderThunk.fulfilled.type, payload: { name: 'Заказ', order: { number: 999 } } }
        );
        const resetState = orderReducer(filledState, resetOrder());
        expect(resetState).toEqual(initialState);
    });
});