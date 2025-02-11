/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

/**
 * @class LinkProxy
 * @summary Class used to store local state and make DOM calls relative to a particular element.
 *
 * @param {object} config                              - Module configuration
 * @param {null|Node} config.clickTimeout              - Maximum number of ms to wait for mouseup event (allows for text selection)
 * @param {null|Node} config.instanceElement           - The proxy link element
 */
class LinkProxy {
    constructor(config = {}) {
        const options = {
            clickTimeout: 200,
            instanceElement: null
        };

        // merge objects
        const settings = { ...options, ...config };

        // public settings

        this.clickTimeout = settings.clickTimeout;
        this.instanceElement = settings.instanceElement;

        // working variables

        this.clickTimer = null;
        this.downTime = null;
        this.upTime = null;

        // private settings
        // Note: when using setAttribute, any non-string value specified is automatically converted into a string.

        this.selectors = {
            classActiveProxy: 'link-proxy--active', // applied to link proxy
            classSelectableProxy: 'link-proxy--selectable', // applied to link proxy
            classTriggeredHover: 'link-proxy--hovered', // applied to proxied link
            linkProxy: '[data-link-proxy-for]' // applied to link proxy
        };
    }

    /**
     * @function getAllChildren
     * @memberof LinkProxy
     * @summary Get all child elements.
     *
     * @param {HTMLElement} htmlElement - Parent HTML element
     * @returns {HTMLCollection} All child elements
     */
    getAllChildren(htmlElement) {
        if (htmlElement.children.length === 0) {
            return [ htmlElement ];
        }

        let allChildElements = [];

        for (let i = 0; i < htmlElement.children.length; i += 1) {
            let children = this.getAllChildren(htmlElement.children[i]);
            if (children) {
                allChildElements.push(...children);
            }
        }

        allChildElements.push(htmlElement);

        return allChildElements;
    }

    /**
     * @function getSelectorAsAttribute
     * @memberof LinkProxy
     *
     * @param {string} selector - Selector string
     * @returns {string} attribute - Attribute string
     */
    getSelectorAsAttribute(selector) {
        let selectorStr = selector;
        selectorStr = selectorStr.replace('[', '');
        selectorStr = selectorStr.replace(']', '');

        return selectorStr;
    }

    /**
     * @function onClick
     * @memberof LinkProxy
     *
     * @param {*} e - target of hover event
     */
    onClick(e) {
        if (e.isTrusted) { // prevent feedback loop in iOS Safari
            const linkProxy = e.currentTarget; // element on which the event handler was attached
            const eventTarget = e.target; // element on which the event occurred
            const proxiedLinkId = linkProxy.getAttribute(this.getSelectorAsAttribute(this.selectors.linkProxy));
            const userNotSelectingText = this.upTime - this.downTime < this.clickTimeout;

            if ((eventTarget === linkProxy) && userNotSelectingText) {
                document.getElementById(proxiedLinkId).click();
            }
        }
    }

    /**
     * @function onHover
     * @memberof LinkProxy
     * @summary Combines onMouseenter and onMouseleave
     *
     * @param {*} e - target of hover event
     */
    onHover(e) {
        const linkProxy = e.currentTarget; // element on which the event handler was attached
        const proxiedLinkId = linkProxy.getAttribute(this.getSelectorAsAttribute(this.selectors.linkProxy));

        linkProxy.classList.remove(this.selectors.classSelectableProxy);
        document.getElementById(proxiedLinkId).classList.toggle(this.selectors.classTriggeredHover);
    }

    /**
     * @function onMousedown
     * @memberof LinkProxy
     * @summary Show the user that holding the mousedown state will allow them to select text, without triggering the parent link.
     *
     * @param {*} e - target of hover event
     */
    onMousedown(e) {
        const linkProxy = e.currentTarget; // element on which the event handler was attached
        const eventTarget = e.target; // element on which the event occurred

        this.downTime = +new Date();

        linkProxy.classList.remove(this.selectors.classSelectableProxy); // don't show the text as selectable.

        if (eventTarget.tagName !== 'FIGURE' && eventTarget.tagName !== 'IMG') {
            this.clickTimer = setTimeout(() => {
                linkProxy.classList.add(this.selectors.classSelectableProxy); // show the text as selectable.
            }, this.clickTimeout);
        }
    }

    /**
     * @function onMouseup
     * @memberof LinkProxy
     * @summary Allow the user to hold the mousedown state to select text, without triggering the parent link.
     *
     * @param {*} e - target of hover event
     */
    onMouseup(e) {
        const linkProxy = e.currentTarget; // element on which the event handler was attached

        this.upTime = +new Date();

        clearTimeout(this.clickTimer); // restart the timer.
        linkProxy.classList.remove(this.selectors.classSelectableProxy); // don't show the text as selectable.
    }

    /**
     * @function init
     * @memberof LinkProxy
     *
     * @see [“This” within es6 class method](https://stackoverflow.com/questions/36489579/this-within-es6-class-method)
     * @see [When you pass 'this' as an argument](https://stackoverflow.com/questions/28016664/when-you-pass-this-as-an-argument/28016676#28016676)
     */
    init() {
        const linkProxy = this.instanceElement;
        const proxiedLinkId = linkProxy.getAttribute(this.getSelectorAsAttribute(this.selectors.linkProxy));
        const linkProxyTargetEl = document.getElementById(proxiedLinkId);

        if (!proxiedLinkId || !document.getElementById(proxiedLinkId) || !document.getElementById(proxiedLinkId).getAttribute('href')) {
            return;
        }

        if (!linkProxy.dataset.initialised) {
            linkProxy.addEventListener('mousedown', this.onMousedown.bind(this));
            linkProxy.addEventListener('mouseenter', this.onHover.bind(this));
            linkProxy.addEventListener('mouseleave', this.onHover.bind(this));
            linkProxy.addEventListener('mouseup', this.onMouseup.bind(this));
            linkProxy.addEventListener('click', this.onClick.bind(this));
            linkProxy.classList.add(this.selectors.classActiveProxy);

            const childElements = this.getAllChildren(this.instanceElement);

            const filteredChildElements = childElements.filter(el => {
                return ((el !== this.instanceElement) && (el !== linkProxyTargetEl));
            });

            // prevent child elements from capturing click event in macOS/iOS Safari
            filteredChildElements.forEach(el => {
                el.style.pointerEvents = 'none';
            });

            linkProxy.dataset.initialised = true;
        }
    }
}
