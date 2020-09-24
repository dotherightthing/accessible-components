// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('getAttr', (selector, attr, format = 'string') => {
    let value = null;

    cy.get('body').then((body) => {
        let el = body.find(`${selector}[${attr}]`);

        if (el.length) {
            value = el.attr(attr);
        }

        if (format === 'number') {
            value = parseInt(value, 10);
        } else if (format === 'index') {
            value = parseInt(value, 10) - 1;
        }

        cy.log(`${selector}[${attr}] = ${value} (${typeof value})`);

        return cy.wrap(value);
    });
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
