/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

/**
 * @class KeyboardHelpers
 *
 * @param {object}          options                         - Module options
 * @param {null|Node}       options.componentElement        - The outermost DOM element, used to apply keydown listener
 * @param {boolean}         options.infiniteNavigation      - Whether to loop the focus to the first/last navigableElement when the focus is out of range
 * @param {object}          options.keyboardActions         - The key(s) which trigger actions
 * @param {null|NodeList}   options.navigableElements       - The DOM element(s) which will become keyboard navigable
 * @param {Array}           options.selectedAttr            - Property and Value applied to the selected navigableElement
 * @param {boolean}         options.selectionFollowsFocus   - Automatically select the focussed option (<https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>)
 * @param {object}          options.toggleActions           - The key(s) which toggle the parent state
 * @param {null|Node}       options.toggleElement           - The DOM element which toggles the parent state
 * @param {boolean}         options.toggleAfterSelected     - Whether to trigger the toggle action after a navigableElement is selected
 * @param {boolean}         options.useRovingTabIndex       - Whether to apply a tabindex of 0 (tabstop) rather than -1 (programmatic focus) to the focussed item
 */
class KeyboardHelpers {
    constructor(options = {}) {
        // public options
        this.componentElement = options.componentElement || null;
        this.infiniteNavigation = options.infiniteNavigation || false;
        this.keyboardActions = options.keyboardActions || {};
        this.navigableElements = options.navigableElements || null;
        this.selectedAttr = options.selectedAttr || [];
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        this.toggleActions = options.toggleActions || {};
        this.toggleElement = options.toggleElement || null;
        this.toggleAfterSelected = options.toggleAfterSelected || false;
        this.useRovingTabIndex = options.useRovingTabIndex || false;
    }

    /**
     * @function focusFirst
     * @summary Move the focus to the first option
     * @memberof KeyboardHelpers
     */
    focusFirst() {
        const firstIndex = 0;

        // make the first one focussable
        this.updateRovingTabIndex(firstIndex);

        // focus the first one
        this.navigableElements[firstIndex].focus();
    }

    /**
     * @function focusLast
     * @summary Move the focus to the last option
     * @memberof KeyboardHelpers
     */
    focusLast() {
        const lastIndex = this.navigableElements.length - 1;

        // make the last one focussable
        this.updateRovingTabIndex(lastIndex);

        // focus the last one
        this.navigableElements[lastIndex].focus();
    }

    /**
     * @function focusNext
     * @summary Move the focus to the next option, if one exists
     * @description When focus is on a tab element in a horizontal tab list:
     * @memberof KeyboardHelpers
     */
    focusNext() {
        const focussed = document.activeElement;
        const nextOption = focussed.nextElementSibling;

        if (nextOption) {
            let nextOptionIndex = this.getIndexOfNavigableElement(nextOption);

            // make the next one focussable
            this.updateRovingTabIndex(nextOptionIndex);

            // focus the next one
            nextOption.focus();
        } else if (this.infiniteNavigation) {
            this.focusFirst();
        }
    }

    /**
     * @function focusPrevious
     * @summary Move the focus to the previous option, if one exists
     * @memberof KeyboardHelpers
     */
    focusPrevious() {
        const focussed = document.activeElement;
        const previousOption = focussed.previousElementSibling;

        if (previousOption) {
            let previousOptionIndex = this.getIndexOfNavigableElement(previousOption);

            // make the previous one focussable
            this.updateRovingTabIndex(previousOptionIndex);

            // focus the previous one
            previousOption.focus();
        } else if (this.infiniteNavigation) {
            this.focusLast();
        }
    }

    /**
     * @function getIndexOfNavigableElement
     * @summary Get the array index of the navigableElementToFind, relative to the array of DOM elements
     * @memberof KeyboardHelpers
     *
     * @param {Element} navigableElementToFind - Navigable element to get the index of
     * @returns {number} navigableElementIndex
     */
    getIndexOfNavigableElement(navigableElementToFind) {
        let navigableElementIndex = -1;

        this.navigableElements.forEach((navigableElement, index) => {
            if (navigableElement === navigableElementToFind) {
                navigableElementIndex = index;
            }
        });

        return navigableElementIndex;
    }

    /**
     * @function isComponentElement
     * @summary Determine whether the element is the componentElement
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isComponentElement
     */
    isComponentElement(element) {
        return (this.componentElement === element);
    }

    /**
     * @function isNavigableElement
     * @summary Determine whether the element is one of our navigableElements
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isNavigableElement
     */
    isNavigableElement(element) {
        let isNavigableElement = false;

        this.navigableElements.forEach((navigableElement) => {
            // if the focussed element is one of the navigableElements
            if (navigableElement === element) {
                isNavigableElement = true;
            }
        });

        return isNavigableElement;
    }

    /**
     * @function isToggleElement
     * @summary Determine whether the element is the toggleElement
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isToggleElement
     */
    isToggleElement(element) {
        return (this.toggleElement === element);
    }

    /**
     * @function normaliseKey
     * @summary Convert IE/Edge keys to match modern browsers
     * @memberof KeyboardHelpers
     *
     * @param {string} keyPressed - keypress event (e.key)
     * @returns {string} key - normalised key
     *
     * @see https://keycode.info/
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
     */
    normaliseKey(keyPressed) {
        let key = keyPressed;

        // Home - macOS is Fn + ArrowLeft
        // End - macOS is Fn + ArrowRight

        if (keyPressed === 'Down') {
            key = 'ArrowDown';
        } else if (keyPressed === 'Up') {
            key = 'ArrowUp';
        } else if (keyPressed === 'Left') {
            key = 'ArrowLeft';
        } else if (keyPressed === 'Right') {
            key = 'ArrowRight';
        } else if (keyPressed === 'Spacebar') {
            key = ' ';
        } else if (keyPressed === 'Esc') {
            key = 'Escape';
        }

        return key;
    }

    /**
     * @function onKeyDown
     * @memberof KeyboardHelpers
     *
     * @param {*} e - target of keydown event
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
     * @see https://stackoverflow.com/questions/24386354/execute-js-code-after-pressing-the-spacebar
     * @todo Ignore Shift+Tab
     */
    onKeyDown(e) {
        const keyPressed = this.normaliseKey(e.key);

        // separate action objects allow keys to have different functions in different contexts
        const keyboardActions = Object.keys(this.keyboardActions);
        const toggleActions = Object.keys(this.toggleActions);

        if (this.isNavigableElement(e.target)) {
            keyboardActions.forEach((keyboardAction) => {
                // if the pressed key is in the keyboardActions array
                if (this.keyboardActions[keyboardAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice
                    this[keyboardAction].call(this, e);
                }
            });
        } else if (this.isComponentElement(e.target)) { // toggleElement already natively supports ENTER
            toggleActions.forEach((toggleAction) => {
                // if the pressed key is in the keyboardActions array
                if (this.toggleActions[toggleAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice
                    this[toggleAction].call(this, e);
                }
            });
        }
    }

    /**
     * @function onNavigableElementFocus
     * @summary React when a navigableElement is focussed
     * @memberof KeyboardHelpers
     */
    onNavigableElementFocus() {
        if (this.selectionFollowsFocus) {
            this.selectFocussed();
        }
    }

    /**
     * @function selectFocussed
     * @summary Selection either follows focus, or the user changes which element is selected by pressing the Enter or Space key.
     * @memberof KeyboardHelpers
     *
     * @param {object|undefined} e - Keydown event
     */
    selectFocussed(e) {
        const focussed = document.activeElement;

        if (this.isNavigableElement(focussed)) {
            const selectedAttrProp = this.selectedAttr[0];
            const selectedAttrVal = this.selectedAttr[1];

            this.navigableElements.forEach((element2) => {
                element2.removeAttribute(selectedAttrProp);
            });

            focussed.setAttribute(selectedAttrProp, selectedAttrVal);

            if (typeof e === 'object') {
                if (this.toggleAfterSelected) {
                    this.toggleClosed();
                }
            }
        }
    }

    /**
     * @function toggle
     * @summary Toggle something by triggering a click on the toggleElement
     * @memberof KeyboardHelpers
     */
    toggle() {
        this.toggleElement.focus();
        this.toggleElement.click();
    }

    /**
     * @function toggleClosed
     * @summary Toggle something by triggering a click on the toggleElement
     * @memberof KeyboardHelpers
     *
     * @description This is a duplicate of toggle, which allows the Escape key to be excluded from toggle
     */
    toggleClosed() {
        this.toggleElement.focus();
        this.toggleElement.click();
    }

    /**
     * @function updateRovingTabIndex
     * @summary Remove all but active tab from the tab sequence.
     * @memberof TabbedCarousel
     *
     * @see {@link https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex}
     * @param {number} index - Index of navigableElement to which to apply tabindex="0"
     */
    updateRovingTabIndex(index) {
        if (this.useRovingTabIndex) {
            this.navigableElements.forEach((navigableElement, navigableElementIndex) => {
                if (navigableElementIndex === index) {
                    navigableElement.setAttribute('tabindex', '0');
                } else {
                    navigableElement.setAttribute('tabindex', '-1');
                }
            });
        }
    }

    /**
     * @function init
     * @memberof KeyboardHelpers
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        if (this.navigableElements.length) {
            // TODO event delegation
            this.navigableElements.forEach((element) => {
                element.addEventListener('keydown', this.onKeyDown.bind(this));

                // focus occurs on the focussed element only
                element.addEventListener('focus', this.onNavigableElementFocus.bind(this));
            });
        }

        if (this.componentElement !== null) {
            this.componentElement.addEventListener('keydown', this.onKeyDown.bind(this));
        }
    }
}

/**
 * @class Label
 */
class Label {
    /**
     * @function onClickLabel
     * @memberof Label
     *
     * @param {*} e - target of focus event
     */
    onClickLabel(e) {
        const label = e.target;
        const labelForId = label.getAttribute('data-for');
        const labelFor = document.getElementById(labelForId);

        labelFor.focus();
    }

    /**
     * @function init
     * @memberof Label
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        const labels = document.querySelectorAll('.label[data-for]');

        labels.forEach((label) => {
            label.addEventListener('click', this.onClickLabel.bind(this));
        });
    }
}

/**
 * @class SingleSelect
 *
 * @param {object} options                          - Module options
 * @param {boolean} options.selectionFollowsFocus   - Select the focussed option (<https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>)
 *
 * @todo {boolean} options.autoSelectFirstOption    - Select the first option in the listbox
 * @todo {boolean} options.typeaheadSingleCharacter - Focus moves to the next item with a name that starts with the typed character
 * @todo {boolean} options.typeaheadMultiCharacter  - Focus moves to the next item with a name that starts with the string of characters typed
 */
class SingleSelect {
    constructor(options = {}) {
        // public options
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        // this.autoSelectFirstOption = options.autoSelectFirstOption || false;
        // this.typeaheadSingleCharacter = options.typeaheadSingleCharacter || false;
        // this.typeaheadMultiCharacter = options.typeaheadMultiCharacter || false;

        // private options
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.
        this.attributes = {
            button: [ 'aria-haspopup', 'listbox' ],
            listbox: [ 'role', 'listbox' ],
            listboxHidden: [ 'hidden', true ],
            option: [ 'role', 'option' ],
            selected: [ 'aria-selected', 'true' ]
        };

        this.selectors = {
            button: '[aria-haspopup="listbox"]',
            listbox: '[role="listbox"]',
            option: '[role="option"]',
            selected: '[aria-selected="true"]'
        };
    }

    /**
     * @function focusOption
     * @memberof SingleSelect
     *
     * @param {*} e - target of focus event
     */
    focusOption(e) {
        const listbox = e.target;

        // :scope - only match selectors on descendants of the base element:
        const options = listbox.querySelectorAll(`:scope ${this.selectors.option}`);
        const selectedOptions = listbox.querySelectorAll(`:scope ${this.selectors.selected}`);

        if (selectedOptions.length) {
            // focus the first selected option
            selectedOptions[0].focus();
        } else {
            // focus the first option
            options[0].focus();

            // TODO if this.autoSelectFirstOption {}
        }
    }

    /**
     * @function getListbox
     * @memberof SingleSelect
     *
     * @param {Node} childElement - Listbox child element
     * @returns {Node} element - Listbox
     */
    getListbox(childElement) {
        let i = 0;
        let limit = 10; // for debugging
        let listbox;

        if (this.isButton(childElement)) {
            const wrapper = childElement.parentElement;
            listbox = wrapper.querySelector(`:scope ${this.selectors.listbox}`);
        } else {
            listbox = childElement;
        }

        while (!this.isListbox(listbox) && (i < limit)) {
            // parentElement goes all the way up to the document which doesn't support getAttribute
            if (listbox.parentElement) {
                listbox = listbox.parentElement;
            }

            i += 1;
        }

        if (!this.isListbox(listbox)) {
            listbox = null;
        }

        return listbox;
    }

    /**
     * @function isButton
     * @summary Test whether an element is a button.
     * @memberof SingleSelect
     *
     * @param {*} element - DOM Element
     * @returns {boolean} - True if a match else false
     */
    isButton(element) {
        return (element.getAttribute(this.attributes.button[0]) === this.attributes.button[1]);
    }

    /**
     * @function isListbox
     * @summary Test whether an element is a listbox.
     * @memberof SingleSelect
     *
     * @param {*} element - DOM Element
     * @returns {boolean} - True if a match else false
     */
    isListbox(element) {
        return (element.getAttribute(this.attributes.listbox[0]) === this.attributes.listbox[1]);
    }

    /**
     * @function propagateSelection
     * @summary When KeyboardHelpers makes a selection, update the UI to match
     * @memberof SingleSelect
     *
     * @param {Node} target - Target to watch for changes
     */
    propagateSelection(target) {
        // Options for the observer (which mutations to observe)
        const observerConfig = {
            attributes: true,
            childList: false,
            subtree: true
        };

        const _self = this;
        const selectedAttrProp = this.attributes.selected[0];
        const selectedAttrVal = this.attributes.selected[1];

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList) {
            mutationsList.forEach(function (mutation) { // eslint-disable-line func-names
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === selectedAttrProp) {
                        // if an option was just selected
                        if (mutation.target.getAttribute(selectedAttrProp) === selectedAttrVal) {
                            let option = mutation.target;
                            let listbox = _self.getListbox(option);

                            if (listbox !== null) {
                                if (listbox.parentElement) {
                                    let wrapper = listbox.parentElement;
                                    let button = wrapper.querySelector(_self.selectors.button);

                                    _self.setButtonText(button, option.innerHTML);
                                }
                            }
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
     * @function setButtonText
     * @summary Change the text within the button which triggers the listbox.
     * @memberof SingleSelect
     *
     * @param {Node} button - Button
     * @param {string} text - Text
     */
    setButtonText(button, text) {
        button.innerHTML = text;
    }

    /**
     * @function toggleHidden
     * @summary Toggle the visibility listbox in the focussed select.
     * @memberof SingleSelect
     */
    toggleHidden() {
        const focussed = document.activeElement; // or could use e.target

        if (focussed) {
            let listbox = this.getListbox(focussed);

            if (listbox !== null) {
                if (listbox.parentElement) {
                    let wrapper = listbox.parentElement;
                    let button = wrapper.querySelector(this.selectors.button);

                    if (listbox.hasAttribute(this.attributes.listboxHidden[0])) {
                        listbox.removeAttribute(this.attributes.listboxHidden[0]);
                        listbox.focus();
                    } else {
                        listbox.setAttribute(this.attributes.listboxHidden[0], this.attributes.listboxHidden[1]);
                        button.focus();
                    }
                }
            }
        }
    }

    /**
     * @function init
     * @memberof SingleSelect
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        // .select wrapper allows button and listbox to be styled together
        const selects = document.querySelectorAll('.select');

        selects.forEach((select) => {
            const button = select.querySelector(`:scope ${this.selectors.button}`);
            const listbox = select.querySelector(`:scope ${this.selectors.listbox}:not([aria-multiselectable="true"])`);

            if (listbox) {
                const options = listbox.querySelectorAll(`:scope ${this.selectors.option}`);

                // TODO Cypress tests
                // TODO button requires 2x ENTER to show listbox
                // TODO create one instance for each select?

                const KeyboardHelpersConfig = {
                    componentElement: select, // TODO: should this be listbox as that is focussable?
                    keyboardActions: {
                        focusFirst: [ 'Home' ],
                        focusLast: [ 'End' ],
                        focusNext: [ 'ArrowDown' ],
                        focusPrevious: [ 'ArrowUp' ],
                        selectFocussed: [ 'Enter', ' ' ]
                    },
                    navigableElements: options,
                    selectedAttr: this.attributes.selected,
                    selectionFollowsFocus: this.selectionFollowsFocus,
                    toggleActions: {
                        toggle: [ 'ArrowUp', 'ArrowDown', 'Enter', ' ' ],
                        toggleClosed: [ 'Enter', ' ', 'Escape' ]
                    },
                    toggleElement: button,
                    toggleAfterSelected: true
                };

                const SingleSelectKeys = new KeyboardHelpers(KeyboardHelpersConfig);

                SingleSelectKeys.init();

                // keydown events bubble up from the element with click
                // so we can handle keyboard interactions for
                // button, listbox and option altogether
                select.addEventListener('click', this.toggleHidden.bind(this));

                // .addEventListener() sets the this pointer to the DOM element that caught the event
                // use .bind() to force the desired value of this
                // .bind() returns a new stub function that internally uses .apply() to set the this pointer as it was passed to .bind()
                listbox.addEventListener('focus', this.focusOption.bind(this));

                this.propagateSelection(listbox);
            }
        });
    }
}

/**
 * @class TabbedCarousel
 *
 * @param {object} options - Module options
 * @param {boolean} options.selectionFollowsFocus       - Select the focussed tab, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 *
 * @todo {boolean} options.autoSelectFirstOption        - Select the first tab in the tablist
 */
class TabbedCarousel {
    constructor(options = {}) {
        // public options
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
        // .select wrapper allows child elements to be styled together
        const tabbedCarousels = document.querySelectorAll('.tabbed-carousel');

        tabbedCarousels.forEach((tabbedCarousel) => {
            const tab = tabbedCarousel.querySelectorAll(`:scope ${this.selectors.tab}`);
            const tablist = tabbedCarousel.querySelector(`:scope ${this.selectors.tablist}`);
            const tabpanels = tabbedCarousel.querySelectorAll(`:scope ${this.selectors.tabpanel}`);

            if (tab.length) {
                // TODO Cypress tests

                const KeyboardHelpersConfig = {
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

                    navigableElements: tab,

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
        });
    }
}

document.onreadystatechange = () => {
    // The document has finished loading and the document has been parsed
    // but sub-resources such as images, stylesheets and frames are still loading.
    if (document.readyState === 'interactive') {
        const label = new Label();
        label.init();

        const singleSelect = new SingleSelect({
            selectionFollowsFocus: false
        });

        singleSelect.init();

        const tabbedCarousel = new TabbedCarousel({
            selectionFollowsFocus: true
        });

        tabbedCarousel.init();
    }
};
