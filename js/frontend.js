/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

/**
 * @class KeyboardHelpers
 *
 * @param {object} options                              - Module options
 * @param {null|NodeList} options.navigationElements    - The child DOM element(s) which will become keyboard navigable
 * @param {object} options.navigationActions            - The key(s) to press to navigate
 * @param {null|Node} options.parentElement             - The parent DOM element
 * @param {Array} options.selectedAttribute             - Property and Value applied to the selected navigableElement
 * @param {boolean} options.selectionFollowsFocus       - Automatically select the focussed option, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 * @param {object} options.toggleActions                - The key(s) to press to toggle the parent state
 * @param {null|Node} options.toggleElement             - The DOM element which toggles the parent state
 * @param {boolean} options.toggleOnSelectFocussed      - Whether to trigger the toggle action when the element is selected
 * @param {boolean} options.useRovingTabIndex           - Whether to use tabindex="0" rather than tabindex="-1" for focussed iten
 */
class KeyboardHelpers {
    constructor(options = {}) {
        // public options
        this.navigationElements = options.navigationElements || null;
        this.navigationActions = options.navigationActions || {};
        this.parentElement = options.parentElement || null;
        this.selectedAttribute = options.selectedAttribute || [];
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        this.toggleActions = options.toggleActions || {};
        this.toggleElement = options.toggleElement || null;
        this.toggleOnSelectFocussed = options.toggleOnSelectFocussed || false;
        this.useRovingTabIndex = options.useRovingTabIndex || false;
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
        const navigationActions = Object.keys(this.navigationActions);
        const toggleActions = Object.keys(this.toggleActions);

        if (this.isNavigableElement(e.target)) {
            navigationActions.forEach((navigationAction) => {
                // if the pressed key is in the navigationAction's array
                if (this.navigationActions[navigationAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice
                    this[navigationAction].call(this, e);
                }
            });
        } else if (this.isParentElement(e.target)) { // toggleElement already natively supports ENTER
            toggleActions.forEach((toggleAction) => {
                // if the pressed key is in the navigationAction's array
                if (this.toggleActions[toggleAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice
                    this[toggleAction].call(this, e);
                }
            });
        }
    }

    /**
     * @function focusFirst
     * @summary Move the focus to the first option
     * @memberof KeyboardHelpers
     */
    focusFirst() {
        // make the first one focussable
        this.roveTabIndex(0);

        // focus the first one
        this.navigationElements[0].focus();
    }

    /**
     * @function focusLast
     * @summary Move the focus to the last option
     * @memberof KeyboardHelpers
     */
    focusLast() {
        const lastIndex = this.navigationElements.length - 1;

        // make the last one focussable
        this.roveTabIndex(lastIndex);

        // focus the last one
        this.navigationElements[lastIndex].focus();
    }

    /**
     * @function focusNext
     * @summary Move the focus to the next option, if one exists
     * @memberof KeyboardHelpers
     */
    focusNext() {
        const focussed = document.activeElement;
        const nextOption = focussed.nextElementSibling;

        if (nextOption) {
            let nextOptionIndex = this.getIndexOfNavigationElement(nextOption);

            // make the next one focussable
            this.roveTabIndex(nextOptionIndex);

            // focus the next one
            nextOption.focus();
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
            let previousOptionIndex = this.getIndexOfNavigationElement(previousOption);

            // make the previous one focussable
            this.roveTabIndex(previousOptionIndex);

            // focus the previous one
            previousOption.focus();
        }
    }

    /**
     * @function getIndexOfNavigationElement
     * @summary Get the array index of the navigationElementToFind, relative to the array of DOM elements
     * @memberof KeyboardHelpers
     *
     * @param {Element} navigationElementToFind - Navigation element to get the index of
     * @returns {number} navigationElementIndex
     */
    getIndexOfNavigationElement(navigationElementToFind) {
        let navigationElementIndex = -1;

        this.navigationElements.forEach((navigationElement, index) => {
            if (navigationElement === navigationElementToFind) {
                navigationElementIndex = index;
            }
        });

        return navigationElementIndex;
    }

    /**
     * @function isNavigableElement
     * @summary Determine whether the element is one of our navigationElements
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isNavigableElement
     */
    isNavigableElement(element) {
        let isNavigableElement = false;

        this.navigationElements.forEach((navigableElement) => {
            // if the focussed element is one of the navigationElements
            if (navigableElement === element) {
                isNavigableElement = true;
            }
        });

        return isNavigableElement;
    }

    /**
     * @function isParentElement
     * @summary Determine whether the element is the parentElement
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isParentElement
     */
    isParentElement(element) {
        let isParentElement = false;

        if (this.parentElement === element) {
            isParentElement = true;
        }

        return isParentElement;
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
        let isToggleElement = false;

        if (this.toggleElement === element) {
            isToggleElement = true;
        }

        return isToggleElement;
    }

    /**
     * @function onOptionFocus
     * @summary React when an option is focussed
     * @memberof KeyboardHelpers
     */
    onOptionFocus() {
        if (this.selectionFollowsFocus) {
            this.selectFocussed();
        }
    }

    /**
     * @function roveTabIndex
     * @summary Remove all but active tab from the tab sequence.
     * @memberof TabbedCarousel
     *
     * @see {@link https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex}
     * @param {number} index - Index of navigationElement to which to apply tabindex="0"
     */
    roveTabIndex(index) {
        if (this.useRovingTabIndex) {
            this.navigationElements.forEach((navigationElement, navigationElementIndex) => {
                if (navigationElementIndex === index) {
                    navigationElement.setAttribute('tabindex', '0');
                } else {
                    navigationElement.setAttribute('tabindex', '-1');
                }
            });
        }
    }

    /**
     * @function selectFocussed
     * @summary When selection does not follow focus, the user changes which element is selected by pressing the Enter or Space key.
     * @memberof KeyboardHelpers
     *
     * @param {object|undefined} e - Keydown event
     */
    selectFocussed(e) {
        const focussed = document.activeElement;

        if (this.isNavigableElement(focussed)) {
            const selectedAttributeProperty = this.selectedAttribute[0];
            const selectedAttributeValue = this.selectedAttribute[1];

            this.navigationElements.forEach((element2) => {
                element2.removeAttribute(selectedAttributeProperty);
            });

            focussed.setAttribute(selectedAttributeProperty, selectedAttributeValue);

            if (typeof e === 'object') {
                if (this.toggleOnSelectFocussed) {
                    this.toggleClosed();
                }
            }
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
        if (this.navigationElements.length) {
            // TODO event delegation
            this.navigationElements.forEach((element) => {
                element.addEventListener('keydown', this.onKeyDown.bind(this));

                // focus occurs on the focussed element only
                element.addEventListener('focus', this.onOptionFocus.bind(this));
            });
        }

        if (this.parentElement !== null) {
            this.parentElement.addEventListener('keydown', this.onKeyDown.bind(this));
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
 * @param {object} options - Module options
 * @param {boolean} options.endKeyToLastOption          - Pressing End will focus the last option in the listbox
 * @param {boolean} options.homeKeyToFirstOption        - Pressing Home will focus the first option in the listbox
 * @param {boolean} options.selectionFollowsFocus       - Select the focussed option, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 *
 * @todo {boolean} options.autoSelectFirstOption       - Select the first option in the listbox
 * @todo {boolean} options.typeaheadSingleCharacter     - Focus moves to the next item with a name that starts with the typed character (TODO)
 * @todo {boolean} options.typeaheadMultiCharacter      - Focus moves to the next item with a name that starts with the string of characters typed (TODO)
 */
class SingleSelect {
    constructor(options = {}) {
        // public options
        this.endKeyToLastOption = options.endKeyToLastOption || false;
        this.homeKeyToFirstOption = options.homeKeyToFirstOption || false;
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        // this.autoSelectFirstOption = options.autoSelectFirstOption || false;
        // this.typeaheadSingleCharacter = options.typeaheadSingleCharacter || false;
        // this.typeaheadMultiCharacter = options.typeaheadMultiCharacter || false;

        // private options
        // Note: when using setAttribute, any non-string value specified is converted automatically into a string.
        this.attributes = {
            button: [ 'aria-haspopup', 'listbox' ],
            listbox: [ 'role', 'listbox' ],
            listboxHidden: [ 'hidden', true ],
            option: [ 'role', 'option' ],
            optionSelected: [ 'aria-selected', 'true' ]
        };

        this.selectors = {
            button: 'button[aria-haspopup="listbox"]',
            listbox: '[role="listbox"]',
            option: '[role="option"]',
            optionSelected: '[role="option"][aria-selected="true"]'
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
        const selectedOptions = listbox.querySelectorAll(`:scope ${this.selectors.optionSelected}`);

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
     * @function getParentListbox
     * @memberof SingleSelect
     *
     * @param {Node} childElement - Listbox child element
     * @returns {Node} element - Listbox
     */
    getParentListbox(childElement) {
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
        if (element.getAttribute(this.attributes.button[0]) === this.attributes.button[1]) {
            return true;
        }

        return false;
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
        if (element.getAttribute(this.attributes.listbox[0]) === this.attributes.listbox[1]) {
            return true;
        }

        return false;
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
            let listbox = this.getParentListbox(focussed);

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
     * @function watchFocus
     * @summary Watch for changes in the target
     * @memberof SingleSelect
     *
     * @param {Node} target - Target to watch for changes
     */
    watchFocus(target) {
        // Options for the observer (which mutations to observe)
        const config = {
            attributes: true,
            childList: false,
            subtree: true
        };

        const _self = this;
        const selectedAttributeProperty = this.attributes.optionSelected[0];
        const selectedAttributeValue = this.attributes.optionSelected[1];

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList) {
            mutationsList.forEach(function (mutation) { // eslint-disable-line func-names
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === selectedAttributeProperty) {
                        // if an option was just selected
                        if (mutation.target.getAttribute(selectedAttributeProperty) === selectedAttributeValue) {
                            let listbox = _self.getParentListbox(mutation.target);

                            if (listbox !== null) {
                                if (listbox.parentElement) {
                                    let wrapper = listbox.parentElement;
                                    let button = wrapper.querySelector(_self.selectors.button);

                                    _self.setButtonText(button, mutation.target.innerHTML);
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
        observer.observe(target, config);
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
                const selectedAttributeProperty = this.attributes.optionSelected[0];
                const selectedAttributeValue = this.attributes.optionSelected[1];

                // TODO Cypress tests
                // TODO button requires 2x ENTER to show listbox
                // TODO create one instance for each select?

                const config = {
                    endKeyToLastOption: true,
                    homeKeyToFirstOption: true,
                    navigationActions: {
                        focusNext: [ 'ArrowDown' ],
                        focusPrevious: [ 'ArrowUp' ],
                        selectFocussed: [ 'Enter', ' ' ]
                    },
                    navigationElements: options,
                    parentElement: select,
                    selectedAttribute: [ selectedAttributeProperty, selectedAttributeValue ],
                    selectionFollowsFocus: this.selectionFollowsFocus,
                    toggleActions: {
                        toggle: [ 'ArrowUp', 'ArrowDown', 'Enter', ' ' ],
                        toggleClosed: [ 'Enter', ' ', 'Escape' ]
                    },
                    toggleElement: button,
                    toggleOnSelectFocussed: true
                };

                if (config.homeKeyToFirstOption) {
                    config.navigationActions.focusFirst = [ 'Home' ];
                }

                if (config.endKeyToLastOption) {
                    config.navigationActions.focusLast = [ 'End' ];
                }

                const SingleSelectKeys = new KeyboardHelpers(config);

                SingleSelectKeys.init();

                // keydown events bubble up from the element with click
                // so we can handle keyboard interactions for
                // button, listbox and option altogether
                select.addEventListener('click', this.toggleHidden.bind(this));

                // .addEventListener() sets the this pointer to the DOM element that caught the event
                // use .bind() to force the desired value of this
                // .bind() returns a new stub function that internally uses .apply() to set the this pointer as it was passed to .bind()
                listbox.addEventListener('focus', this.focusOption.bind(this));

                this.watchFocus(listbox);
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

        const singleSelect = new SingleSelect();
        singleSelect.init(

        );
    }
};
