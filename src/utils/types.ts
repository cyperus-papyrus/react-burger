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

export interface BaseApiResponse {
    success: boolean;
    message?: string;
}

export interface IngredientsResponse extends BaseApiResponse {
    data: Ingredient[];
}

export interface OrderResponse extends BaseApiResponse {
    name: string;
    order: {
        number: number;
    };
}

export type IngredientsArray = Ingredient[];

export interface IngredientCardProps {
    ingredient: Ingredient;
    count?: number;
    onClick?: (ingredient: Ingredient) => void;
}

export interface IngredientsTabsProps {
    currentTab: string;
    onTabClick: (value: string) => void;
}

export interface ConstructorIngredient extends Ingredient {
    uniqueId: string;
}

export interface BurgerConstructorState {
    bun: Ingredient | null;
    ingredients: ConstructorIngredient[];
}

export interface BurgerIngredientsState {
    items: Ingredient[];
    isLoading: boolean;
    error: string | null;
}

export interface IngredientDetailsState {
    item: Ingredient | null;
}

export interface OrderDetailsState {
    order: {
        number: number | null;
        name: string | null;
    };
    isLoading: boolean;
    error: string | null;
}