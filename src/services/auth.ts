import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../utils/api';
import {
    AuthState,
    LoginRequest,
    RegisterRequest,
    UpdateUserRequest,
    ResetPasswordConfirmRequest
} from '../utils/types';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';
import { PayloadAction } from '@reduxjs/toolkit';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const ACCESS_TOKEN_MAX_AGE = 20 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const initialState: AuthState = {
    user: null,
    accessToken: getCookie(ACCESS_TOKEN_COOKIE) || null,
    refreshToken: getCookie(REFRESH_TOKEN_COOKIE) || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!getCookie(ACCESS_TOKEN_COOKIE),
};

export const initAuthThunk = createAsyncThunk(
    'auth/init',
    async (_, { dispatch, getState }) => {
        try {
            const state = getState() as { auth: AuthState };

            if (state.auth.accessToken) {
                await dispatch(getUserDataThunk()).unwrap();
                return true;
            }

            if (state.auth.refreshToken && !state.auth.accessToken) {
                await dispatch(refreshTokenThunk()).unwrap();
                await dispatch(getUserDataThunk()).unwrap();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Ошибка инициализации аутентификации:', error);
            return false;
        }
    }
);

export const registerUserThunk = createAsyncThunk(
    'auth/register',
    async (data: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.registerUser(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка регистрации');
        }
    }
);

export const loginUserThunk = createAsyncThunk(
    'auth/login',
    async (data: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await api.loginUser(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка авторизации');
        }
    }
);

export const logoutUserThunk = createAsyncThunk(
    'auth/logout',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {
                await api.logoutUser(refreshToken);
            }

            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка выхода');
        }
    }
);

export const getUserDataThunk = createAsyncThunk(
    'auth/getUser',
    async (_, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState() as { auth: AuthState };
            let accessToken = state.auth.accessToken;

            if (!accessToken) {
                return rejectWithValue('Токен не найден');
            }
            try {
                const response = await api.getUserData(accessToken);
                return response;

            } catch (error: any) {
                if (error.message === 'jwt expired' || error.message === 'Token is invalid') {
                    await dispatch(refreshTokenThunk()).unwrap();

                    const newState = getState() as { auth: AuthState };
                    accessToken = newState.auth.accessToken!;

                    const response = await api.getUserData(accessToken);
                    return response;
                }
                throw error;
            }

        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка получения данных пользователя');
        }
    }
);


export const updateUserDataThunk = createAsyncThunk(
    'auth/updateUser',
    async (data: UpdateUserRequest, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState() as { auth: AuthState };
            let accessToken = state.auth.accessToken;

            if (!accessToken) {
                throw new Error('Токен не найден');
            }
            try {
                const response = await api.updateUserData(data, accessToken);
                return response;
            } catch (error: any) {
                if (error.message === 'jwt expired' || error.message === 'Token is invalid') {
                    await dispatch(refreshTokenThunk()).unwrap();

                    const newState = getState() as { auth: AuthState };
                    accessToken = newState.auth.accessToken!;

                    const response = await api.getUserData(accessToken);
                    return response;
                }
                throw error;
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка обновления данных пользователя');
        }
    }
);

export const requestPasswordResetThunk = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await api.requestPasswordReset(email);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка восстановления пароля');
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    'auth/resetPassword',
    async (data: ResetPasswordConfirmRequest, { rejectWithValue }) => {
        try {
            const response = await api.resetPassword(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка сброса пароля');
        }
    }
);

export const refreshTokenThunk = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const refreshToken = state.auth.refreshToken;

            if (!refreshToken) {
                throw new Error('Refresh token не найден');
            }

            const response = await api.refreshToken(refreshToken);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка обновления токена');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        restoreFromCookies: (state) => {
            if (!state.accessToken) {
                state.accessToken = getCookie(ACCESS_TOKEN_COOKIE) || null;
            }
            if (!state.refreshToken) {
                state.refreshToken = getCookie(REFRESH_TOKEN_COOKIE) || null;
            }
            if (!state.isAuthenticated && state.accessToken) {
                state.isAuthenticated = true;
            }
        },
        setInitialAuth: (state, action: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = !!action.payload.accessToken;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initAuthThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initAuthThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload;
            })
            .addCase(initAuthThunk.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            })
            .addCase(registerUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;

                setCookie(ACCESS_TOKEN_COOKIE, action.payload.accessToken, ACCESS_TOKEN_MAX_AGE);
                setCookie(REFRESH_TOKEN_COOKIE, action.payload.refreshToken, REFRESH_TOKEN_MAX_AGE);
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;

                setCookie(ACCESS_TOKEN_COOKIE, action.payload.accessToken, ACCESS_TOKEN_MAX_AGE);
                setCookie(REFRESH_TOKEN_COOKIE, action.payload.refreshToken, REFRESH_TOKEN_MAX_AGE);
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUserThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUserThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = null;

                deleteCookie(ACCESS_TOKEN_COOKIE);
                deleteCookie(REFRESH_TOKEN_COOKIE);
            })
            .addCase(logoutUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getUserDataThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserDataThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(getUserDataThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                if (action.payload === 'jwt expired' || action.payload === 'Token is invalid') {
                    state.isAuthenticated = false;
                }
            })
            .addCase(updateUserDataThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserDataThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(updateUserDataThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(requestPasswordResetThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(requestPasswordResetThunk.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(requestPasswordResetThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPasswordThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;

                setCookie(ACCESS_TOKEN_COOKIE, action.payload.accessToken, ACCESS_TOKEN_MAX_AGE);
                setCookie(REFRESH_TOKEN_COOKIE, action.payload.refreshToken, REFRESH_TOKEN_MAX_AGE);
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;

                deleteCookie(ACCESS_TOKEN_COOKIE);
                deleteCookie(REFRESH_TOKEN_COOKIE);
            });
    },
});

export const { clearError, restoreFromCookies, setInitialAuth } = authSlice.actions;
export default authSlice.reducer;