import { setInitialAuth } from "../../src/services/auth";

describe('Страница Конструктора', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.intercept('GET', 'https://norma.education-services.ru/api/ingredients', {
            fixture: 'ingredients.json',
        }).as('getIngredients');
        cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
            fixture: 'order.json',
        }).as('createOrder');
        cy.wait('@getIngredients');
    });

    it('должен открывать и закрывать модальное окно ингредиента', () => {
        cy.contains('Флюоресцентная булка').click();
        cy.get('[data-cy=ingredient-details]').should('be.visible');
        cy.contains('Калории,ккал').should('be.visible');
        cy.contains('643').should('be.visible');
        cy.get('[data-cy=modal-close]').click();
        cy.get('[data-cy=ingredient-details]').should('not.exist');
    });

    it('должен перетаскивать ингредиент в конструктор', () => {
        cy.dragAndDropReact('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]', '[data-cy=constructor-area]');
        cy.get('[data-cy=constructor-bun]').should('contain', 'Флюоресцентная булка');
    });

    it('должен оформлять заказ и показывать номер', () => {
        cy.dragAndDropReact('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]', '[data-cy=constructor-area]');
        cy.dragAndDropReact('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]', '[data-cy=constructor-area]');

        cy.window().then((win) => {
            win.store.dispatch(setInitialAuth({ accessToken: 'mock', refreshToken: 'mock' }));
            cy.wrap(win.store.getState().auth.isAuthenticated).should('be.true')
        });

        cy.get('[data-cy=order-button]').click();

        cy.wait('@createOrder');

        cy.get('[data-cy=order-details]').should('be.visible');
        cy.contains('12345').should('be.visible');

        cy.get('[data-cy=modal-close]').click();
        cy.get('[data-cy=order-details]').should('not.exist');
    });
});