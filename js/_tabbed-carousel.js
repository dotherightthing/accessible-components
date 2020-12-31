/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* globals KeyboardHelpers */

/**
 * @class TabbedCarousel
 * @summary Class used to store local state and make DOM calls relative to a particular element.
 *
 * @param {object} options                              - Module options
 * @param {null|number} options.initialSelection        - Tab to select on init
 * @param {null|Node} options.instanceElement           - The outermost DOM element
 * @param {null|Function} options.onTabSelect           - Callback with an argument of selectedTabPanel, called after a tab is selected
 * @param {boolean} options.selectionFollowsFocus       - Select the focussed tab, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 */
class TabbedCarousel {
    constructor(options = {
        initialSelection: null,
        instanceElement: null,
        selectionFollowsFocus: false,
        onTabSelect: () => { }
    }) {
        // public options
        this.initialSelection = options.initialSelection;
        this.instanceElement = options.instanceElement;
        this.selectionFollowsFocus = options.selectionFollowsFocus;

        if (options.onTabSelect instanceof Function) {
            this.onTabSelect = options.onTabSelect;
        }

        // private options
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.
        this.attributes = {
            selected: [ 'aria-selected', 'true' ],
            unselected: [ 'aria-selected', 'false' ],
            tab: [ 'role', 'tab' ],
            tablist: [ 'role', 'tablist' ],
            tabpanel: [ 'role', 'tabpanel' ]
        };

        this.selectors = {
            selected: '[aria-selected="true"]',
            unselected: '[aria-selected="false"]',
            tab: '[role="tab"]',
            tablist: '[role="tablist"]',
            tabpanel: '[role="tabpanel"]',
            tabpanelExpandButton: '[data-tabbed-content-nav-expand]',
            tabpanelsNavNext: '[data-tabbed-content-nav-next]',
            tabpanelsNavPrevious: '[data-tabbed-content-nav-previous]'
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

            this.instanceElement.setAttribute('id', `tabbedcarousel-${randomNumber()}-${randomNumber()}`);
        }

        this.instanceId = this.instanceElement.getAttribute('id');
    }

    /**
     * @function onClickExpand
     * @memberof TabbedCarousel
     *
     * @param {*} e - target of click event
     */
    onClickExpand(e) {
        const expandButton = e.target;
        const targetIds = expandButton.getAttribute('aria-controls').split(' ');

        if (expandButton.getAttribute('aria-expanded') === 'false') {
            expandButton.setAttribute('aria-expanded', 'true');
            targetIds.forEach((targetId) => {
                document.getElementById(targetId).classList.remove('tabbed-carousel__tabpanel-img-wrap--collapsed');
            });
        } else {
            expandButton.setAttribute('aria-expanded', 'false');
            targetIds.forEach((targetId) => {
                document.getElementById(targetId).classList.add('tabbed-carousel__tabpanel-img-wrap--collapsed');
            });
        }
    }

    /**
     * @function selectInitialSelection
     * @summary Select the tab which should be active on init
     * @memberof TabbedCarousel
     *
     * @param {Node} tab - Tab elements
     */
    selectInitialSelection(tab) {
        if (this.initialSelection) {
            const n = parseInt(this.initialSelection, 10);
            const defaultEl = tab[n - 1]; // zero index
            defaultEl.focus();
            defaultEl.click();
        }
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

        const disabledButtons = document.querySelectorAll(`#${this.instanceId} button[disabled]`);
        const tabs = document.querySelectorAll(`#${this.instanceId} ${this.selectors.tab}`);
        const tablist = document.querySelector(`#${this.instanceId} ${this.selectors.tablist}`);
        const tabpanels = document.querySelectorAll(`#${this.instanceId} ${this.selectors.tabpanel}`);
        const tabpanelExpandButtons = document.querySelectorAll(`#${this.instanceId} ${this.selectors.tabpanelExpandButton}`);
        const self = this;

        disabledButtons.forEach((disabledButton) => {
            disabledButton.disabled = false;
        });

        if (tabs.length) {
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
                    focusNext: [ 'ArrowRight', 'ArrowDown' ],

                    // Left Arrow: moves focus to the previous tab.
                    // See also infiniteNavigation
                    // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                    focusPrevious: [ 'ArrowLeft', 'ArrowUp' ],

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
                keyboardNavigableElements: tabs,

                onSelect: (element) => {
                    const tab = element;
                    const tabPanelId = tab.getAttribute('aria-controls');
                    const selectedTabPanel = document.getElementById(tabPanelId);

                    tabpanels.forEach((tabpanel) => {
                        tabpanel.setAttribute('hidden', true);
                    });

                    selectedTabPanel.removeAttribute('hidden');

                    self.onTabSelect.call(self, selectedTabPanel);
                },

                selectedAttr: this.attributes.selected,

                // It is recommended that tabs activate automatically when they receive focus
                // as long as their associated tab panels are displayed without noticeable latency.
                // This typically requires tab panel content to be preloaded.
                // See: https://www.w3.org/TR/wai-aria-practices/#tabpanel
                selectionFollowsFocus: this.selectionFollowsFocus,

                unselectedAttr: this.attributes.unselected,

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

            tabpanelExpandButtons.forEach((tabpanelExpandButton) => {
                tabpanelExpandButton.addEventListener('click', this.onClickExpand.bind(this));
            });

            this.selectInitialSelection(tabs);
        }
    }
}
