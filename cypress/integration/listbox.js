/**
 * @file cypress/integration/listbox.js
 * @summary Cypress spec for End-to-End UI testing.
 * @requires accessible-components
 */

/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-len */

// Test principles:
// ARRANGE: SET UP APP STATE > ACT: INTERACT WITH IT > ASSERT: MAKE ASSERTIONS

// Passing arrow functions (“lambdas”) to Mocha is discouraged
// https://mochajs.org/#arrow-functions
/* eslint-disable func-names */

const componentClass = 'select';

// https://github.com/Bkucera/cypress-plugin-retries
Cypress.env('RETRIES', 2);

describe('Single Select', function () {
    before(function () {
        cy.visit('single-select-listbox.html');
    });

    describe('Configuration', function () {
        it('Classes exist', function () {
            // check that the class is available
            cy.window()
                .should('have.property', 'SingleSelectListbox');

            // check that it's a function
            cy.window().then((win) => {
                expect(win.SingleSelectListbox).to.be.a('function');
            });

            // check that the class is available
            cy.window()
                .should('have.property', 'KeyboardHelpers');

            // check that it's a function
            cy.window().then((win) => {
                expect(win.KeyboardHelpers).to.be.a('function');
            });
        });
    });

    const testIds = [
        'test-1',
        'test-2',
        'test-3'
    ];

    describe('Tests', function () {
        testIds.forEach(function (testId) {
            context(`#${testId}`, function () {
                beforeEach(function () {
                    // @aliases
                    // Aliases are cleared between tests
                    // https://stackoverflow.com/questions/49431483/using-aliases-in-cypress

                    // a gallery viewer that is below the fold won't have been transformed yet
                    // the default gallery item is an image, which is accessible
                    cy.get(`#${testId} .${componentClass}`)
                        .as('select');

                    cy.get(`#${testId} .${componentClass} button`)
                        .as('button');

                    cy.get(`#${testId} .${componentClass} [role="listbox"]`)
                        .as('listbox');

                    cy.get(`#${testId} .${componentClass} [role="option"] `)
                        .as('options');
                });

                it('Elements exist', function () {
                    cy.get('@select').should('exist');
                    cy.get('@button').should('exist');
                    cy.get('@listbox').should('exist');
                    cy.get('@options').should('exist');
                });

                it('Listbox should be hidden', function () {
                    cy.get('@listbox')
                        .should('have.attr', 'hidden');
                });

                // this works due to tabindex="0" (and also tabindex="-1")
                it('Listbox can be focussed', function () {
                    cy.get('@listbox').focus();

                    cy.get('@listbox').then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it('Button can be focussed', function () {
                    cy.get('@button').focus();

                    cy.get('@button').then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it('A click opens the listbox', function () {
                    // Cypress doesn't translate Enter to click
                    // even though the browser does
                    // cy.get('@button')
                    //     .type('{enter}', { force: true, delay: 500 });

                    cy.get('@button')
                        .click();

                    cy.get('@listbox')
                        .should('not.have.attr', 'hidden');
                });

                if (testId === 'test-1') {
                    it('The default option is not selected', function () {
                        cy.get('@options').eq(0)
                            .should('not.have.attr', 'aria-selected');
                    });
                } else if ((testId === 'test-2') || (testId === 'test-3')) {
                    it('The default option is selected', function () {
                        cy.get('@options').eq(0)
                            .should('have.attr', 'aria-selected');
                    });
                }

                it('The ArrowDown key moves the focus to the next option', function () {
                    cy.get('@options').eq(0)
                        .type('{downarrow}');

                    cy.get('@options').eq(1).then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it('The Enter key selects the current option, hides the listbox, returns focus to the button, displays the new value in the button', function () {
                    cy.get('@options').eq(1)
                        .type('{enter}');

                    cy.get('@options').eq(0)
                        .should('not.have.attr', 'aria-selected');

                    cy.get('@options').eq(1)
                        .should('have.attr', 'aria-selected');

                    cy.get('@listbox')
                        .should('have.attr', 'hidden');

                    cy.get('@button').then(($button) => {
                        Cypress.dom.isFocused($button);

                        const $buttonText = $button.text();

                        cy.get('@options').eq(1)
                            .should('have.text', $buttonText);
                    });
                });

                it.skip('Spacebar key opens the listbox', function () {
                    cy.get('@button')
                        .focus()
                        .type(' ');

                    cy.get('@listbox')
                        .should('not.have.attr', 'hidden');
                });
            });
        });
    });
});
