import feedReducer from './feed';
import { feedWsOpen, feedWsClose, feedWsError, feedWsMessage } from './actions/wsActions';
import { Order } from '../utils/types';
import { UnknownAction } from 'redux';

describe('feed slice', () => {
    const initialState = {
        wsConnected: false,
        orders: [],
        total: null,
        totalToday: null,
        error: null,
    };

    const mockOrders: Order[] = [
        {
            _id: '1',
            ingredients: ['1', '2'],
            status: 'done',
            name: 'Test order',
            number: 123,
            createdAt: '',
            updatedAt: '',
        },
    ];

    it('должен возвращать начальное состояние', () => {
        expect(feedReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать feedWsOpen', () => {
        const state = feedReducer(initialState, feedWsOpen());
        expect(state.wsConnected).toBe(true);
        expect(state.error).toBeNull();
    });

    it('должен обрабатывать feedWsClose', () => {
        const connectedState = feedReducer(initialState, feedWsOpen());
        const closedState = feedReducer(connectedState, feedWsClose());
        expect(closedState.wsConnected).toBe(false);
    });

    it('должен обрабатывать feedWsError', () => {
        const state = feedReducer(initialState, feedWsError('Соединение потеряно'));
        expect(state.wsConnected).toBe(false);
        expect(state.error).toBe('Соединение потеряно');
    });

    it('должен обрабатывать feedWsMessage', () => {
        const payload = {
            orders: mockOrders,
            total: 100,
            totalToday: 10,
            success: true,
        };
        const state = feedReducer(initialState, feedWsMessage(payload));
        expect(state.orders).toEqual(mockOrders);
        expect(state.total).toBe(100);
        expect(state.totalToday).toBe(10);
        expect(state.error).toBeNull();
    });
});