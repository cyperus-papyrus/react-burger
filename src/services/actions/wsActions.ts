import { createAction } from '@reduxjs/toolkit';
import { FeedResponse } from '../../utils/types';

export const feedWsConnect = createAction<string>('FEED_WS_CONNECT');
export const feedWsDisconnect = createAction('FEED_WS_DISCONNECT');
export const feedWsSend = createAction<any>('FEED_WS_SEND');
export const feedWsOpen = createAction('FEED_WS_OPEN');
export const feedWsClose = createAction('FEED_WS_CLOSE');
export const feedWsError = createAction<string>('FEED_WS_ERROR');
export const feedWsMessage = createAction<FeedResponse>('FEED_WS_MESSAGE');

export const profileWsConnect = createAction<string>('PROFILE_WS_CONNECT');
export const profileWsDisconnect = createAction('PROFILE_WS_DISCONNECT');
export const profileWsSend = createAction<any>('PROFILE_WS_SEND');
export const profileWsOpen = createAction('PROFILE_WS_OPEN');
export const profileWsClose = createAction('PROFILE_WS_CLOSE');
export const profileWsError = createAction<string>('PROFILE_WS_ERROR');
export const profileWsMessage = createAction<FeedResponse>('PROFILE_WS_MESSAGE');

export const feedWsActions = {
    connect: feedWsConnect.type,
    disconnect: feedWsDisconnect.type,
    send: feedWsSend.type,
    onOpen: feedWsOpen.type,
    onClose: feedWsClose.type,
    onError: feedWsError.type,
    onMessage: feedWsMessage.type,
};

export const profileWsActions = {
    connect: profileWsConnect.type,
    disconnect: profileWsDisconnect.type,
    send: profileWsSend.type,
    onOpen: profileWsOpen.type,
    onClose: profileWsClose.type,
    onError: profileWsError.type,
    onMessage: profileWsMessage.type,
};