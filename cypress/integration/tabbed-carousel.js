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

const componentClass = 'tabbed-carousel';

// https://github.com/Bkucera/cypress-plugin-retries
Cypress.env('RETRIES', 2);

describe('Tabbed Carousel', function () {
    before(function () {
        cy.visit('tabbed-carousel.html');
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
        'test-1'
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

                    cy.get(`#${testId}`).within(() => {
                        cy.get(`.${componentClass}`)
                            .as('tabbedCarousel');

                        cy.get(`.${componentClass} [role="tab"]`)
                            .as('tab');

                        cy.get(`.${componentClass} [role="tablist"]`)
                            .as('tablist');

                        cy.get(`.${componentClass} .slide`)
                            .as('tabpanel');

                        cy.get(`.${componentClass} .slides__nav-previous`)
                            .as('tabpanelNavPrevious');

                        cy.get(`.${componentClass} .slides__nav-next`)
                            .as('tabpanelNavNext');
                    });
                });

                context('Caveats', function () {
                    // cy.log('https://www.w3.org/TR/wai-aria-practices/#browser_and_AT_support - Testing assistive technology interoperability is essential before using code from this guide in production. Because the purpose of this guide is to illustrate appropriate use of ARIA 1.1 as defined in the ARIA specification, the design patterns, reference examples, and sample code intentionally do not describe and implement coding techniques for working around problems caused by gaps in support for ARIA 1.1 in browsers and assistive technologies. It is thus advisable to test implementations thoroughly with each browser and assistive technology combination that is relevant within a target audience.');
                });

                context('WAI-ARIA: Tabs design pattern', function () {
                    it('Tabs', function () {
                        cy.log('Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel, most commonly the top edge.');
                        cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanel');
                    });

                    it('Tabs or Tabbed Interface', function () {
                        cy.log('A set of tab elements and their associated tab panels.');
                        cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanel');

                        cy.get('@tabbedCarousel').within(() => {
                            cy.get('@tab').should('exist');
                            cy.get('@tabpanel').should('exist');
                        });
                    });

                    it('Tab List', function () {
                        cy.log('A set of tab elements contained in a tablist element.');
                        cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanel');

                        cy.get('@tablist').within(() => {
                            cy.get('@tab').should('exist');
                        });
                    });

                    context('tab', function () {
                        it('An element in the tab list that serves as a label for one of the tab panels and can be activated to display that panel.', function () {
                            cy.get('@tabpanel').each(($tabPanel, i) => {
                                cy.get('@tab').eq(i).then(($tab) => {
                                    cy.wrap($tabPanel)
                                        .should('have.attr', 'aria-labelledby', `${$tab.attr('id')}`);

                                    cy.wrap($tab)
                                        .should('have.attr', 'role', 'tab')
                                        .should('have.attr', 'aria-controls', $tabPanel.attr('id'));
                                });
                            });
                        });
                    });

                    it('tabpanel', function () {
                        cy.log('The element that contains the content associated with a tab.');
                        cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanel');

                        cy.get('@tabpanel').should('have.attr', 'role', 'tabpanel');
                    });

                    context('Tabs with Automatic Activation', function () {
                        // cy.log('https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html');
                    });

                    context('Tabs with Manual Activation', function () {
                        // cy.log('https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html');
                    });
                });

                context('Carousel design pattern', function () {
                    context('Features needed to provide sufficient rotation control include', function () {
                        it('Buttons for displaying the previous and next slides.', function () {
                            cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');

                            cy.get('@tabpanelNavPrevious').should('exist');
                            cy.get('@tabpanelNavNext').should('exist');
                        });

                        it('Optionally, a control, or group of controls, for choosing a specific slide to display. For example, slide picker controls can be marked up as tabs in a tablist with the slide represented by a tabpanel element.', function () {
                            cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');

                            cy.get('@tablist').within(() => {
                                cy.get('@tab').should('exist');
                            });
                        });

                        it.skip('If the carousel can automatically rotate, it also: Has a button for stopping and restarting rotation. This is particularly important for supporting assistive technologies operating in a mode that does not move either keyboard focus or the mouse.');

                        it.skip('If the carousel can automatically rotate, it also: Stops rotating when keyboard focus enters the carousel. It does not restart unless the user explicitly requests it to do so.');

                        it.skip('If the carousel can automatically rotate, it also: Stops rotating whenever the mouse is hovering over the carousel.');
                    });

                    context('Tabbed carousel style', function () {
                        it('The structure of a tabbed carousel is the same as a basic carousel except that: Each slide container has role tabpanel in lieu of group, and it does not have the aria-roledescription property.', function () {
                            cy.log('https://www.w3.org/TR/wai-aria-practices/#tabbed-carousel-elements');

                            cy.get('@tabpanel').should('have.attr', 'role', 'tabpanel');
                            cy.get('@tabpanel').should('not.have.attr', 'role', 'group');
                            cy.get('@tabpanel').should('not.have.attr', 'aria-roledescription');
                        });
                    });
                });

                it.skip('Removing JS hook shows pre-JS state', function () {});

                it('Tab can be focussed', function () {
                    cy.get('@tab').eq(0).focus();

                    cy.get('@tab').eq(0).then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it('Tab panel can be focussed', function () {
                    cy.get('@tabpanel').eq(0).focus();

                    cy.get('@tabpanel').eq(0).then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it.skip('A click opens the listbox', function () {
                    // Cypress doesn't translate Enter to click
                    // even though the browser does
                    // cy.get('@button')
                    //     .type('{enter}', { force: true, delay: 500 });

                    cy.get('@button')
                        .click();

                    cy.get('@listbox')
                        .should('not.have.attr', 'hidden');
                });

                // if (testId === 'test-1') {
                //     it('The default option is not tabbedCarouseled', function () {
                //         cy.get('@options').eq(0)
                //             .should('not.have.attr', 'aria-tabbedCarouseled');
                //     });
                // } else if ((testId === 'test-2') || (testId === 'test-3')) {
                //     it('The default option is tabbedCarouseled', function () {
                //         cy.get('@options').eq(0)
                //             .should('have.attr', 'aria-tabbedCarouseled');
                //     });
                // }

                it.skip('The ArrowDown key moves the focus to the next option', function () {
                    cy.get('@options').eq(0)
                        .type('{downarrow}');

                    cy.get('@options').eq(1).then(($el) => {
                        Cypress.dom.isFocused($el);
                    });
                });

                it.skip('The Enter key tabbedCarousels the current option, hides the listbox, returns focus to the button, displays the new value in the button', function () {
                    cy.get('@options').eq(1)
                        .type('{enter}');

                    cy.get('@options').eq(0)
                        .should('not.have.attr', 'aria-tabbedCarouseled');

                    cy.get('@options').eq(1)
                        .should('have.attr', 'aria-tabbedCarouseled');

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
