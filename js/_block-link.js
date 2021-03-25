/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

/**
 * @class BlockLink
 * @summary Class used to store local state and make DOM calls relative to a particular element.
 *
 * @param {object} config                              - Module configuration
 * @param {null|Node} config.clickTimeout              - Maximum number of ms to wait for mouseup event (allows for text selection)
 * @param {null|Node} config.instanceElement           - The outermost DOM element
 * @param {null|Function} config.onBeforeLinkClick     - Callback, called before a link is triggered
 */
class BlockLink {
    constructor(config = {}) {
        const options = {
            clickTimeout: 200,
            instanceElement: null,
            onBeforeLinkClick: () => { }
        };

        // merge objects
        const settings = { ...options, ...config };

        // public settings

        this.clickTimeout = settings.clickTimeout;
        this.instanceElement = settings.instanceElement;

        if (settings.onBeforeLinkClick instanceof Function) {
            this.onBeforeLinkClick = settings.onBeforeLinkClick;
        }

        // working variables

        this.clickTimer = null;
        this.down = null;
        this.up = null;

        // private settings
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.

        this.selectors = {
            classHover: 'block-link--hover',
            classSelectable: 'block-link--selectable',
            bounds: '[data-block-link-parent]',
            linkProxy: '[data-block-link-proxy]',
            linkTarget: '[data-block-link-target]' // in case there are multiple links within the block or bounds
        };
    }

    /**
     * @function assignInstanceId
     * @summary Assign a unique ID to an instance to allow querying of descendant selectors sans :scope (Edge 79)
     * @memberof BlockLink
     */
    assignInstanceId() {
        if (this.instanceElement.getAttribute('id') === null) {
            const randomNumber = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };

            this.instanceElement.setAttribute('id', `block-link-${randomNumber()}-${randomNumber()}`);
        }

        this.instanceId = this.instanceElement.getAttribute('id');
    }

    /**
     * @function onHover
     * @memberof BlockLink
     * @summary Combines onMouseenter and onMouseleave
     *
     * @param {*} e - target of hover event
     */
    onHover(e) {
        // const proxy = e.target;
        const parent = this.instanceElement;

        parent.classList.toggle(this.selectors.classHover);

        if (!parent.classList.contains(this.selectors.classHover)) {
            parent.classList.remove(this.selectors.classSelectable);
        }
    }

    /**
     * @function onProxyClick
     * @memberof BlockLink
     *
     * @param {*} e - target of hover event
     */
    onProxyClick(e) {
        const proxy = e.target;
        const linkTarget = document.querySelector(`#${this.instanceId} ${this.selectors.linkTarget}`);

        if (!this.selectorMatches(linkTarget, '[href]')) {
            return;
        }

        this.onBeforeLinkClick.call(linkTarget);

        // if the clicked element is not the link target
        if (linkTarget !== proxy) {
            if (this.selectorMatches(proxy, 'img')) {
                // if the clicked element was an image, fire the click
                linkTarget.click();
            } else if (this.up - this.down < this.clickTimeout) {
                // else if the clicked element was text, only fire the click if the user did not hold the mousedown to select it
                linkTarget.click();
            }
        }
    }

    /**
     * @function onProxyMousedown
     * @memberof BlockLink
     * @summary Show the user that holding the mousedown state will allow them to select text, without triggering the parent link.
     *
     * @param {*} e - target of hover event
     */
    onProxyMousedown(e) {
        const parent = this.instanceElement;
        this.down = +new Date();

        parent.classList.remove(this.selectors.classSelectable); // don't show the text as selectable.

        this.clickTimer = setTimeout(() => {
            parent.classList.add(this.selectors.classSelectable); // show the text as selectable.
        }, this.clickTimeout);
    }

    /**
     * @function onProxyMouseup
     * @memberof BlockLink
     * @summary Allow the user to hold the mousedown state to select text, without triggering the parent link.
     *
     * @param {*} e - target of hover event
     */
    onProxyMouseup(e) {
        const parent = this.instanceElement;
        this.up = +new Date();

        clearTimeout(this.clickTimer); // restart the timer.
        parent.classList.remove(this.selectors.classSelectable); // don't show the text as selectable.
    }

    /**
     * @function selectorMatches
     * @memberof BlockLink
     * @summary Element.matches polyfill
     * @see {link|https://davidwalsh.name/element-matches-selector}
     *
     * @param {*} el - Element
     * @param {string} selector - Selector
     * @returns {boolean} matches
     */
    selectorMatches(el, selector) {
        var p = Element.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || ((s) => {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        });

        return f.call(el, selector);
    }

    /**
     * @function init
     * @memberof BlockLink
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        this.assignInstanceId();

        const blocklinkProxies = document.querySelectorAll(`#${this.instanceId} ${this.selectors.linkProxy}`);
        const linkTargets = document.querySelectorAll(`#${this.instanceId} ${this.selectors.linkTarget}`);

        blocklinkProxies.forEach((linkProxy) => {
            linkProxy.addEventListener('mousedown', this.onProxyMousedown.bind(this));
            linkProxy.addEventListener('mouseenter', this.onHover.bind(this));
            linkProxy.addEventListener('mouseleave', this.onHover.bind(this));
            linkProxy.addEventListener('mouseup', this.onProxyMouseup.bind(this));
            linkProxy.addEventListener('click', this.onProxyClick.bind(this));
        });

        linkTargets.forEach((linkTarget) => {
            linkTarget.addEventListener('mouseenter', this.onHover.bind(this));
            linkTarget.addEventListener('mouseleave', this.onHover.bind(this));
        });
    }
}
