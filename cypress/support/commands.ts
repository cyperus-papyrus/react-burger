Cypress.Commands.add('dragAndDropReact', (dragSelector: string, dropSelector: string) => {
    cy.get(dragSelector).then(($drag) => {
        const dragData = $drag.get(0);
        cy.get(dropSelector).then(($drop) => {
            const dropData = $drop.get(0);
            const dragStartEvent = new DragEvent('dragstart', { bubbles: true });
            dragData.dispatchEvent(dragStartEvent);
            const dropEvent = new DragEvent('drop', { bubbles: true });
            dropData.dispatchEvent(dropEvent);
        });
    });
});