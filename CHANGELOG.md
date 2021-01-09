* [e88abe8] Update wpdtrt-npm-scripts
* [f043c07] Add package keywords for versioning script
* [581841b] Update listbox config to include new option
* [69a1d1b] Toggle class on the instance the keyboard is being used to navigate
* [b7d9206] Polyfill forEach in demo initialisation file
* [cbfdb7d] Update wpdtrt-npm-scripts
* [de9ebe5] Lint JS
* [7a38464] Remove up/down arrow tests, as these keys are now reserved for vertical scrolling
* [eb49c1a] Update Cypress
* [0c56c00] Add polyfills for IE11
* [070134a] Add polyfills for IE11
* [8b13a2b] Prevent initialisation from moving the focus down the page
* [85be73f] Programmatically focus tab buttons in Safari (fixes #4)
* [0d4f054] Prevent tab image from stealing tab button click event
* [6ead39e] Remove redundant variable
* [f253f99] Disable server cache, open directory on server start
* [4b7ca9d] Reserve up and down arrows for scrolling the page
* [d26a396] Fix booleans
* [080166f] Refactor constructor options
* [881f0dc] Refactor constructor options
* [73ce47d] Refactor constructor options, replace mutation observers with callbacks
* [c504613] Refactor constructor options, add onTabSelect callback
* [b3102e9] Use generic selectors to make CSS optional
* [7212799] Use tag selector to identify disabled buttons
* [072ff02] Use generic selectors to make CSS optional
* [68f5aeb] Update wpdtrt-npm-scripts
* [fbd3b05] Update wpdtrt-npm-scripts
* [121b9a4] Use file lists to populate frontend.js and backend.js
* [0174cc5] Add expand button, use class selectors, use plural naming, use BEM, enable buttons when JS enabled
* [df546f2] Fix broken tests
* [cbd8753] Fix thumbnails, disable buttons and set initial selection when JS disabled
* [fc73261] Add disclosure mechanism (to finish)
* [7090f9d] Docs
* [f720f4f] Add delay to test to fix visibility fail, only on CI, only for this test
* [cdc76da] Remove redundant file
* [32de578] Update Cypress
* [5ff5e13] Lint JS
* [23ba59e] Remove redundant attribute
* [55d9aac] Remove redundant attribute
* [92e704d] Rename single-select-listbox to listbox in order to manage single/multi-select tests in a single file; refactor tests to match Tabs tests which reference the WAI-ARIA spec;
* [be247c4] Translate carousel spec to unit tests, document composite structure
* [5f48106] Generate HTML spec/report from Cypress tests
* [c620f04] Skip failing test
* [e583da8] Refactor tests, add TODOs
* [ee6df1a] Document support for uparrow and downarrow
* [f3f7316] Add tests
* [06b3a36] Add tests, support up and down arrows
* [cc2eac8] Fix tab selection on programmatic focus (initialSelection)
* [51bc553] Fix typos, improve titles and layout
* [3be1186] Pass interaction event between methods
* [d1b667e] Add support for default/initial selection
* [a0c86fe] Add support for click selection when selection-follows-focus is disabled
* [e3203cb] Reorder functions, remove unused function
* [c9b89fc] Refactor specifications table into Cypress tests, add new tests, add default tab option
* [889ad8c] Update Cypress
* [b7b62d0] Refactor specifications table into Cypress tests
* [adba108] Create separate test for selection-follows-focus
* [db01e98] Refactor specifications table into Cypress tests
* [86eb377] Revert renaming of tabpanel classes
* [6729783] Document different flavours of Cypress
* [ca7640b] frontend.js is now generated
* [09e3ea9] Refactor specifications table into Cypress tests
* [9fac792] Fix dynamic ID assigned to tabbed carousels
* [c0285a4] Split classes out to separate files for easier authoring, merge using shell script, lint JS
* [3307562] Remove inset focus ring on page
* [01088ac] Remove broken Github pages deployment - see new branch (#2)
* [1d9e355] Replace CSS Custom Properties with SCSS variables to support IE11 without a polyfill
* [7f0f8be] Add Babel polyfill to support Array.prototype.includes in IE11
* [ee06016] Rename componentElement to instanceElement, replace :scope (Edge 79) with unique instanceId
* [a3ff344] Instantiate a class for each DOM element rather than all DOM elements, to allow descendant selectors (which manage state) to be managed independently
* [ca3b2bc] Add http server and ngrok instructions
* [a9edb53] Run cypress tests as part of Github workflow
* [6c515af] Run deploy before release step
