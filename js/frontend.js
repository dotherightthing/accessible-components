/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
// TODO https://jsdoc.app/tags-event.html

/* eslint class-methods-use-this: ['error', { 'exceptMethods': ['onClickLabel', 'selectFocussedOption'] }] */

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
 * @param {boolean} options.endKeyToLastOption - Pressing End will focus the last option in the listbox (TODO)
 * @param {boolean} options.homeKeyToFirstOption - Pressing Home will focus the first option in the listbox (TODO)
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
            break;
        case 'Down': // IE/Edge
        case 'ArrowDown':
            console.log('ArrowDown');
            e.preventDefault(); // prevent the natural key action
            break;
        case 'Left': // IE/Edge
        case 'ArrowLeft':
            console.log('ArrowLeft');
            e.preventDefault(); // prevent the natural key action
            break;
        case 'Right': // IE/Edge
        case 'ArrowRight':
            console.log('ArrowRight');
            e.preventDefault(); // prevent the natural key action
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
        default:
            console.log(e.key);
        }
    }

    /**
     * @function onFocusListbox
     * @memberof SingleSelect
     *
     * @param {*} e - target of focus event
     *
     * @see https://keycode.info/
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

            if (this.selectionFollowsFocus) {
                // select the first option
                this.selectFocussedOption();
            }
        } else {
            // focus the first selected option
            selectedOptions[0].focus();
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
            const options = listbox.querySelectorAll(':scope [role="option"]');

            options.forEach((option) => {
                option.removeAttribute('aria-selected');
            });

            focussed.setAttribute('aria-selected', true);
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
        const listboxes = document.querySelectorAll('[role="listbox"]:not([aria-multiselectable="true"]');

        listboxes.forEach((listbox) => {
            // .addEventListener() sets the this pointer to the DOM element that caught the event
            // use .bind() to force the desired value of this
            // .bind() returns a new stub function that internally uses .apply() to set the this pointer as it was passed to .bind()
            listbox.addEventListener('focus', this.onFocusListbox.bind(this));

            // keydown events bubble up from the element with focus
            // so we can handle listbox and option interactions together
            listbox.onkeydown = (e) => this.onKeyDown(e);
        });
    }
}

document.onreadystatechange = () => {
    // The document has finished loading and the document has been parsed
    // but sub-resources such as images, stylesheets and frames are still loading.
    if (document.readyState === 'interactive') {
        let label = new Label();

        let singleSelect = new SingleSelect({
            selectionFollowsFocus: false
        });

        label.init();
        singleSelect.init();
    }
};
