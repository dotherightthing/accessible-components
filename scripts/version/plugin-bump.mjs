/**
 * @file version/version.js
 * @summary Tasks to version files prior to a release.
 */

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { execaCommandSync } from 'execa';
import formatLog from '../helpers/decorate-log.mjs';
const replace = require('replace-in-file');

let packageJson;
// let wordpressChildTheme;
let wordpressPlugin;
let wordpressPluginBoilerplate;

/**
 * @function setup
 */
function setup() {
    process.chdir('../../'); // change process.cwd() from wpdtrt-npm-scripts to parent plugin

    packageJson = require(`${process.cwd()}/package.json`);
    // wordpressChildTheme = packageJson.keywords.includes('wordpress-child-theme');
    wordpressPlugin = packageJson.keywords.includes('wordpress-plugin');
    wordpressPluginBoilerplate = packageJson.name === 'wpdtrt-plugin-boilerplate';
}

/**
 * @function teardown
 */
function teardown() {
    process.chdir('node_modules/wpdtrt-npm-scripts'); // change process.cwd() from parent plugin to wpdtrt-npm-scripts
}

/* eslint-disable no-console */

/**
 * @function logFiles
 * @summary Print a message to the console.
 * Note: If files don't exist, the versioning functions will fail silently.
 * @param {Array} files - Files to version
 */
function logFiles(files) {
    let length = 1;
    let plural = '';
    let filesStr = files;

    if (Array.isArray(files)) {
        length = files.length;
        plural = 's';

        // remove [ and ] from output
        filesStr = files.toString();
        filesStr = filesStr.replace(/,/g, '\n');
    }

    console.log(`Versioning ${length} file${plural}:`);
    console.log(filesStr);
    console.log(' ');
}

/**
 * @function versionGeneratedPluginReadme
 * @summary Version the (WordPress) readme.txt
 * @param {object} packagePlugin - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./readme.txt
 * Stable tag: 1.2.3
 * == Changelog ==
 * = 1.2.3 =
 */
function versionGeneratedPluginReadme(packagePlugin) {
    const { version } = packagePlugin;
    const files = `${process.cwd()}/readme.txt`;
    const re1 = new RegExp(/(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
    const re2 = new RegExp(/(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version} =\n\n= $2$3` ]
    });

    return replacements;
}

/**
 * @function versionNamespaceSafe
 * @summary Get the version value from wpdtrt-plugin-boilerplate/package.json, in namespace format.
 * @param {string} packageVersionBoilerplate e.g. 1.2.34
 * @returns {string} The version in namespace format, e.g. 1_2_34
 */
function versionNamespaceSafe(packageVersionBoilerplate) {
    return packageVersionBoilerplate.split('.').join('_');
}

/**
 * @function versionGeneratedPluginSrc
 * @summary version the extended class name.
 * @param {object} packagePlugin - A reference to the generated plugin's package.json file
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/class-*.php:
 * extends DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionGeneratedPluginSrc(packagePlugin, packageVersionBoilerplateNamespaced) {
    const categories = [
        'plugin',
        'rewrite',
        'shortcode',
        'taxonomy',
        'widget'
    ];

    const { name } = packagePlugin;
    const files = [];
    const re = new RegExp(/(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/);

    categories.forEach(category => {
        files.push(
            `${process.cwd()}/src/class-${name}-${category}.php`
        );
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}`
    });

    return replacements;
}

/**
 * @function versionGeneratedPluginDocs
 * @summary version the Natural Docs' Project.txt.
 * @param {object} packagePlugin - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT Foo (1.2.3)
 */
function versionGeneratedPluginDocs(packagePlugin) {
    const { version } = packagePlugin;
    const files = `${process.cwd()}/config/naturaldocs/Project.txt`;
    const re = new RegExp(/(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionGeneratedPluginWpRoot
 * @summary version the child root file.
 * @param {object} packagePlugin - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./wpdtrt-generated-plugin.php ?
 * Version: 1.2.3
 * define( 'WPDTRT_PLUGIN_VERSION', '1.2.3' );
 */
function versionGeneratedPluginWpRoot(packagePlugin) {
    const { name, version } = packagePlugin;
    const files = `${process.cwd()}/${name}.php`;
    const re1 = new RegExp(/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
    const re2 = new RegExp(/(define\( '(?:[A-Z_]+)', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateAutoloader
 * @summary version the autoloader (index) file.
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./index.php
 * @version 1.2.3
 */
function versionBoilerplateAutoloader(packageBoilerplate) {
    const { version } = packageBoilerplate;
    const files = `${process.cwd()}/index.php`;
    const re = new RegExp(/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateComposer
 * @summary version the composer file.
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./composer.json
 * "DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_1_2_3\\": "src"
 */
function versionBoilerplateComposer(packageVersionBoilerplateNamespaced) {
    const files = `${process.cwd()}/composer.json`;
    const re = new RegExp(/("DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}$3`
    });

    return replacements;
}

/**
 * @function versionBoilerplateNaturalDocs
 * @summary version the Natural Docs' Project.txt.
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT WordPress Plugin Boilerplate (1.2.3)
 */
function versionBoilerplateNaturalDocs(packageBoilerplate) {
    const { version } = packageBoilerplate;
    const files = `${process.cwd()}/config/naturaldocs/Project.txt`;
    const re = new RegExp(/(Subtitle: DTRT WordPress Plugin Boilerplate \(+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateSrc
 * @summary version the namespaced src files.
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/*.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionBoilerplateSrc(packageVersionBoilerplateNamespaced) {
    const categories = [
        'Rewrite',
        'Shortcode',
        'Taxonomy',
        'TemplateLoader',
        'Widget'
    ];

    const files = [];
    const re = new RegExp(/(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm);

    categories.forEach(category => {
        files.push(`${process.cwd()}/src/${category}.php`);
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateSrcPlugin
 * @summary version the namespaced src/Plugin.php file.
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/Plugin.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 * const WPDTRT_PLUGIN_VERSION = "1.2.3";
 */
function versionBoilerplateSrcPlugin(packageBoilerplate, packageVersionBoilerplateNamespaced) {
    const { version } = packageBoilerplate;
    const files = `${process.cwd()}/src/Plugin.php`;
    const re1 = new RegExp(/(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm);
    const re2 = new RegExp(/(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/);
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${versionNamespaceSafeStr}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestNaturalDocs
 * @summary version Natural Docs' Project.txt.
 * @param {object} packagePlugin - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT Foo (1.2.3)
 */
function versionBoilerplateTestNaturalDocs(packagePlugin) {
    const { version } = packagePlugin;
    const files = `${process.cwd()}/tests/generated-plugin/config/naturaldocs/Project.txt`;
    const re = new RegExp(/(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestReadme
 * @summary version the (WordPress) readme.
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/readme.txt
 * Stable tag: 1.2.3
 * // == Changelog ==
 * //
 * // = 1.2.3 =
 * //
 */
function versionBoilerplateTestReadme(packageBoilerplate) {
    const { version } = packageBoilerplate;
    const files = `${process.cwd()}/tests/generated-plugin/readme.txt`;
    const re1 = new RegExp(/(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
    const re2 = new RegExp(/(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version} =\n\n= $2$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestWpRoot
 * @summary version the root (WordPress) file.
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/index.php
 * Version: 1.2.3
 * define( 'WPDTRT_TEST_VERSION', '1.2.3' );
 */
function versionBoilerplateTestWpRoot(packageBoilerplate) {
    const { version } = packageBoilerplate;
    const files = `${process.cwd()}/tests/generated-plugin/wpdtrt-test.php`;
    const re1 = new RegExp(/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
    const re2 = new RegExp(/(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/);

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestSrc
 * @summary version the namespaced src files.
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/src/*.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionBoilerplateTestSrc(packageVersionBoilerplateNamespaced) {
    const categories = [
        'plugin',
        'rewrite',
        'shortcode',
        'taxonomy',
        'widget'
    ];

    const files = [];
    const re = new RegExp(/(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/);
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;

    categories.forEach(category => {
        files.push(
            `${process.cwd()}/tests/generated-plugin/src/class-wpdtrt-test-${category}.php`
        );
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${versionNamespaceSafeStr}`
    });

    return replacements;
}

/**
 * @function updateDependencies (1/3)
 * @summary Update the boilerplate dependency to the latest version.
 * @description
 * Note:
 * - If wpdtrt-plugin-boilerplate is loaded as a dependency,
 *   get the latest release of wpdtrt-plugin-boilerplate.
 * - This has to run before replaceVersions,
 *   so that the correct version information is available
 */
async function updateDependencies() {
    formatLog([
        'version',
        'updateDependencies',
        'Update Composer dependencies'
    ]);

    if (wordpressPlugin) {
        const command = 'composer update dotherightthing/wpdtrt-plugin-boilerplate --no-interaction --no-suggest';
        console.log(command);

        try {
            const { stdout, stderr } = await execaCommandSync(command, { shell: true });
            console.log(stdout);
            console.log(stderr);
        } catch (error) {
            console.error(error.stdout);
        }
    }
}

/**
 * @function replaceVersions (2/3)
 * @summary Replace version strings, using the version set in package.json.
 */
function replaceVersions() {
    formatLog([
        'version',
        'replaceVersions',
        'Replace version strings'
    ]);

    if (!wordpressPluginBoilerplate && !wordpressPlugin) {
        console.log('This repository is not a plugin.');
        console.log('Skipping..\n\n');
        return;
    }

    let packagePlugin;
    let packageBoilerplate;
    let packageVersionBoilerplateNamespaced;

    // boilerplate as root
    if (wordpressPluginBoilerplate) {
        packageBoilerplate = packageJson;

        const {
            name: nameBoilerplate,
            version: versionBoilerplate
        } = packageBoilerplate;

        packageVersionBoilerplateNamespaced = versionNamespaceSafe(versionBoilerplate);

        // get the latest release number
        console.log(`Bump ${nameBoilerplate} to ${versionBoilerplate} using package.json`);

        versionBoilerplateAutoloader(packageBoilerplate);
        versionBoilerplateComposer(packageVersionBoilerplateNamespaced);
        versionBoilerplateSrc(packageVersionBoilerplateNamespaced);
        versionBoilerplateSrcPlugin(packageBoilerplate, packageVersionBoilerplateNamespaced);
        versionBoilerplateNaturalDocs(packageBoilerplate);
        versionBoilerplateTestReadme(packageBoilerplate);
        versionBoilerplateTestWpRoot(packageBoilerplate);
        versionBoilerplateTestSrc(packageVersionBoilerplateNamespaced);
        versionBoilerplateTestNaturalDocs(packageBoilerplate);
    } else {
        // plugin as root
        packagePlugin = packageJson;
        packageBoilerplate = require(`${process.cwd()}/vendor/dotherightthing/wpdtrt-plugin-boilerplate/package.json`); // eslint-disable-line global-require

        const {
            name: namePlugin,
            version: versionPlugin
        } = packagePlugin;

        const {
            name: nameBoilerplate,
            version: versionBoilerplate
        } = packageBoilerplate;

        packageVersionBoilerplateNamespaced = versionNamespaceSafe(versionBoilerplate);

        console.log(
            // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
            `Bump ${namePlugin} to ${versionPlugin} and ${nameBoilerplate} ${versionBoilerplate} using package.json`
        );

        versionGeneratedPluginSrc(packagePlugin, packageVersionBoilerplateNamespaced);
        versionGeneratedPluginReadme(packagePlugin);
        versionGeneratedPluginWpRoot(packagePlugin);
        versionGeneratedPluginDocs(packagePlugin);
    }
}

/**
 * @function autoloadUpdatedDependencies (3/3)
 * @summary Regenerate the list of PHP classes to be autoloaded.
 */
async function autoloadUpdatedDependencies() {
    formatLog([
        'version',
        'autoloadUpdatedDependencies',
        'Regenerate the list of PHP classes to be autoloaded'
    ]);

    const command = 'composer dump-autoload --no-interaction';
    console.log(command);

    try {
        const { stdout, stderr } = await execaCommandSync(command, { shell: true });
        console.log(stdout);
        console.log(stderr);
    } catch (error) {
        console.error(error.stdout);
    }
}

setup();
updateDependencies();
replaceVersions();
autoloadUpdatedDependencies();
teardown();
