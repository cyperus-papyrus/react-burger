import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../utils/types';
import { feedWsOpen, feedWsClose, feedWsError, feedWsMessage } from './actions/wsActions';
import { FeedResponse } from '../utils/types';

interface FeedState {
  wsConnected: boolean;
  orders: Order[];
  total: number | null;
  totalToday: number | null;
  error: string | null;
}

const initialState: FeedState = {
  wsConnected: false,
  orders: [],
  total: null,
  totalToday: null,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsOpen, (state) => {
        state.wsConnected = true;
        state.error = null;
      })
      .addCase(feedWsClose, (state) => {
        state.wsConnected = false;
      })
      .addCase(feedWsError, (state, action: PayloadAction<string>) => {
        state.wsConnected = false;
        state.error = action.payload;
      })
      .addCase(feedWsMessage, (state, action: PayloadAction<FeedResponse>) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
  },
});

export default feedSlice.reducer;