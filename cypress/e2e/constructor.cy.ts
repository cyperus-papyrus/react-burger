import { setInitialAuth } from "../../src/services/auth";

const selectors = {
    constructorArea: '[data-cy=constructor-area]',
    constructorBun: '[data-cy=constructor-bun]',
    ingredientDetails: '[data-cy=ingredient-details]',
    orderDetails: '[data-cy=order-details]',
    modalClose: '[data-cy=modal-close]',
    orderButton: '[data-cy=order-button]',
    ingredientBun: '[data-cy=ingredient-643d69a5c3f7b9001cfa093c]',
    ingredientMain: '[data-cy=ingredient-643d69a5c3f7b9001cfa0941]',
};

describe('Страница Конструктора', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.intercept('GET', 'api/ingredients', {
            fixture: 'ingredients.json',
        }).as('getIngredients');
        cy.intercept('POST', 'api/orders', {
            fixture: 'order.json',
        }).as('createOrder');
        cy.wait('@getIngredients');
        cy.get(selectors.constructorArea).as('constructorArea');
    });

    it('должен открывать и закрывать модальное окно ингредиента', () => {
        cy.contains('Флюоресцентная булка').click();
        cy.get(selectors.ingredientDetails).as('ingredientModal');
        cy.get('@ingredientModal').should('be.visible');
        cy.contains('Калории,ккал').should('be.visible');
        cy.contains('643').should('be.visible');
        cy.get(selectors.modalClose).click();
        cy.get('@ingredientModal').should('not.exist');
    });

    it('должен перетаскивать ингредиент в конструктор', () => {
        cy.get(selectors.constructorArea).as('constructorArea');
        cy.dragAndDropReact(selectors.ingredientBun, '@constructorArea');
        cy.get(selectors.constructorBun).should('contain', 'Флюоресцентная булка');
    });

    it('должен оформлять заказ и показывать номер', () => {
        cy.get(selectors.constructorArea).as('constructorArea');
        cy.dragAndDropReact(selectors.ingredientBun, '@constructorArea');
        cy.dragAndDropReact(selectors.ingredientMain, '@constructorArea');

        cy.window().then((win) => {
            win.store.dispatch(setInitialAuth({ accessToken: 'mock', refreshToken: 'mock' }));
            cy.wrap(win.store.getState().auth.isAuthenticated).should('be.true');
        });

        cy.get(selectors.orderButton).click();
        cy.wait('@createOrder');

        cy.get(selectors.orderDetails).should('be.visible');
        cy.contains('12345').should('be.visible');

        cy.get(selectors.modalClose).click();
        cy.get(selectors.orderDetails).should('not.exist');
    });
});