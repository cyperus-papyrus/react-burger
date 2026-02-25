import {
    Ingredient,
    IngredientsResponse,
    OrderResponse,
    AuthResponse,
    RegisterRequest,
    LoginRequest,
    MessageResponse,
    TokenResponse,
    UserResponse,
    UpdateUserRequest,
    ResetPasswordConfirmRequest
} from './types';

export const BASE_URL = 'https://norma.education-services.ru/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
        return data;
    }
    throw new Error(data.message || 'API запрос упал');
};

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
}

export const fetchIngredients = async (): Promise<Ingredient[]> => {
    try {
        const data = await request<IngredientsResponse>('/ingredients');
        return data.data;
    } catch (error) {
        console.error('Ошибка загрузки ингридиентов:', error);
        throw error;
    }
};

export const createOrder = async (ingredientIds: string[]): Promise<OrderResponse> => {
    try {
        const data = await request<OrderResponse>('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients: ingredientIds }),
        })
        return data;
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        throw error;
    }
};

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
    }
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        throw error;
    }
};

export const logoutUser = async (token: string): Promise<MessageResponse> => {
    try {
        const response = await request<MessageResponse>('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        return response;
    } catch (error) {
        console.error('Ошибка выхода:', error);
        throw error;
    }
};

export const refreshToken = async (token: string): Promise<TokenResponse> => {
    try {
        const response = await request<TokenResponse>('/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        return response;
    } catch (error) {
        console.error('Ошибка обновления токена:', error);
        throw error;
    }
};

export const getUserData = async (accessToken: string): Promise<UserResponse> => {
    try {
        const response = await request<UserResponse>('/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        });
        return response;
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        throw error;
    }
};

export const updateUserData = async (data: UpdateUserRequest, accessToken: string): Promise<UserResponse> => {
    try {
        const response = await request<UserResponse>('/auth/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Ошибка обновления данных пользователя:', error);
        throw error;
    }
};

export const requestPasswordReset = async (email: string): Promise<MessageResponse> => {
    try {
        const response = await request<MessageResponse>('/password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        return response;
    } catch (error) {
        console.error('Ошибка восстановления пароля:', error);
        throw error;
    }
};

export const resetPassword = async (data: ResetPasswordConfirmRequest): Promise<MessageResponse> => {
    try {
        const response = await request<MessageResponse>('/password-reset/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Ошибка сброса пароля:', error);
        throw error;
    }
};
