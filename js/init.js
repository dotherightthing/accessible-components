/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* globals Label, SingleSelectListbox, TabbedCarousel */

document.onreadystatechange = () => {
    // The document has finished loading and the document has been parsed
    // but sub-resources such as images, stylesheets and frames are still loading.
    if (document.readyState === 'interactive') {
        // Function to make IE9+ support forEach
        // untested (CBD Free not working)
        // https://stackoverflow.com/a/50917053/6850747
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }

        document.querySelectorAll('.label[data-for]').forEach((label) => {
            const labelInstance = new Label({
                instanceElement: label
            });

            labelInstance.init();
        });

        document.querySelectorAll('.select').forEach((singleSelectListbox) => {
            const singleSelectListboxInstance = new SingleSelectListbox({
                instanceElement: singleSelectListbox,
                selectionFollowsFocus: false
            });

            singleSelectListboxInstance.init();
        });

        document.querySelectorAll('.tabbed-carousel').forEach((tabbedCarousel) => {
            const tabbedCarouselInstance = new TabbedCarousel({
                instanceElement: tabbedCarousel,
                selectionFollowsFocus: true
            });

            tabbedCarouselInstance.init();
        });
    }
};
