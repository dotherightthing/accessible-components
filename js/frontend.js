const singleSelect = {
    init: () => {
        console.log('init');
    }
};

// Alternative to DOMContentLoaded event
document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        singleSelect.init();
    }
}
