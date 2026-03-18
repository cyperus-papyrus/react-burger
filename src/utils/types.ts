export type IngredientType = 'bun' | 'main' | 'sauce';

export interface Ingredient {
    readonly _id: string;
    readonly name: string;
    readonly type: IngredientType;
    readonly proteins: number;
    readonly fat: number;
    readonly carbohydrates: number;
    readonly calories: number;
    readonly price: number;
    readonly image: string;
    readonly image_mobile: string;
    readonly image_large: string;
    readonly __v: number;
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
    readonly uniqueId: string;
}

export interface BurgerConstructorState {
    bun: Ingredient | null;
    ingredients: ConstructorIngredient[];
}

export interface IngredientDetailsState {
    item: Ingredient | null;
}

export type AsyncState<T, DataField extends string = 'data'> = {
    [K in DataField]: T;
} & {
    isLoading: boolean;
    error: string | null;
};

export interface BurgerIngredientsState extends AsyncState<Ingredient[], 'items'> { }
export interface OrderDetailsState extends AsyncState<{ number: number | null; name: string | null }, 'order'> { }

export interface User {
    readonly email: string;
    readonly name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    name: string;
}

export interface LogoutRequest {
    token: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordConfirmRequest {
    password: string;
    token: string;
}

export interface UpdateUserRequest {
    email?: string;
    name?: string;
    password?: string;
}

export interface AuthResponse extends BaseApiResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface UserResponse extends BaseApiResponse {
    user: User;
}

export interface TokenResponse extends BaseApiResponse {
    accessToken: string;
    refreshToken: string;
}

export interface MessageResponse extends BaseApiResponse {
    message: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}