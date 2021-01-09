/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* globals Label, SingleSelectListbox, TabbedCarousel */

document.onreadystatechange = () => {
    // Polyfill for forEach
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    // Polyfill for forEach
    if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
    }

    // The document has finished loading and the document has been parsed
    // but sub-resources such as images, stylesheets and frames are still loading.
    if (document.readyState === 'interactive') {
        document.querySelectorAll('.label[data-for]').forEach((label) => {
            const labelInstance = new Label({
                instanceElement: label
            });

            labelInstance.init();
        });

        document.querySelectorAll('.select').forEach((singleSelectListbox) => {
            const singleSelectListboxInstance = new SingleSelectListbox({
                instanceElement: singleSelectListbox,
                selectionFollowsFocus: singleSelectListbox.getAttribute('data-selection-follows-focus') === 'true' || false
            });

            singleSelectListboxInstance.init();
        });

        document.querySelectorAll('.tabbed-carousel').forEach((tabbedCarousel) => {
            const tabbedCarouselInstance = new TabbedCarousel({
                initialSelection: tabbedCarousel.getAttribute('data-initial-selection'),
                instanceElement: tabbedCarousel,
                selectionFollowsFocus: tabbedCarousel.getAttribute('data-selection-follows-focus') === 'true' || false
            });

            tabbedCarouselInstance.init();
        });
    }
};
