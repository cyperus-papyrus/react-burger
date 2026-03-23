import authReducer, {
    initAuthThunk,
    registerUserThunk,
    loginUserThunk,
    logoutUserThunk,
    getUserDataThunk,
    updateUserDataThunk,
    requestPasswordResetThunk,
    resetPasswordThunk,
    refreshTokenThunk,
    clearError,
    restoreFromCookies,
    setInitialAuth,
} from './auth';
import { UnknownAction } from 'redux';
import { initialState } from './auth';

jest.mock('../utils/cookie', () => ({
    getCookie: jest.fn().mockReturnValue(null),
    setCookie: jest.fn(),
    deleteCookie: jest.fn(),
}));


const { getCookie, setCookie, deleteCookie } = require('../utils/cookie');

describe('auth slice', () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    const mockTokens = {
        accessToken: 'mockAccess',
        refreshToken: 'mockRefresh',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getCookie as jest.Mock).mockReturnValue(null);
    });

    it('должен возвращать начальное состояние', () => {
        expect(authReducer(undefined, { type: 'unknown' } as UnknownAction)).toEqual(initialState);
    });

    it('должен обрабатывать clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const newState = authReducer(stateWithError, clearError());
        expect(newState.error).toBeNull();
    });

    it('должен обрабатывать restoreFromCookies', () => {
        (getCookie as jest.Mock)
            .mockReturnValueOnce('tokenFromCookie')
            .mockReturnValueOnce('refreshFromCookie');
        const state = authReducer(initialState, restoreFromCookies());
        expect(state.accessToken).toBe('tokenFromCookie');
        expect(state.refreshToken).toBe('refreshFromCookie');
        expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать setInitialAuth', () => {
        const action = setInitialAuth({ accessToken: 'newAccess', refreshToken: 'newRefresh' });
        const state = authReducer(initialState, action);
        expect(state.accessToken).toBe('newAccess');
        expect(state.refreshToken).toBe('newRefresh');
        expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать initAuthThunk.pending', () => {
        const action = { type: initAuthThunk.pending.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(true);
    });

    it('должен обрабатывать initAuthThunk.fulfilled', () => {
        const action = { type: initAuthThunk.fulfilled.type, payload: true };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать initAuthThunk.rejected', () => {
        const action = { type: initAuthThunk.rejected.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
    });

    it('должен обрабатывать registerUserThunk.pending', () => {
        const action = { type: registerUserThunk.pending.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('должен обрабатывать registerUserThunk.fulfilled', () => {
        const payload = { user: mockUser, accessToken: mockTokens.accessToken, refreshToken: mockTokens.refreshToken };
        const action = { type: registerUserThunk.fulfilled.type, payload };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe(mockTokens.accessToken);
        expect(state.refreshToken).toBe(mockTokens.refreshToken);
        expect(state.isAuthenticated).toBe(true);
        expect(setCookie).toHaveBeenCalledTimes(2);
    });

    it('должен обрабатывать registerUserThunk.rejected', () => {
        const action = { type: registerUserThunk.rejected.type, payload: 'Ошибка регистрации' };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка регистрации');
    });

    it('должен обрабатывать loginUserThunk.fulfilled', () => {
        const payload = { user: mockUser, accessToken: mockTokens.accessToken, refreshToken: mockTokens.refreshToken };
        const action = { type: loginUserThunk.fulfilled.type, payload };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe(mockTokens.accessToken);
        expect(state.refreshToken).toBe(mockTokens.refreshToken);
        expect(state.isAuthenticated).toBe(true);
        expect(setCookie).toHaveBeenCalledTimes(2);
    });

    it('должен обрабатывать logoutUserThunk.fulfilled', () => {
        const loggedState = { ...initialState, user: mockUser, accessToken: 'token', refreshToken: 'refresh', isAuthenticated: true };
        const action = { type: logoutUserThunk.fulfilled.type };
        const state = authReducer(loggedState, action);
        expect(state.isLoading).toBe(false);
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBeNull();
        expect(deleteCookie).toHaveBeenCalledTimes(2);
    });

    it('должен обрабатывать getUserDataThunk.fulfilled', () => {
        const action = { type: getUserDataThunk.fulfilled.type, payload: { user: mockUser } };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать getUserDataThunk.rejected с истекшим токеном', () => {
        const action = { type: getUserDataThunk.rejected.type, payload: 'jwt expired' };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('jwt expired');
        expect(state.isAuthenticated).toBe(false);
    });

    it('должен обрабатывать updateUserDataThunk.fulfilled', () => {
        const action = { type: updateUserDataThunk.fulfilled.type, payload: { user: mockUser } };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
    });

    it('должен обрабатывать requestPasswordResetThunk.fulfilled', () => {
        const action = { type: requestPasswordResetThunk.fulfilled.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
    });

    it('должен обрабатывать resetPasswordThunk.fulfilled', () => {
        const action = { type: resetPasswordThunk.fulfilled.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(false);
    });

    it('должен обрабатывать refreshTokenThunk.fulfilled', () => {
        const payload = { accessToken: 'newAccess', refreshToken: 'newRefresh' };
        const action = { type: refreshTokenThunk.fulfilled.type, payload };
        const state = authReducer(initialState, action);
        expect(state.accessToken).toBe('newAccess');
        expect(state.refreshToken).toBe('newRefresh');
        expect(state.isAuthenticated).toBe(true);
        expect(setCookie).toHaveBeenCalledTimes(2);
    });

    it('должен обрабатывать refreshTokenThunk.rejected', () => {
        const loggedState = { ...initialState, user: mockUser, accessToken: 'old', refreshToken: 'old', isAuthenticated: true };
        const action = { type: refreshTokenThunk.rejected.type };
        const state = authReducer(loggedState, action);
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(deleteCookie).toHaveBeenCalledTimes(2);
    });
});