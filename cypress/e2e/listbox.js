/**
 * @file cypress/e2e/listbox.js
 * @summary Cypress spec for End-to-End UI testing.
 * @requires accessible-components
 */

/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-len */
/* eslint-disable cypress/unsafe-to-chain-command */

// Test principles:
// ARRANGE: SET UP APP STATE > ACT: INTERACT WITH IT > ASSERT: MAKE ASSERTIONS

// Passing arrow functions (“lambdas”) to Mocha is discouraged
// https://mochajs.org/#arrow-functions
/* eslint-disable func-names */

const componentClass = 'select';
const defaultSelectionAttr = 'data-cy-default-selection';
const selectionFollowsFocusAttr = 'data-selection-follows-focus';

// https://github.com/Bkucera/cypress-plugin-retries
Cypress.env('RETRIES', 2);

describe('Single Select', function () {
    before(function () {
        cy.visit('listbox.html');
    });

    describe('Configuration', function () {
        it('Classes exist', function () {
            [ 'SingleSelectListbox', 'KeyboardHelpers' ].forEach(($class) => {
                cy.window().then((win) => {
                    cy.wrap(win)
                        .should('have.property', $class);

                    cy.wrap(win[$class])
                        .should('be.a', 'function');
                });
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

                    cy.reload();

                    cy.get(`#${testId}`)
                        .as('testBlock');

                    // cy.get(`#${testId}-start`)
                    //     .as('testAnchor');

                    cy.get(`#${testId}`).within(() => {
                        // component wrapper
                        cy.get(`.${componentClass}`)
                            .as('select');

                        // faux select box
                        cy.get(`.${componentClass} button`)
                            .as('button');

                        // toggled dropdown
                        cy.get(`.${componentClass} [role="listbox"]`)
                            .as('listbox');

                        // options within the dropdown
                        cy.get(`.${componentClass} [role="option"] `)
                            .as('options');
                    });
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

                // structure follows https://www.w3.org/TR/wai-aria-practices
                context('WAI-ARIA design pattern', function () {
                    it('Notes', function () {
                        cy.log('"... common GUI operating systems as demonstrated in Design Patterns"');
                    });

                    context('Caveats', function () {
                        it('Browser and Assistive Technology Support', function () {
                            cy.log('https://www.w3.org/TR/wai-aria-practices/#browser_and_AT_support - Testing assistive technology interoperability is essential before using code from this guide in production. Because the purpose of this guide is to illustrate appropriate use of ARIA 1.1 as defined in the ARIA specification, the design patterns, reference examples, and sample code intentionally do not describe and implement coding techniques for working around problems caused by gaps in support for ARIA 1.1 in browsers and assistive technologies. It is thus advisable to test implementations thoroughly with each browser and assistive technology combination that is relevant within a target audience.');
                        });
                    });

                    context('A composite component containing multiple design patterns:', function () {
                        it('Notes', function () {
                            cy.log('The ARIA specification refers to a discrete UI component that contains multiple focusable elements as a composite widget. The process of controlling focus movement inside a composite is called managing focus. Following are some ARIA design patterns with example implementations that demonstrate focus management: ... Tabs. See https://www.w3.org/TR/wai-aria-practices/#kbd_generalnav');
                        });

                        context('Listbox', function () {
                            context('Terms', function () {
                                it('Tabs', function () {
                                    cy.log('A listbox widget presents a list of options and allows a user to select one or more of them. A listbox that allows a single option to be chosen is a single-select listbox; one that allows multiple options to be selected is a multi-select listbox.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#Listbox');
                                });
                            });

                            context('Examples', function () {
                                it('Scrollable Listbox Example', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-scrollable.html');
                                });

                                it('Collapsible Dropdown Listbox Example', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html');
                                });

                                it('Example Listboxes with Rearrangeable Options', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-rearrangeable.html');
                                });
                            });

                            context('Keyboard Interaction', function () {
                                context('For a vertically oriented listbox:', function () {
                                    // Single Select

                                    context('When a single-select listbox receives focus', function () {
                                        context('If none of the options are selected before the listbox receives focus', function () {
                                            // Note: the listbox gets focus after being revealed
                                            // until enter is pressed, revealing the listbox and moving focus to it
                                            // the options are never focussed
                                            // the option is selected via arrow keys or mouse click

                                            it('The first option receives focus.', function () {
                                                cy.log('Note: W3C examples use aria-activedescendant instead (https://github.com/w3c/aria-practices/issues/1573). I have opted for focus as that is how I read the spec and according to Zell is has better support in Voiceover (https://zellwk.com/blog/element-focus-vs-aria-activedescendant/)');

                                                cy.get('@button').click();

                                                cy.get('@options').eq(0)
                                                    .should('have.focus');

                                                // Alternate test (also passes)
                                                // cy.document().then((doc) => {
                                                //     cy.wrap(doc.activeElement)
                                                //         .should('have.attr', 'role', 'option');
                                                // });
                                            });

                                            it('Optionally, the first option may be automatically selected.', function () {
                                                if (testId === 1) { // selection follows focus
                                                    cy.get('@options').first()
                                                        .should('have.attr', 'aria-selected', 'true');
                                                }
                                            });
                                        });

                                        context.skip('TODO - If an option is selected before the listbox receives focus', function () {
                                            it('Focus is set on the selected option.');
                                        });
                                    });

                                    // Multi Select

                                    context.skip('When a multi-select listbox receives focus', function () {
                                        context('If none of the options are selected before the listbox receives focus', function () {
                                            it('focus is set on the first option and there is no automatic change in the selection state.');
                                        });

                                        context('If one or more options are selected before the listbox receives focus', function () {
                                            it('focus is set on the first option in the list that is selected.');
                                        });
                                    });

                                    // Single Select and Multi Select

                                    it('Down Arrow: Moves focus to the next option. Optionally, in a single-select listbox, selection may also move with focus.', function () {
                                        cy.get('@button').click();

                                        cy.get('@listbox')
                                            .should('be.visible');

                                        cy.get('@options').first()
                                            .click() // focus and select
                                            .type('{downarrow}');

                                        cy.get('@options').eq(1)
                                            .should('have.focus');

                                        // Single Select

                                        // note: unlike the tab and multi-select patterns
                                        // unselected options in a single-select are not flagged with aria-selected="false"
                                        cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                            if ($value === 'true') {
                                                cy.get('@options').eq(1)
                                                    .should('have.attr', 'aria-selected', 'true');
                                            }
                                        });
                                    });

                                    // Single Select and Multi Select

                                    it('Up Arrow: Moves focus to the previous option. Optionally, in a single-select listbox, selection may also move with focus.', function () {
                                        cy.get('@button').click();

                                        cy.get('@listbox')
                                            .should('be.visible');

                                        cy.get('@options').eq(1)
                                            .click() // focus and select
                                            .type('{uparrow}');

                                        // note: unlike the tab pattern
                                        // the focus does not loop around to the first/last item
                                        cy.get('@options').first()
                                            .should('have.focus');

                                        // Single Select

                                        cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                            if ($value === 'true') {
                                                cy.get('@options').first()
                                                    .should('have.attr', 'aria-selected', 'true');
                                            }
                                        });
                                    });

                                    it('Home (Optional): Moves focus to first option. Optionally, in a single-select listbox, selection may also move with focus. Supporting this key is strongly recommended for lists with more than five options.', function () {
                                        cy.get('@button').click();

                                        cy.get('@listbox')
                                            .should('be.visible');

                                        cy.get('@options').last()
                                            .click() // focus and select
                                            .type('{home}');

                                        cy.get('@options').first()
                                            .should('have.focus');

                                        cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                            if ($value === 'true') {
                                                cy.get('@tabs').first()
                                                    .should('have.attr', 'aria-selected', 'true');
                                            }
                                        });
                                    });

                                    it('End (Optional): Moves focus to last option. Optionally, in a single-select listbox, selection may also move with focus. Supporting this key is strongly recommended for lists with more than five options.', function () {
                                        cy.get('@button').click();

                                        cy.get('@listbox')
                                            .should('be.visible');

                                        cy.get('@options').first()
                                            .click() // focus and select
                                            .type('{end}');

                                        cy.get('@options').last()
                                            .should('have.focus');

                                        cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                            if ($value === 'true') {
                                                cy.get('@tabs').last()
                                                    .should('have.attr', 'aria-selected', 'true');
                                            }
                                        });
                                    });

                                    context.skip('TODO: Type-ahead is recommended for all listboxes, especially those with more than seven options:', function () {
                                        it('Type a character: focus moves to the next item with a name that starts with the typed character.');
                                        it('Type multiple characters in rapid succession: focus moves to the next item with a name that starts with the string of characters typed.');
                                    });

                                    context.skip('TODO: Multiple Selection', function () {
                                        // see https://www.w3.org/TR/wai-aria-practices/#Listbox
                                    });
                                });
                            });

                            context.only('WAI-ARIA Roles, States, and Properties', function () {
                                it('An element that contains or owns all the listbox options has role listbox.', function () {
                                    if (testId === 'test-3') {
                                        // An element that owns all the listbox options has role listbox
                                        cy.get('@options').each(($option) => {
                                            cy.get(`#${testId} [aria-owns]`).then(($listbox) => {
                                                const ariaOwnsStr = $listbox.attr('aria-owns');

                                                cy.wrap(ariaOwnsStr)
                                                    .should('have.string', $option.attr('id'));

                                                cy.wrap($listbox)
                                                    .should('have.attr', 'role', 'listbox');
                                            });
                                        });
                                    } else {
                                        // An element that contains all the listbox options has role listbox
                                        cy.get('@options').first().parent()
                                            .should('have.attr', 'role', 'listbox');
                                    }
                                });

                                it('Each option in the listbox has role option and is a DOM descendant of the element with role listbox or is referenced by an aria-owns property on the listbox element.', function () {
                                    cy.get('@options').each(($option) => {
                                        // Each option in the listbox has role option
                                        cy.wrap($option)
                                            .should('have.attr', 'role', 'option');

                                        // and is a DOM descendant of the element with role listbox or is referenced by an aria-owns property on the listbox element.
                                        // see previous test
                                    });
                                });

                                it('If the listbox is not part of another widget, then it has a visible label referenced by aria-labelledby on the element with role listbox.', function () {
                                    cy.get('@listbox').then(($listbox) => {
                                        const labelId = $listbox.attr('aria-labelledby');

                                        cy.get(`#${testId} #${labelId}`)
                                            .should('be.visible');
                                    });
                                });

                                it('In a single-select listbox, the selected option has aria-selected set to true.', function () {
                                    cy.getAttr(`#${testId} .${componentClass}`, defaultSelectionAttr).then(($value) => {
                                        if ($value === 'true') {
                                            cy.get('@button').click();

                                            // eslint-disable-next-line
                                            cy.wait(1000); // fix visibility fail, only on CI, only for this test

                                            cy.get('@listbox')
                                                .should('be.visible');

                                            cy.get(`#${testId} [role="option"][aria-selected]`)
                                                .should('have.length', 1);

                                            cy.get(`#${testId} [role="option"][aria-selected]`)
                                                .should('have.attr', 'aria-selected', 'true');
                                        }
                                    });
                                });

                                context.skip('If the listbox supports multiple selection:', function () {
                                    it('The element with role listbox has aria - multiselectable set to true.');
                                    it('All selected options have aria - selected set to true.');
                                    it('All options that are not selected have aria - selected set to false.');
                                });

                                it.skip('If the complete set of available options is not present in the DOM due to dynamic loading as the user scrolls, their aria-setsize and aria-posinset attributes are set appropriately.');

                                it.skip('If options are arranged horizontally, the element with role listbox has aria-orientation set to horizontal. The default value of aria-orientation for listbox is vertical.');
                            });
                        });

                        context('Button', function () {
                            it('Notes', function () {
                                cy.log('In "Keyboard activation for the tab list", "Space or Enter: Activates the tab if it was not activated automatically on focus". This is functionally equivalent to the button design pattern. This is demonstrated in "Example of Tabs with Manual Activation". "Since an HTML button element is used for the tab, it is not necessary to set tabindex=0 on the selected (active) tab element."');
                                cy.log('Understanding this pattern is also necessary as it allows the Tabbed Carousel to degrade to a series of HTML links which link to the various images, rather than buttons which set the active slide or tabpanel. Alternatively, buttons could be disabled until JS is enabled, see Focusability of disabled controls - https://www.w3.org/TR/wai-aria-practices/#kbd_generalnav');
                            });

                            context('Examples', function () {
                                it('Button Examples', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/button/button.html');
                                });
                            });

                            context('Keyboard Interaction', function () {
                                context.skip('TODO - When the button has focus:');
                            });
                        });
                    });
                });

                context.skip('Old tests', function () {
                    // this works due to tabindex="0" (and also tabindex="-1")

                    it('Button can be focussed', function () {
                        cy.get('@button').focus();

                        cy.get('@button')
                            .should('have.focus');
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
                            Cypress.dom.isFocused($button); // .should('have.focus');

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
});
