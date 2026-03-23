import profileOrdersReducer from './profileOrders';
import { profileWsOpen, profileWsClose, profileWsError, profileWsMessage } from './actions/wsActions';
import { Order } from '../utils/types';
import { UnknownAction } from 'redux';

describe('profileOrders slice', () => {
    const initialState = {
        wsConnected: false,
        orders: [],
        error: null,
    };

    const mockOrder1: Order = {
        _id: '1',
        ingredients: ['1'],
        status: 'pending',
        name: 'Order 1',
        number: 111,
        createdAt: '',
        updatedAt: '',
    };

    const mockOrder2: Order = {
        _id: '2',
        ingredients: ['2'],
        status: 'done',
        name: 'Order 2',
        number: 222,
        createdAt: '',
        updatedAt: '',
    };

    it('должен возвращать начальное состояние', () => {
        expect(profileOrdersReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать profileWsOpen', () => {
        const state = profileOrdersReducer(initialState, profileWsOpen());
        expect(state.wsConnected).toBe(true);
        expect(state.error).toBeNull();
    });

    it('должен обрабатывать profileWsClose', () => {
        const connected = profileOrdersReducer(initialState, profileWsOpen());
        const closed = profileOrdersReducer(connected, profileWsClose());
        expect(closed.wsConnected).toBe(false);
    });

    it('должен обрабатывать profileWsError', () => {
        const state = profileOrdersReducer(initialState, profileWsError('Ошибка'));
        expect(state.wsConnected).toBe(false);
        expect(state.error).toBe('Ошибка');
    });

    it('должен обрабатывать profileWsMessage (добавляет новые заказы, обновляет существующие)', () => {
        let state = profileOrdersReducer(initialState, profileWsMessage({ orders: [mockOrder1], total: 10, totalToday: 1, success: true }));
        expect(state.orders).toHaveLength(1);
        expect(state.orders[0]._id).toBe('1');

        state = profileOrdersReducer(state, profileWsMessage({ orders: [mockOrder2], total: 10, totalToday: 1, success: true }));
        expect(state.orders).toHaveLength(2);
        expect(state.orders.find(o => o._id === '2')).toBeDefined();

        const updatedOrder1: Order = { ...mockOrder1, status: 'done', };
        state = profileOrdersReducer(state, profileWsMessage({ orders: [updatedOrder1], total: 10, totalToday: 1, success: true }));
        expect(state.orders.find(o => o._id === '1')?.status).toBe('done');
        expect(state.orders).toHaveLength(2);
    });
});