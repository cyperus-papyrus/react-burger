export type IngredientType = 'bun' | 'main' | 'sauce';

export interface Ingredient {
    _id: string;
    name: string;
    type: IngredientType;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

// Тип для ответа API (будет использовано, когда подключим)
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export type IngredientsArray = Ingredient[];

export interface BurgerIngredientsProps {
    ingredients: Ingredient[];
}

export interface IngredientCardProps {
    ingredient: Ingredient;
    count?: number;
    onClick?: (ingredient: Ingredient) => void;
}

export interface IngredientsTabsProps {
    currentTab: string;
    onTabClick: (value: string) => void;
}

export interface BurgerConstructorProps {
    ingredients: Ingredient[];
}
