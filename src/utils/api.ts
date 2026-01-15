import { Ingredient, ApiResponse } from './types';

export const BASE_URL = 'https://norma.education-services.ru/api/ingredients';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
    }
    const data: ApiResponse<T> = await response.json();
    if (!data.success) {
        throw new Error(data.message || 'Ошибка в данных от сервера')
    }
    return data.data;
};

export const fetchIngredients = async (): Promise<Ingredient[]> => {
    try {
        const response = await fetch(BASE_URL);
        return await handleResponse<Ingredient[]>(response);
    } catch (error) {
        console.error('Ошибка при запросе ингредиентов:', error);
        throw error;
    }
};