import { Middleware, MiddlewareAPI, UnknownAction } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';

interface WsActions {
    connect: string;
    disconnect: string;
    send: string;
    onOpen: string;
    onClose: string;
    onError: string;
    onMessage: string;
}

export const socketMiddleware = (wsActions: WsActions): Middleware => {
    return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
        let socket: WebSocket | null = null;

        return (next) => (action: UnknownAction) => {
            const { dispatch } = store;
            const { type } = action;

            if (type === wsActions.connect) {
                const connectAction = action as PayloadAction<string>;
                socket = new WebSocket(connectAction.payload);
            }

            if (socket) {
                socket.onopen = () => {
                    dispatch({ type: wsActions.onOpen });
                };

                socket.onerror = () => {
                    dispatch({ type: wsActions.onError, payload: 'Connection error' });
                };

                socket.onmessage = (event) => {
                    const { data } = event;
                    const parsedData = JSON.parse(data);
                    dispatch({ type: wsActions.onMessage, payload: parsedData });
                };

                socket.onclose = () => {
                    dispatch({ type: wsActions.onClose });
                };

                if (type === wsActions.send) {
                    const sendAction = action as PayloadAction<any>;
                    socket.send(JSON.stringify(sendAction.payload));
                }

                if (type === wsActions.disconnect) {
                    socket.close();
                    socket = null;
                }
            }

            next(action);
        };
    }) as Middleware;
};