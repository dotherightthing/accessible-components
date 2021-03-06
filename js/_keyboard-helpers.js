/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

// keyboardNavigableElements - direction selection - directSelectElements
// relativeXX - relative selection (previous/next) - relativeSelectElements

/**
 * @class KeyboardHelpers
 *
 * @param {object}          config                             - Module configuration
 * @param {null|Node}       config.instanceElement             - The outermost DOM element
 * @param {boolean}         config.infiniteNavigation          - Whether to loop the focus to the first/last keyboardNavigableElement when the focus is out of range
 * @param {string}          config.interactionModalityAttr     - data- attribute applied to the body element, reflecting the interaction modality
 * @param {object}          config.keyboardActions             - The key(s) which trigger actions
 * @param {null|NodeList}   config.keyboardNavigableElements   - The DOM element(s) which will become keyboard navigable
 * @param {boolean}         config.keyboardNavigation          - Whether the keyboard is being used to navigate the page
 * @param {null|Function}   config.onSelect                    - Callback with an argument of selectedElement, called after an element is selected
 * @param {Array}           config.selectedAttr                - Property and Value applied to the selected keyboardNavigableElement
 * @param {boolean}         config.selectionFollowsFocus       - Automatically select the focussed option (<https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>)
 * @param {object}          config.toggleActions               - The key(s) which toggle the parent state
 * @param {null|Node}       config.toggleElement               - The DOM element which toggles the parent state
 * @param {boolean}         config.toggleAfterSelected         - Whether to trigger the toggle action after a keyboardNavigableElement is selected
 * @param {Array}           config.unselectedAttr              - Property and Value applied to the unselected keyboardNavigableElement
 * @param {boolean}         config.useRovingTabIndex           - Whether to apply a tabindex of 0 (tabstop) rather than -1 (programmatic focus) to the focussed item
 *
 * @todo Make this a module, as it doesn't need to manage state
 */
class KeyboardHelpers {
    constructor(config = {}) {
        const options = {
            instanceElement: null,
            infiniteNavigation: false,
            interactionModalityAttr: 'data-accessible-components-modality',
            keyboardActions: {},
            keyboardNavigableElements: null,
            keyboardNavigation: false,
            onSelect: () => { },
            selectedAttr: [],
            selectionFollowsFocus: false,
            toggleActions: {},
            toggleElement: null,
            toggleAfterSelected: false,
            unselectedAttr: [],
            useRovingTabIndex: false
        };

        // merge objects
        const settings = { ...options, ...config };

        // public settings

        this.instanceElement = settings.instanceElement;
        this.infiniteNavigation = settings.infiniteNavigation;
        this.keyboardActions = settings.keyboardActions;
        this.keyboardNavigableElements = settings.keyboardNavigableElements;
        this.keyboardNavigation = settings.keyboardNavigation;
        this.interactionModalityAttr = settings.interactionModalityAttr;
        this.selectedAttr = settings.selectedAttr;
        this.selectionFollowsFocus = settings.selectionFollowsFocus;
        this.toggleActions = settings.toggleActions;
        this.toggleElement = settings.toggleElement;
        this.toggleAfterSelected = settings.toggleAfterSelected;
        this.unselectedAttr = settings.unselectedAttr;
        this.useRovingTabIndex = settings.useRovingTabIndex;

        if (settings.onSelect instanceof Function) {
            this.onSelect = settings.onSelect;
        }

        // private settings

        this.proxyActionElements = {
            selectFocussed: '[data-kh-proxy="selectFocussed"]',
            selectNext: '[data-kh-proxy="selectNext"]',
            selectPrevious: '[data-kh-proxy="selectPrevious"]'
        };
    }

    /**
     * @function focusFirst
     * @summary Move the focus to the first option
     * @memberof KeyboardHelpers
     */
    focusFirst() {
        const firstElement = this.getFirst();

        // make the element focussable
        this.updateRovingTabIndex(firstElement);

        // shift the focus
        firstElement.focus();
    }

    /**
     * @function focusLast
     * @summary Move the focus to the last option
     * @memberof KeyboardHelpers
     */
    focusLast() {
        const lastElement = this.getLast();

        // make the element focussable
        this.updateRovingTabIndex(lastElement);

        // shift the focus
        lastElement.focus();
    }

    /**
     * @function focusNext
     * @summary Move the focus to the next option, if one exists
     * @description When focus is on a tab element in a horizontal tab list:
     * @memberof KeyboardHelpers
     */
    focusNext() {
        const focussed = document.activeElement;
        let nextElement = focussed.nextElementSibling;

        if (!nextElement && this.infiniteNavigation) {
            nextElement = this.getFirst();
        }

        if (nextElement) {
            // make the element focussable
            this.updateRovingTabIndex(nextElement);

            // shift the focus
            nextElement.focus();
        }
    }

    /**
     * @function focusPrevious
     * @summary Move the focus to the previous option, if one exists
     * @memberof KeyboardHelpers
     */
    focusPrevious() {
        const focussed = document.activeElement;
        let previousElement = focussed.previousElementSibling;

        if (!previousElement && this.infiniteNavigation) {
            previousElement = this.getLast();
        }

        if (previousElement) {
            // make the element focussable
            this.updateRovingTabIndex(previousElement);

            // shift the focus
            previousElement.focus();
        }
    }

    /**
     * @function getFirst
     * @summary Get a reference to the first navigableElement
     * @memberof KeyboardHelpers
     *
     * @returns {Node} firstElement
     */
    getFirst() {
        const firstIndex = 0;
        let firstElement = this.keyboardNavigableElements[firstIndex];

        return firstElement;
    }

    /**
     * @function getLast
     * @summary Get a reference to the last navigableElement
     * @memberof KeyboardHelpers
     *
     * @returns {Node} lastElement
     */
    getLast() {
        const lastIndex = this.keyboardNavigableElements.length - 1;
        const lastElement = this.keyboardNavigableElements[lastIndex];

        return lastElement;
    }

    /**
     * @function getNext
     * @summary Get a reference to the next navigableElement after the selected one
     * @memberof KeyboardHelpers
     *
     * @returns {Node} nextElement
     */
    getNext() {
        const selected = this.getSelected();
        let nextElement = selected.nextElementSibling;

        if (!nextElement && this.infiniteNavigation) {
            nextElement = this.getFirst();
        }

        return nextElement;
    }

    /**
     * @function getPrevious
     * @summary Get a reference to the previous navigableElement before the selected one
     * @memberof KeyboardHelpers
     *
     * @returns {Node} previousElement
     */
    getPrevious() {
        const selected = this.getSelected();
        let previousElement = selected.previousElementSibling;

        if (!previousElement && this.infiniteNavigation) {
            previousElement = this.getLast();
        }

        return previousElement;
    }

    /**
     * @function getSelected
     * @summary Get a reference to the element which is currently selected
     * @memberof KeyboardHelpers
     *
     * @returns {Node} selectedElement
     */
    getSelected() {
        const selectedAttrProp = this.selectedAttr[0];
        const selectedAttrVal = this.selectedAttr[1];
        const selectedElement = document.querySelector(`#${this.instanceId} [${selectedAttrProp}="${selectedAttrVal}"]`);

        return selectedElement;
    }

    /**
     * @function getIndexOfKeyboardNavigableElement
     * @summary Get the array index of the keyboardNavigableElementToFind, relative to the array of DOM elements
     * @memberof KeyboardHelpers
     *
     * @param {Node} keyboardNavigableElementToFind - Navigable element to get the index of
     * @returns {number} keyboardNavigableElementIndex
     */
    getIndexOfKeyboardNavigableElement(keyboardNavigableElementToFind) {
        let keyboardNavigableElementIndex = -1;

        this.keyboardNavigableElements.forEach((keyboardNavigableElement, index) => {
            if (keyboardNavigableElement === keyboardNavigableElementToFind) {
                keyboardNavigableElementIndex = index;
            }
        });

        return keyboardNavigableElementIndex;
    }

    /**
     * @function initPolyfills
     * @memberof KeyboardHelpers
     */
    initPolyfills() {
        /* eslint-disable */

        // Polyfill for forEach
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }

        // Polyfill for forEach
        if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
            HTMLCollection.prototype.forEach = Array.prototype.forEach;
        }

        // Polyfill for includes
        // https://www.cluemediator.com/object-doesnt-support-property-or-method-includes-in-ie
        if (!Array.prototype.includes) {
            Object.defineProperty(Array.prototype, 'includes', {
                value: function (searchElement, fromIndex) {

                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    // 1. Let O be ? ToObject(this value).
                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If len is 0, return false.
                    if (len === 0) {
                        return false;
                    }

                    // 4. Let n be ? ToInteger(fromIndex).
                    //    (If fromIndex is undefined, this step produces the value 0.)
                    var n = fromIndex | 0;

                    // 5. If n ≥ 0, then
                    //  a. Let k be n.
                    // 6. Else n < 0,
                    //  a. Let k be len + n.
                    //  b. If k < 0, let k be 0.
                    var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                    function sameValueZero(x, y) {
                        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                    }

                    // 7. Repeat, while k < len
                    while (k < len) {
                        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                        // b. If SameValueZero(searchElement, elementK) is true, return true.
                        if (sameValueZero(o[k], searchElement)) {
                            return true;
                        }
                        // c. Increase k by 1. 
                        k++;
                    }

                    // 8. Return false
                    return false;
                }
            });
        }

        /* eslint-enable */
    }

    /**
     * @function isComponentElement
     * @summary Determine whether the element is the instanceElement
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isComponentElement
     */
    isComponentElement(element) {
        return (this.instanceElement === element);
    }

    /**
     * @function isKeyboardNavigableElement
     * @summary Determine whether the element is one of our keyboardNavigableElements
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM element
     * @returns {boolean} isKeyboardNavigableElement
     */
    isKeyboardNavigableElement(element) {
        let isKeyboardNavigableElement = false;

        this.keyboardNavigableElements.forEach((keyboardNavigableElement) => {
            // if the focussed element is one of the keyboardNavigableElements
            if (keyboardNavigableElement === element) {
                isKeyboardNavigableElement = true;
            }
        });

        return isKeyboardNavigableElement;
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
    normaliseKey(keyPressed) { // eslint-disable-line class-methods-use-this
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

        if ([ 'ArrowLeft', 'ArrowRight', ' ', 'Tab' ].includes(keyPressed)) {
            this.setInteractionModality('keyboard');
        }

        if (this.isKeyboardNavigableElement(e.target)) {
            keyboardActions.forEach((keyboardAction) => {
                // if the pressed key is in the keyboardActions array
                if (this.keyboardActions[keyboardAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice
                    this[keyboardAction].call(this, e);
                }
            });
        } else if (this.isComponentElement(e.target)) { // toggleElement already natively supports ENTER
            // trigger the toggleAction if one is registered for this component
            toggleActions.forEach((toggleAction) => {
                // if the pressed key is in the keyboardActions array
                if (this.toggleActions[toggleAction].includes(keyPressed)) {
                    e.preventDefault(); // prevent the natural key action
                    e.stopPropagation(); // else keypress is registered twice

                    // trigger the toggle action to alter the state of a sub-component
                    this[toggleAction].call(this, e);
                }
            });
        }
    }

    /**
     * @function onKeyboardNavigableElementFocus
     * @summary React when a keyboardNavigableElement is focussed
     * @description Note: additional callbacks are implemented in the host component using Mutation Observers
     * @memberof KeyboardHelpers
     *
     * @param {object|undefined} e - Keydown event
     */
    onKeyboardNavigableElementFocus(e) {
        if (this.selectionFollowsFocus) {
            this.selectFocussed(e);
        }
    }

    /**
     * @function registerKeyboardActions
     * @summary Call a keyboard action when a key is pressed
     * @memberof KeyboardHelpers
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    registerKeyboardActions() {
        document.body.addEventListener('keydown', this.onKeyDown.bind(this)); // onKeyDown calls setInteractionModality

        if (this.keyboardNavigableElements.length) {
            // TODO event delegation
            this.keyboardNavigableElements.forEach((keyboardNavigableElement) => {
                keyboardNavigableElement.addEventListener('keydown', this.onKeyDown.bind(this));

                // focus occurs on the focussed element only
                keyboardNavigableElement.addEventListener('focus', this.onKeyboardNavigableElementFocus.bind(this));
            });
        }

        // key listener on component is used to trigger toggle action
        if (this.instanceElement !== null) {
            this.instanceElement.addEventListener('keydown', this.onKeyDown.bind(this));
        }
    }

    /**
     * @function registerMouseActions
     * @summary Toggle a flag when the mouse is used.
     * @memberof KeyboardHelpers
     */
    registerMouseActions() {
        document.body.addEventListener('mousedown', () => {
            this.setInteractionModality('mouse');
        });
    }

    /**
     * @function registerProxyKeyboardActions
     * @summary Call a keyboard action when a proxy element is activated/clicked
     * @memberof KeyboardHelpers
     */
    registerProxyKeyboardActions() {
        const proxyActions = Object.keys(this.proxyActionElements);

        // This is usually only required if !this.selectionFollowsFocus
        // except in Safari
        // which doesn't allow a button tab to gain focus
        // see https://bugs.webkit.org/show_bug.cgi?id=22261
        this.keyboardNavigableElements.forEach((keyboardNavigableElement) => {
            // select on click
            keyboardNavigableElement.setAttribute('data-kh-proxy', 'selectFocussed');
        });

        proxyActions.forEach((proxyAction) => {
            const proxyActionElements = document.querySelectorAll(`#${this.instanceId} ${this.proxyActionElements[proxyAction]}`);

            if (proxyActionElements.length) {
                proxyActionElements.forEach((proxyActionElement) => {
                    proxyActionElement.addEventListener('click', this[proxyAction].bind(this));
                });
            }
        });
    }

    /**
     * @function selectFocussed
     * @summary Selection either follows focus, or the user changes which element is selected by pressing the Enter or Space key.
     * @memberof KeyboardHelpers
     *
     * @param {object|undefined} e - Keydown event
     */
    selectFocussed(e) {
        let focussed = document.activeElement;
        const self = this;

        // Fix for Safari
        // which doesn't allow a button tab to gain focus
        // see https://bugs.webkit.org/show_bug.cgi?id=22261
        if (e.target !== focussed) {
            e.target.focus();
            focussed = document.activeElement;
        }

        if (this.isKeyboardNavigableElement(focussed)) {
            const selectedAttrProp = this.selectedAttr[0];
            const selectedAttrVal = this.selectedAttr[1];
            const unselectedAttrProp = this.unselectedAttr[0];
            const unselectedAttrVal = this.unselectedAttr[1];

            this.keyboardNavigableElements.forEach((element2) => {
                element2.removeAttribute(selectedAttrProp);
                element2.setAttribute(unselectedAttrProp, unselectedAttrVal);
            });

            focussed.setAttribute(selectedAttrProp, selectedAttrVal);

            // this is required if focus was result of a click action
            // or if element was programmatically focussed
            // otherwise it's redundant
            this.updateRovingTabIndex(focussed);

            if (typeof e === 'object') {
                if (this.toggleAfterSelected) {
                    this.toggleClosed();
                }
            }

            self.onSelect.call(self, focussed);
        }
    }

    /**
     * @function selectNext
     * @summary Select the next element
     * @memberof KeyboardHelpers
     */
    selectNext() {
        const nextElement = this.getNext();

        this.selectNonFocussed(nextElement);
    }

    /**
     * @function selectNonFocussed
     * @summary Direct select an element without focussing first
     * @description Used with previous/next button proxies.
     * @memberof KeyboardHelpers
     *
     * @param {Node} element - DOM Element
     */
    selectNonFocussed(element) {
        const self = this;

        if (this.isKeyboardNavigableElement(element)) {
            const selectedAttrProp = this.selectedAttr[0];
            const selectedAttrVal = this.selectedAttr[1];
            const unselectedAttrProp = this.unselectedAttr[0];
            const unselectedAttrVal = this.unselectedAttr[1];

            this.keyboardNavigableElements.forEach((element2) => {
                element2.removeAttribute(selectedAttrProp);
                element2.setAttribute(unselectedAttrProp, unselectedAttrVal);
            });

            this.updateRovingTabIndex(element);

            // this triggers mutation observer callback in host component
            element.setAttribute(selectedAttrProp, selectedAttrVal);

            self.onSelect.call(self, element);
        }
    }

    /**
     * @function selectPrevious
     * @summary Select the previous element
     * @memberof KeyboardHelpers
     */
    selectPrevious() {
        const previousElement = this.getPrevious();

        this.selectNonFocussed(previousElement);
    }

    /**
     * @function setInteractionModality
     * @summary Update the value the interactionModalityAttr on the instanceElement
     * @memberof KeyboardHelpers
     *
     * @param {string} modality - The current interaction modality (mouse|keyboard)
     */
    setInteractionModality(modality) {
        document.body.setAttribute(this.interactionModalityAttr, modality);
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
     * @param {Node} element - keyboardNavigableElement to which to apply tabindex="0"
     */
    updateRovingTabIndex(element) {
        if (this.useRovingTabIndex) {
            this.keyboardNavigableElements.forEach((keyboardNavigableElement) => {
                if (keyboardNavigableElement === element) {
                    keyboardNavigableElement.setAttribute('tabindex', '0');
                } else {
                    keyboardNavigableElement.setAttribute('tabindex', '-1');
                }
            });
        }
    }

    /**
     * @function init
     * @memberof KeyboardHelpers
     */
    init() {
        this.initPolyfills();

        this.instanceId = this.instanceElement.getAttribute('id');

        this.registerKeyboardActions();
        this.registerMouseActions();
        this.registerProxyKeyboardActions();
    }
}
