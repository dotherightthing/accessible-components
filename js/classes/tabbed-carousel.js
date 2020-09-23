/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* globals KeyboardHelpers */

/**
 * @class TabbedCarousel
 * @summary Class used to store local state and make DOM calls relative to a particular element.
 *
 * @param {object} options                              - Module options
 * @param {null|Node} options.instanceElement           - The outermost DOM element
 * @param {boolean} options.selectionFollowsFocus       - Select the focussed tab, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 *
 * @todo {boolean} options.autoSelectFirstOption        - Select the first tab in the tablist
 */
class TabbedCarousel {
    constructor(options = {}) {
        // public options
        this.instanceElement = options.instanceElement || null;
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        // this.autoSelectFirstOption = options.autoSelectFirstOption || false;

        // private options
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.
        this.attributes = {
            selected: [ 'aria-selected', 'true' ],
            tab: [ 'role', 'tab' ],
            tablist: [ 'role', 'tablist' ],
            tabpanel: [ 'role', 'tabpanel' ]
        };

        this.selectors = {
            selected: '[aria-selected="true"]',
            tab: '[role="tab"]',
            tablist: '[role="tablist"]',
            tabpanel: '[role="tabpanel"]'
        };
    }

    /**
     * @function assignInstanceId
     * @summary Assign a unique ID to an instance to allow querying of descendant selectors sans :scope (Edge 79)
     * @memberof TabbedCarousel
     */
    assignInstanceId() {
        if (this.instanceElement.getAttribute('id') === null) {
            const randomNumber = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };

            this.instanceElement.setAttribute('id', `singleselectlistbox-${randomNumber()}-${randomNumber()}`);
        }

        this.instanceId = this.instanceElement.getAttribute('id');
    }

    /**
     * @function propagateSelection
     * @summary When KeyboardHelpers makes a selection, update the UI to match
     * @memberof TabbedCarousel
     *
     * @param {Node} target - Target to watch for changes
     * @param {Node} tabPanels - Affected tab panels
     */
    propagateSelection(target, tabPanels) {
        // Options for the observer (which mutations to observe)
        const observerConfig = {
            attributes: true,
            childList: false,
            subtree: true
        };

        // const _self = this;
        const selectedAttrProp = this.attributes.selected[0];
        const selectedAttrVal = this.attributes.selected[1];

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList) {
            mutationsList.forEach(function (mutation) { // eslint-disable-line func-names
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === selectedAttrProp) {
                        // if a tab was just selected
                        if (mutation.target.getAttribute(selectedAttrProp) === selectedAttrVal) {
                            const tab = mutation.target;
                            const tabPanelId = tab.getAttribute('aria-controls');
                            const selectedTabPanel = document.getElementById(tabPanelId);

                            tabPanels.forEach((tabPanel) => {
                                tabPanel.setAttribute('hidden', true);
                            });

                            selectedTabPanel.removeAttribute('hidden');
                        }
                    }
                }
            });
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(target, observerConfig);
    }

    /**
     * @function init
     * @memberof TabbedCarousel
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        this.assignInstanceId();

        const tab = document.querySelectorAll(`#${this.instanceId} ${this.selectors.tab}`);
        const tablist = document.querySelector(`#${this.instanceId} ${this.selectors.tablist}`);
        const tabpanels = document.querySelectorAll(`#${this.instanceId} ${this.selectors.tabpanel}`);

        if (tab.length) {
            // TODO Cypress tests

            const KeyboardHelpersConfig = {
                instanceElement: this.instanceElement,

                // If focus is on the first tab, moves focus to the last tab.
                // If focus is on the last tab element, moves focus to the first tab.
                // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                infiniteNavigation: true,

                keyboardActions: {
                    // Home (Optional): Moves focus to the first tab.
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    focusFirst: [ 'Home' ],

                    // End (Optional): Moves focus to the last tab
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    focusLast: [ 'End' ],

                    // Right Arrow: Moves focus to the next tab.
                    // See also infiniteNavigation
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    focusNext: [ 'ArrowRight' ],

                    // Left Arrow: moves focus to the previous tab.
                    // See also infiniteNavigation
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    focusPrevious: [ 'ArrowLeft' ],

                    // Space or Enter: Activates the tab if it was not activated automatically on focus.
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    selectFocussed: [ ' ', 'Enter' ]
                },

                // keyboard navigation selects the tab
                // focussing a tab via keyboard or mouse directly sets the active tabpanel
                // Q: what to call the relative selection controls (prev/next)
                // for listbox: keyboardNavigableElements are options, which indirectly set the button text, i.e. they are not controls
                // for tabbed carousel: keyboardNavigableElements are controls, which directly set the active tabpanel
                // both variations essentially allow the 'current value' to be set
                // this is then used to populate the button or select the associated panel
                // so they are value setters
                // an option is a value referenced by a name
                keyboardNavigableElements: tab,

                selectedAttr: this.attributes.selected,

                // It is recommended that tabs activate automatically when they receive focus
                // as long as their associated tab panels are displayed without noticeable latency.
                // This typically requires tab panel content to be preloaded.
                // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                selectionFollowsFocus: this.selectionFollowsFocus,

                // When using roving tabindex to manage focus in a composite UI component,
                // the element that is to be included in the tab sequence has tabindex of "0"
                // and all other focusable elements contained in the composite have tabindex of "-1".
                // One benefit of using roving tabindex rather than aria-activedescendant to manage focus
                // is that the user agent will scroll the newly focused element into view.
                // See: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
                useRovingTabIndex: true
            };

            const TabbedCarouselKeys = new KeyboardHelpers(KeyboardHelpersConfig);

            TabbedCarouselKeys.init();

            this.propagateSelection(tablist, tabpanels);
        }
    }
}