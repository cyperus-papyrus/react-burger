import { Ingredient, IngredientsResponse, OrderResponse } from './types';

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
    throw new Error(data.message || 'API request failed');
};

export const fetchIngredients = async (): Promise<Ingredient[]> => {
    try {
        const response = await fetch(`${BASE_URL}/ingredients`);
        const data = await handleResponse<IngredientsResponse>(response);
        return data.data;
    } catch (error) {
        console.error('Ошибка загрузки ингридиентов:', error);
        throw error;
    }
};

export const createOrder = async (ingredientIds: string[]): Promise<OrderResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: ingredientIds }),
        });
        return await handleResponse<OrderResponse>(response);
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        throw error;
    }
};