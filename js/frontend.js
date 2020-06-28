/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/*  eslint-disable class-methods-use-this */
// TODO https://jsdoc.app/tags-event.html

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
 * @param {boolean} options.autoSelectFirstOption - Select the first option in the listbox
 * @param {boolean} options.endKeyToLastOption - Pressing End will focus the last option in the listbox
 * @param {boolean} options.homeKeyToFirstOption - Pressing Home will focus the first option in the listbox
 * @param {boolean} options.selectionFollowsFocus - Select the focussed option, see <https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus>
 * @param {boolean} options.typeaheadSingleCharacter - Focus moves to the next item with a name that starts with the typed character (TODO)
 * @param {boolean} options.typeaheadMultiCharacter - Focus moves to the next item with a name that starts with the string of characters typed (TODO)
 */
class SingleSelect {
    constructor(options = {}) {
        this.autoSelectFirstOption = options.autoSelectFirstOption || false;
        this.endKeyToLastOption = options.endKeyToLastOption || false;
        this.homeKeyToFirstOption = options.homeKeyToFirstOption || false;
        this.selectionFollowsFocus = options.selectionFollowsFocus || false;
        this.typeaheadSingleCharacter = options.typeaheadSingleCharacter || false;
        this.typeaheadMultiCharacter = options.typeaheadMultiCharacter || false;
    }

    /**
     * @function onKeyDown
     * @memberof SingleSelect
     *
     * @param {*} e - target of focus event
     *
     * @see https://keycode.info/
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
     * @see https://stackoverflow.com/questions/24386354/execute-js-code-after-pressing-the-spacebar
     * @todo Ignore Shift+Tab
     */
    onKeyDown(e) {
        switch (e.key) {
        case 'Up': // IE/Edge
        case 'ArrowUp':
            console.log('ArrowUp');
            e.preventDefault(); // prevent the natural key action
            this.focusPreviousOption();
            break;
        case 'Down': // IE/Edge
        case 'ArrowDown':
            console.log('ArrowDown');
            e.preventDefault(); // prevent the natural key action
            this.focusNextOption();
            break;
        case 'Esc': // IE/Edge
        case 'Escape':
            console.log('Escape');
            e.preventDefault(); // prevent the natural key action
            break;
        case 'Spacebar': // IE/Edge
        case ' ':
            console.log('Spacebar');
            e.preventDefault(); // prevent the natural key action
            this.selectFocussedOption();
            break;
        case 'Enter':
            console.log('Enter');
            e.preventDefault(); // prevent the natural key action
            this.selectFocussedOption();
            break;
        case 'Home': // macOS is Fn + ArrowLeft
            console.log('Home');
            e.preventDefault(); // prevent the natural key action
            this.focusFirstOption();
            break;
        case 'End': // macOS is Fn + ArrowRight
            console.log('End');
            e.preventDefault(); // prevent the natural key action
            this.focusLastOption();
            break;
        default:
            console.log(e.key);
        }
    }

    /**
     * @function onFocusListbox
     * @memberof SingleSelect
     *
     * @param {*} e - target of focus event
     */
    onFocusListbox(e) {
        const listbox = e.target;

        // :scope - only match selectors on descendants of the base element:
        const options = listbox.querySelectorAll(':scope [role="option"]');
        const selectedOptions = listbox.querySelectorAll(':scope [role="option"][aria-selected="true"]');

        // if no options are selected yet
        if (!selectedOptions.length) {
            // focus the first option
            options[0].focus();
        } else {
            // focus the first selected option
            selectedOptions[0].focus();
        }
    }

    /**
     * @function onFocusOption
     * @summary React when an option is focussed
     * @memberof SingleSelect
     */
    onFocusOption() {
        if (this.selectionFollowsFocus) {
            this.selectFocussedOption();
        }
    }

    /**
     * @function focusFirstOption
     * @summary Move the focus to the first option
     * @memberof SingleSelect
     */
    focusFirstOption() {
        if (!this.homeKeyToFirstOption) {
            return;
        }

        const focussed = document.activeElement;

        if (focussed.getAttribute('role') === 'option') {
            const listbox = focussed.parentNode;
            const options = listbox.querySelectorAll(':scope [role="option"]');

            options[0].focus();
        }
    }

    /**
     * @function focusLastOption
     * @summary Move the focus to the last option
     * @memberof SingleSelect
     */
    focusLastOption() {
        if (!this.endKeyToLastOption) {
            return;
        }

        const focussed = document.activeElement;

        if (focussed.getAttribute('role') === 'option') {
            const listbox = focussed.parentNode;
            const options = listbox.querySelectorAll(':scope [role="option"]');
            const lastIndex = options.length - 1;

            options[lastIndex].focus();
        }
    }

    /**
     * @function focusNextOption
     * @summary Move the focus to the next option, if one exists
     * @memberof SingleSelect
     */
    focusNextOption() {
        const focussed = document.activeElement;

        if (focussed.getAttribute('role') === 'option') {
            const nextOption = focussed.nextElementSibling;

            if (nextOption) {
                nextOption.focus();
            }
        }
    }

    /**
     * @function focusPreviousOption
     * @summary Move the focus to the previous option, if one exists
     * @memberof SingleSelect
     */
    focusPreviousOption() {
        const focussed = document.activeElement;

        if (focussed.getAttribute('role') === 'option') {
            const previousOption = focussed.previousElementSibling;

            if (previousOption) {
                previousOption.focus();
            }
        }
    }

    /**
     * @function selectFocussedOption
     * @summary When selection does not follow focus, the user changes which element is selected by pressing the Enter or Space key.
     * @memberof SingleSelect
     */
    selectFocussedOption() {
        const focussed = document.activeElement;

        if (focussed.getAttribute('role') === 'option') {
            const listbox = focussed.parentNode;
            const wrapper = listbox.parentNode;
            const button = wrapper.querySelector(':scope button[aria-haspopup="listbox"]');
            const options = listbox.querySelectorAll(':scope [role="option"]');

            options.forEach((option) => {
                option.removeAttribute('aria-selected');
            });

            focussed.setAttribute('aria-selected', true);

            if (button) {
                button.innerHTML = focussed.innerHTML;
            }
        }
    }

    /**
     * @function onClickButton
     * @summary Toggle the visibility of the listbox dropdown.
     * @memberof SingleSelect
     *
     * @param {*} e - target of focus event
     */
    onClickButton(e) {
        const button = e.target;
        const wrapper = button.parentNode;
        const listbox = wrapper.querySelector('[role="listbox"]:not([aria-multiselectable="true"]');

        if (listbox.getAttribute('hidden')) {
            listbox.removeAttribute('hidden');
        } else {
            listbox.setAttribute('hidden', true);
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
            const button = select.querySelector(':scope button[aria-haspopup="listbox"]');
            const listbox = select.querySelector('[role="listbox"]:not([aria-multiselectable="true"]');

            button.addEventListener('click', this.onClickButton.bind(this));

            // .addEventListener() sets the this pointer to the DOM element that caught the event
            // use .bind() to force the desired value of this
            // .bind() returns a new stub function that internally uses .apply() to set the this pointer as it was passed to .bind()
            listbox.addEventListener('focus', this.onFocusListbox.bind(this));

            // keydown events bubble up from the element with focus
            // so we can handle listbox and option interactions together
            listbox.onkeydown = (e) => this.onKeyDown(e);

            // focus occurs on the focussed element only
            const options = listbox.querySelectorAll(':scope [role="option"]');

            // :scope - only match selectors on descendants of the base element:
            options.forEach((option) => {
                option.addEventListener('focus', this.onFocusOption.bind(this));
            });
        });
    }
}

document.onreadystatechange = () => {
    // The document has finished loading and the document has been parsed
    // but sub-resources such as images, stylesheets and frames are still loading.
    if (document.readyState === 'interactive') {
        let label = new Label();

        let singleSelect = new SingleSelect({
            endKeyToLastOption: true,
            homeKeyToFirstOption: true,
            selectionFollowsFocus: false
        });

        label.init();
        singleSelect.init();
    }
};
