import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../utils/types';
import { profileWsOpen, profileWsClose, profileWsError, profileWsMessage } from './actions/wsActions';
import { FeedResponse } from '../utils/types';

interface ProfileOrdersState {
    wsConnected: boolean;
    orders: Order[];
    error: string | null;
}

const initialState: ProfileOrdersState = {
    wsConnected: false,
    orders: [],
    error: null,
};

const profileOrdersSlice = createSlice({
    name: 'profileOrders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(profileWsOpen, (state) => {
                state.wsConnected = true;
                state.error = null;
            })
            .addCase(profileWsClose, (state) => {
                state.wsConnected = false;
            })
            .addCase(profileWsError, (state, action: PayloadAction<string>) => {
                state.wsConnected = false;
                state.error = action.payload;
            })
            .addCase(profileWsMessage, (state, action: PayloadAction<FeedResponse>) => {
                const newOrders = action.payload.orders;

                newOrders.forEach(newOrder => {
                    const existingIndex = state.orders.findIndex(o => o._id === newOrder._id);
                    if (existingIndex !== -1) {
                        state.orders[existingIndex] = newOrder;
                    } else {
                        state.orders.push(newOrder);
                    }
                });

                state.error = null;
            });
    },
});

export default profileOrdersSlice.reducer;