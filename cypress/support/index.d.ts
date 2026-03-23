declare namespace Cypress {
    interface Chainable {
        dragAndDropReact(dragSelector: string, dropSelector: string): Chainable<void>;
    }
}