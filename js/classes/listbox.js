/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* globals KeyboardHelpers */

/**
 * @class SingleSelectListbox
 * @summary Class used to store local state and make DOM calls relative to a particular element.
 *
 * @param {object} options                          - Module options
 * @param {null|Node} options.instanceElement       - The outermost DOM element
 * @param {boolean} options.selectionFollowsFocus   - Select the focussed option (<https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>)
 *
 * @todo {boolean} options.autoSelectFirstOption    - Select the first option in the listbox
 * @todo {boolean} options.typeaheadSingleCharacter - Focus moves to the next item with a name that starts with the typed character
 * @todo {boolean} options.typeaheadMultiCharacter  - Focus moves to the next item with a name that starts with the string of characters typed
 */
class SingleSelectListbox {
    constructor(options = {}) {
        // public options
        this.instanceElement = options.instanceElement || null;
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        // this.autoSelectFirstOption = options.autoSelectFirstOption || false;
        // this.typeaheadSingleCharacter = options.typeaheadSingleCharacter || false;
        // this.typeaheadMultiCharacter = options.typeaheadMultiCharacter || false;

        // private options
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.
        this.attributes = {
            button: [ 'aria-haspopup', 'listbox' ],
            hidden: [ 'hidden', true ],
            listbox: [ 'role', 'listbox' ],
            option: [ 'role', 'option' ],
            selected: [ 'aria-selected', 'true' ]
        };

        this.selectors = {
            button: '[aria-haspopup="listbox"]',
            hidden: '[hidden]',
            listbox: '[role="listbox"]',
            option: '[role="option"]',
            selected: '[aria-selected="true"]'
        };
    }

    /**
     * @function assignInstanceId
     * @summary Assign a unique ID to an instance to allow querying of descendant selectors sans :scope (Edge 79)
     * @memberof SingleSelectListbox
     */
    assignInstanceId() {
        // If the parent element does not have an ID, assign a temporary ID
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
     * @function focusOption
     * @memberof SingleSelectListbox
     */
    focusOption() {
        const options = document.querySelectorAll(`#${this.instanceId} ${this.selectors.option}`);
        const selectedOptions = document.querySelectorAll(`#${this.instanceId} ${this.selectors.selected}`);

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
     * @memberof SingleSelectListbox
     *
     * @param {Node} childElement - Listbox child element
     * @returns {Node} element - Listbox
     */
    getListbox(childElement) {
        let i = 0;
        let limit = 10; // for debugging
        let listbox;

        if (this.isButton(childElement)) {
            listbox = document.querySelector(`#${this.instanceId} ${this.selectors.listbox}`);
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
     * @memberof SingleSelectListbox
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
     * @memberof SingleSelectListbox
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
     * @memberof SingleSelectListbox
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

        const self = this;
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
                            let listbox = self.getListbox(option);

                            if (listbox !== null) {
                                if (listbox.parentElement) {
                                    let wrapper = listbox.parentElement;
                                    let button = wrapper.querySelector(self.selectors.button);

                                    self.setButtonText(button, option.innerHTML);
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
     * @memberof SingleSelectListbox
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
     * @memberof SingleSelectListbox
     */
    toggleHidden() {
        const focussed = document.activeElement; // or could use e.target

        if (focussed) {
            let listbox = this.getListbox(focussed);

            if (listbox !== null) {
                if (listbox.parentElement) {
                    let wrapper = listbox.parentElement;
                    let button = wrapper.querySelector(this.selectors.button);

                    if (listbox.hasAttribute(this.attributes.hidden[0])) {
                        listbox.removeAttribute(this.attributes.hidden[0]);
                        listbox.focus();
                    } else {
                        listbox.setAttribute(this.attributes.hidden[0], this.attributes.hidden[1]);
                        button.focus();
                    }
                }
            }
        }
    }

    /**
     * @function init
     * @memberof SingleSelectListbox
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        // .select wrapper allows button and listbox to be styled together
        this.assignInstanceId();

        const button = document.querySelector(`#${this.instanceId} ${this.selectors.button}`);
        const listbox = document.querySelector(`#${this.instanceId} ${this.selectors.listbox}:not([aria-multiselectable="true"])`);

        if (listbox) {
            const options = document.querySelectorAll(`#${this.instanceId} ${this.selectors.option}`);

            // TODO Cypress tests
            // TODO button requires 2x ENTER to show listbox
            // TODO create one instance for each select?

            const KeyboardHelpersConfig = {
                instanceElement: this.instanceElement, // TODO: should this be listbox as that is focussable?
                keyboardActions: {
                    focusFirst: [ 'Home' ],
                    focusLast: [ 'End' ],
                    focusNext: [ 'ArrowDown' ],
                    focusPrevious: [ 'ArrowUp' ],
                    selectFocussed: [ 'Enter', ' ' ]
                },
                keyboardNavigableElements: options,
                selectedAttr: this.attributes.selected,
                selectionFollowsFocus: this.selectionFollowsFocus,
                toggleActions: {
                    toggle: [ 'ArrowUp', 'ArrowDown', 'Enter', ' ' ],
                    toggleClosed: [ 'Enter', ' ', 'Escape' ]
                },
                toggleElement: button,
                toggleAfterSelected: true
            };

            const singleSelectListboxKeys = new KeyboardHelpers(KeyboardHelpersConfig);

            singleSelectListboxKeys.init();

            // keydown events bubble up from the element with click
            // so we can handle keyboard interactions for
            // button, listbox and option altogether
            this.instanceElement.addEventListener('click', this.toggleHidden.bind(this));

            // .addEventListener() sets the this pointer to the DOM element that caught the event
            // use .bind() to force the desired value of this
            // .bind() returns a new stub function that internally uses .apply() to set the this pointer as it was passed to .bind()
            listbox.addEventListener('focus', this.focusOption.bind(this));

            this.propagateSelection(listbox);
        }
    }
}
