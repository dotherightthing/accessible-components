/**
 * @file cypress/integration/tabbed-carousel.js
 * @summary Cypress spec for End-to-End UI testing.
 * @requires accessible-components
 *
 * @todo Add injection of JS-dependent elements, test noscript state.
 * @todo Add and test progressive enhancement of link to aria button, to allow fallback of direct link to image
 * @todo Add and test swipe support
 */

/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-len */

// Test principles:
// ARRANGE: SET UP APP STATE > ACT: INTERACT WITH IT > ASSERT: MAKE ASSERTIONS

// Passing arrow functions (“lambdas”) to Mocha is discouraged
// https://mochajs.org/#arrow-functions
/* eslint-disable func-names */

const componentClass = 'tabbed-carousel';
const initialSelectionAttr = 'data-initial-selection';
const selectionFollowsFocusAttr = 'data-selection-follows-focus';

// https://github.com/Bkucera/cypress-plugin-retries
Cypress.env('RETRIES', 2);

describe('Tabbed Carousel', function () {
    before(function () {
        cy.visit('tabbed-carousel.html');
    });

    describe('Configuration', function () {
        it('Classes exist', function () {
            [ 'TabbedCarousel', 'KeyboardHelpers' ].forEach(($class) => {
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
        'test-2'
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

                    cy.get(`#${testId}-start`)
                        .as('testAnchor');

                    cy.get(`#${testId}`).within(() => {
                        cy.get(`.${componentClass}`)
                            .as('tabbedCarousel');

                        cy.get(`.${componentClass} [role="tab"]`)
                            .as('tabs');

                        cy.get(`.${componentClass} [role="tab"] > img`)
                            .as('tabImages');

                        cy.get(`.${componentClass} [role="tablist"]`)
                            .as('tablist');

                        cy.get(`.${componentClass} .tabpanel`)
                            .as('tabpanels');

                        cy.get(`.${componentClass} .tabpanels__nav-previous`)
                            .as('tabpanelNavPrevious');

                        cy.get(`.${componentClass} .tabpanels__nav-next`)
                            .as('tabpanelNavNext');
                    });

                    it('Elements exist', function () {
                        cy.get('@tabbedCarousel').should('exist');
                        cy.get('@tabs').should('exist');
                        cy.get('@tabImages').should('exist');
                        cy.get('@tablist').should('exist');
                        cy.get('@tabpanels').should('exist');
                        cy.get('@tabpanelNavPrevious').should('exist');
                        cy.get('@tabpanelNavNext').should('exist');
                    });
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

                        context('Tabs', function () {
                            context('Terms', function () {
                                it('Tabs', function () {
                                    cy.log('Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel, most commonly the top edge.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanels');
                                });

                                it('Tabs or Tabbed Interface', function () {
                                    cy.log('A set of tab elements and their associated tab panels.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanels');

                                    cy.get('@tabbedCarousel').within(() => {
                                        cy.get('@tabs').should('exist');
                                        cy.get('@tabpanels').should('exist');
                                    });
                                });

                                it('Tab List', function () {
                                    cy.log('A set of tab elements contained in a tablist element.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanels');

                                    cy.get('@tablist').within(() => {
                                        cy.get('@tabs').should('exist');
                                    });
                                });

                                context('tab', function () {
                                    it('An element in the tab list that serves as a label for one of the tab panels and can be activated to display that panel.', function () {
                                        cy.get('@tabpanels').each(($tabPanel, i) => {
                                            cy.get('@tabs').eq(i).then(($tab) => {
                                                cy.wrap($tabPanel)
                                                    .should('have.attr', 'aria-labelledby', `${$tab.attr('id')}`);

                                                cy.wrap($tab)
                                                    .should('have.attr', 'role', 'tab')
                                                    .should('have.attr', 'aria-controls', $tabPanel.attr('id'));
                                            });

                                            cy.get('@tabImages').eq(i)
                                                .should('have.attr', 'alt', `Photo ${i + 1}`);
                                        });
                                    });
                                });

                                it('tabpanels', function () {
                                    cy.log('The element that contains the content associated with a tab.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#tabpanels');

                                    cy.get('@tabpanels').should('have.attr', 'role', 'tabpanel');
                                });
                            });

                            context('Examples', function () {
                                it('Tabs with Automatic Activation', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html');
                                });

                                it('Tabs with Manual Activation', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html');
                                });
                            });

                            context('+ Default selection', function () {
                                it('On init, the initial selection is selected', function () {
                                    if (cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr)) {
                                        cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr, 'index').then(($index) => {
                                            cy.get('@tabs').eq($index)
                                                .should('have.attr', 'aria-selected', 'true');
                                        });
                                    }
                                });
                            });

                            context('Keyboard Interaction', function () {
                                context('For the tab list', function () {
                                    context('Tab', function () {
                                        it('When focus moves into the tab list, places focus on the active tab element.', function () {
                                            cy.get('@testAnchor')
                                                .tab();

                                            if (cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr)) {
                                                cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr, 'index').then(($index) => {
                                                    cy.get('@tabs').eq($index)
                                                        .should('have.focus');
                                                });
                                            } else {
                                                cy.get('@tabs').eq(0)
                                                    .should('have.focus');
                                            }
                                        });

                                        it('When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is typically either the first focusable element inside the tab panel or the tab panel itself.', function () {
                                            cy.get('@testAnchor')
                                                .tab().tab();

                                            if (cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr)) {
                                                cy.getAttr(`#${testId} .${componentClass}`, initialSelectionAttr, 'index').then(($index) => {
                                                    cy.get('@tabpanels').eq($index)
                                                        .should('have.focus');
                                                });
                                            } else {
                                                cy.get('@tabpanels').eq(0)
                                                    .should('have.focus');
                                            }
                                        });

                                        it('+ When the tab panel has the focus, moves focus to the first tab panel navigation button', function () {
                                            cy.log('Nav moved after slide in order to have the active slide adjacent to the active tab in the tab sequence. This is in contrast with the WAI-ARIA Carousel example, which doesn\'t have tab navigation');

                                            cy.get('@testAnchor')
                                                .tab().tab().tab();

                                            cy.get('@tabpanelNavPrevious')
                                                .should('have.focus');
                                        });

                                        it('+ When the first tab panel navigation button has the focus, moves focus to the next tab panel navigation button', function () {
                                            cy.log('Nav moved after slide in order to have the active slide adjacent to the active tab in the tab sequence. This is in contrast with the WAI-ARIA Carousel example, which doesn\'t have tab navigation');

                                            cy.get('@testAnchor')
                                                .tab().tab().tab()
                                                .tab();

                                            cy.get('@tabpanelNavNext')
                                                .should('have.focus');
                                        });
                                    });

                                    context('When focus is on a tab element in a horizontal tab list:', function () {
                                        context('Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab. Optionally, activates the newly focused tab. If the tabs in a tab list are arranged vertically: Up Arrow performs as Left Arrow is described above.', function () {
                                            [ '{leftarrow}', '{uparrow}' ].forEach(($key) => {
                                                it($key, function () {
                                                    cy.log('Tabs are not oriented exclusively horizonally or vertically, therefore both keys are supported');

                                                    cy.get('@tabs').first()
                                                        .click() // focus and select
                                                        .type($key);

                                                    cy.get('@tabs').last()
                                                        .should('have.focus');

                                                    cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                                        if ($value === 'true') {
                                                            cy.get('@tabs').last()
                                                                .should('have.attr', 'aria-selected', 'true');
                                                        } else {
                                                            cy.get('@tabs').last()
                                                                .should('have.attr', 'aria-selected', 'false');
                                                        }
                                                    });
                                                });
                                            });
                                        });

                                        context('Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab. Optionally, activates the newly focused tab. If the tabs in a tab list are arranged vertically: Down Arrow performs as Right Arrow is described above.', function () {
                                            [ '{rightarrow}', '{downarrow}' ].forEach(($key) => {
                                                it($key, function () {
                                                    cy.log('Tabs are not oriented exclusively horizonally or vertically, therefore both keys are supported');

                                                    cy.get('@tabs').last()
                                                        .click() // focus and select
                                                        .type($key);

                                                    cy.get('@tabs').first()
                                                        .should('have.focus');

                                                    cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                                        if ($value === 'true') {
                                                            cy.get('@tabs').first()
                                                                .should('have.attr', 'aria-selected', 'true');
                                                        } else {
                                                            cy.get('@tabs').first()
                                                                .should('have.attr', 'aria-selected', 'false');
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });

                                    context('When focus is on a tab in a tablist with either horizontal or vertical orientation:', function () {
                                        context('Space or Enter: Activates the tab if it was not activated automatically on focus.', function () {
                                            [ ' ', '{enter}' ].forEach(($key) => {
                                                it($key, function () {
                                                    cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                                        if ($value !== 'true') {
                                                            cy.get('@tabs').each(($tab) => {
                                                                cy.wrap($tab)
                                                                    .focus();

                                                                if ($tab.attr('aria-selected') === 'false') {
                                                                    cy.wrap($tab)
                                                                        .type($key)
                                                                        .should('have.attr', 'aria-selected', 'true');
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                        });

                                        it('Home (Optional): Moves focus to the first tab. Optionally, activates the newly focused tab.', function () {
                                            cy.get('@tabs').last()
                                                .click() // focus and select
                                                .type('{home}');

                                            cy.get('@tabs').first()
                                                .should('have.focus');

                                            cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                                if ($value === 'true') {
                                                    cy.get('@tabs').first()
                                                        .should('have.attr', 'aria-selected', 'true');
                                                } else {
                                                    cy.get('@tabs').first()
                                                        .should('have.attr', 'aria-selected', 'false');
                                                }
                                            });
                                        });

                                        it('End (Optional): Moves focus to the last tab. Optionally, activates the newly focused tab.', function () {
                                            cy.get('@tabs').first()
                                                .click() // focus and select
                                                .type('{end}');

                                            cy.get('@tabs').last()
                                                .should('have.focus');

                                            cy.getAttr(`#${testId} .${componentClass}`, selectionFollowsFocusAttr).then(($value) => {
                                                if ($value === 'true') {
                                                    cy.get('@tabs').last()
                                                        .should('have.attr', 'aria-selected', 'true');
                                                } else {
                                                    cy.get('@tabs').last()
                                                        .should('have.attr', 'aria-selected', 'false');
                                                }
                                            });
                                        });

                                        it.skip('N/A - Shift + F10: If the tab has an associated pop-up menu, opens the menu');

                                        it.skip('N/A - Delete (Optional): If deletion is allowed, deletes (closes) the current tab element and its associated tab panel, sets focus on the tab following the tab that was closed, and optionally activates the newly focused tab. If there is not a tab that followed the tab that was deleted, e.g., the deleted tab was the right-most tab in a left-to-right horizontal tab list, sets focus on and optionally activates the tab that preceded the deleted tab. If the application allows all tabs to be deleted, and the user deletes the last remaining tab in the tab list, the application moves focus to another element that provides a logical work flow. As an alternative to Delete, or in addition to supporting Delete, the delete function is available in a context menu.');
                                    });
                                });
                            });

                            context('WAI-ARIA Roles, States, and Properties', function () {
                                it('The element that serves as the container for the set of tabs has role tablist.', function () {
                                    cy.get('@tabs').parent()
                                        .should('have.attr', 'role', 'tablist');
                                });

                                it('Each element that serves as a tab has role tab and is contained within the element with role tablist.', function () {
                                    cy.get('@tabs').each(($tab) => {
                                        cy.wrap($tab)
                                            .should('have.attr', 'role', 'tab')
                                            .parents('[role="tablist"]')
                                            .should('exist');
                                    });
                                });

                                it('Each element that contains the content panel for a tab has role tabpanel.', function () {
                                    cy.get('@tabpanels').each(($tabPanel, i) => {
                                        cy.get('@tabs').eq(i)
                                            .should('have.attr', 'aria-controls', $tabPanel.attr('id'));

                                        cy.wrap($tabPanel)
                                            .should('have.attr', 'role', 'tabpanel');
                                    });
                                });

                                it('If the tab list has a visible label, the element with role tablist has aria-labelledby set to a value that refers to the labelling element. Otherwise, the tablist element has a label provided by aria-label.', function () {
                                    cy.get('@tablist')
                                        .should('have.attr', 'aria-label');

                                    cy.log('Requires manual verification that label is either visible, appropriate and linked, or invisible and appropriate.');
                                });

                                it('Each element with role tab has the property aria-controls referring to its associated tabpanel element.', function () {
                                    cy.get('@tabpanels').each(($tabPanel, i) => {
                                        cy.get('@tabs').eq(i)
                                            .should('have.attr', 'role', 'tab')
                                            .should('have.attr', 'aria-controls', $tabPanel.attr('id'))
                                            .then(($tab) => {
                                                cy.wrap($tabPanel)
                                                    .should('have.attr', 'aria-labelledby', $tab.attr('id'));
                                            });
                                    });
                                });

                                it('The active tab element has the state aria-selected set to true and all other tab elements have it set to false.', function () {
                                    cy.get('@tabpanels').filter(':not([hidden])').then(($tabPanel) => {
                                        cy.get('@tabs').filter('[aria-selected="true"]')
                                            .should('have.length', 1)
                                            .should('have.attr', 'aria-controls', $tabPanel.attr('id'));
                                    });

                                    cy.get('@tabpanels').then(($tabPanels) => {
                                        cy.get('@tabs').filter('[aria-selected="false"]')
                                            .should('have.length', $tabPanels.length - 1);
                                    });
                                });

                                it('Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.', function () {
                                    cy.get('@tabs').each(($tab, i) => {
                                        cy.get('@tabpanels').eq(i)
                                            .should('have.attr', 'aria-labelledby', $tab.attr('id'));
                                    });
                                });

                                it.skip('N/A - If a tab element has a pop-up menu, it has the property aria-haspopup set to either menu or true.');

                                it.skip('TODO - If the tablist element is vertically oriented, it has the property aria-orientation set to vertical. The default value of aria-orientation for a tablist element is horizontal.');
                            });
                        });

                        context('Carousel', function () {
                            context('Features needed to provide sufficient rotation control', function () {
                                it('Buttons for displaying the previous and next slides.', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');

                                    cy.get('@tabpanelNavPrevious').should('exist');
                                    cy.get('@tabpanelNavNext').should('exist');
                                });

                                it('Optionally, a control, or group of controls, for choosing a specific slide to display. For example, slide picker controls can be marked up as tabs in a tablist with the slide represented by a tabpanels element.', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');

                                    cy.get('@tablist').within(() => {
                                        cy.get('@tabs').should('exist');
                                    });
                                });

                                context.skip('N/A - If the carousel can automatically rotate, it also:', function () {
                                    it.skip('N/A - Has a button for stopping and restarting rotation. This is particularly important for supporting assistive technologies operating in a mode that does not move either keyboard focus or the mouse.');

                                    it.skip('N/A - Stops rotating when keyboard focus enters the carousel. It does not restart unless the user explicitly requests it to do so.');

                                    it.skip('N/A - Stops rotating whenever the mouse is hovering over the carousel.');
                                });
                            });

                            context('Terms', function () {
                                it('Slide', function () {
                                    cy.log('A single content container within a set of content containers that hold the content to be presented by the carousel.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');
                                });

                                it.skip('N/A - Rotation Control', function () {
                                    cy.log('An interactive element that stops and starts automatic slide rotation.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');
                                });

                                it('Next Slide Control', function () {
                                    cy.log('An interactive element, often styled as an arrow, that displays the next slide in the rotation sequence.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');
                                });

                                it('Previous Slide Control', function () {
                                    cy.log('An interactive element, often styled as an arrow, that displays the previous slide in the rotation sequence.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');
                                });

                                it('Slide Picker Controls', function () {
                                    cy.log('A group of elements, often styled as small dots, that enable the user to pick a specific slide in the rotation sequence to display.');
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/#carousel');
                                });
                            });

                            context('Examples', function () {
                                it.skip('N/A - Auto-Rotating Image Carousel Example', function () {
                                    cy.log('https://www.w3.org/TR/wai-aria-practices/examples/carousel/carousel-1.html');
                                });
                            });

                            context('Keyboard Interaction', function () {
                                it.skip('N/A - If the carousel has an auto-rotate feature, automatic slide rotation stops when any element in the carousel receives keyboard focus. It does not resume unless the user activates the rotation control.');

                                it('Tab and Shift + Tab: Move focus through the interactive elements of the carousel as specified by the page tab sequence - scripting for Tab is not necessary.', function () {
                                    //
                                });

                                it('Button elements implement the keyboard interaction defined in the button pattern. Note: Activating the rotation control, next slide, and previous slide do not move focus, so users may easily repetitively activate them as many times as desired.', function () {
                                    //
                                });

                                it.skip('N/A - If present, the rotation control is the first element in the Tab sequence inside the carousel. It is essential that it precede the rotating content so it can be easily located.');

                                it('If tab elements are used for slide picker controls, they implement the keyboard interaction defined in the Tabs Pattern.', function () {
                                    //
                                });
                            });

                            context('WAI-ARIA Roles, States, and Properties', function () {
                                context('This section describes the element composition for three styles of carousels:', function () {
                                    it.skip('N/A - Basic: Has rotation, previous slide, and next slide controls but no slide picker controls.');

                                    it('Tabbed: Has basic controls plus a single tab stop for slide picker controls implemented using the tabs pattern.');

                                    it.skip('N/A - Grouped: Has basic controls plus a series of tab stops in a group of slide picker controls where each control implements the button pattern. Because each slide selector button adds an element to the page tab sequence, this style is the least friendly for keyboard users.');
                                });

                                context('Tabbed Carousel Elements', function () {
                                    context('The structure of a tabbed carousel is the same as a basic carousel except that:', function () {
                                        it('Each slide container has role tabpanels in lieu of group, and it does not have the aria-roledescription property {applied to Basic carousel elements}.', function () {
                                            cy.log('https://www.w3.org/TR/wai-aria-practices/#tabbed-carousel-elements');

                                            cy.get('@tabpanels').should('have.attr', 'role', 'tabpanel');
                                            cy.get('@tabpanels').should('not.have.attr', 'role', 'group');
                                            cy.get('@tabpanels').should('not.have.attr', 'aria-roledescription');
                                        });

                                        context('It has slide picker controls implemented using the tabs pattern where', function () {
                                            it('Each control is a tab element, so activating a tab displays the slide associated with that tab.', function () {
                                                //
                                            });

                                            it('The accessible name of each tab indicates which slide it will display by including the name or number of the slide, e.g., "Slide 3". Slide names are preferable if each slide has a unique name.', function () {
                                                //
                                            });

                                            it('The set of controls is grouped in a tablist element with an accessible name provided by the value of aria-label that identifies the purpose of the tabs, e.g., "Choose slide to display."', function () {
                                                //
                                            });

                                            it('The tab, tablist, and tabpanel implement the properties specified in the tabs pattern.', function () {
                                                //
                                            });
                                        });
                                    });
                                });
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
            });
        });
    });
});
