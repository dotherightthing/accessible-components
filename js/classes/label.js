/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

/**
 * @class Label
 *
 * @param {null|Node} options.instanceElement - The outermost DOM element
 */
class Label {
    constructor(options = {}) {
        // public options
        this.instanceElement = options.instanceElement || null;
    }

    /**
     * @function onClickLabel
     * @memberof Label
     *
     * @param {*} e - target of click event
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
        this.instanceElement.addEventListener('click', this.onClickLabel.bind(this));
    }
}
