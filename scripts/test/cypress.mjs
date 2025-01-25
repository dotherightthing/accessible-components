/**
 * @file ./scripts/test/cypress.js
 * @summary Run all Cypress specs and generate a pretty HTML report
 * @see {@link https://docs.cypress.io/guides/tooling/reporters.html}
 * @see {@link http://antontelesh.github.io/testing/2019/02/04/mochawesome-merge.html}
 */
// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as path from 'path';
const cypress = require('cypress');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

/**
 * @function runTests
 * @summary Run tests and generate an HTML report to ./mochawesome-report/mochawesome.html
 */
async function runTests() {
    let cypressConfig;
    const pth = `${path.resolve('../../')}/`;
    const cypressConfigFile = 'cypress.config.js';

    try {
        cypressConfig = require(`${pth}${cypressConfigFile}`); // eslint-disable-line global-require
        // eslint-disable-next-line no-console
        console.log(`${cypressConfigFile} found in ${pth}`);
    } catch (err) {
        cypressConfig = false;
        // eslint-disable-next-line no-console
        console.warn(`${cypressConfigFile} not found in ${pth} (wpdtrt-npm-scripts is probably not running as a dependency)`);
    }

    if (cypressConfig) {
        // help Cypress to find the config file and support folder
        process.chdir('../../');

        await fse.remove('mochawesome-report'); // remove the report folder
        const { totalFailed } = await cypress.run(); // get the number of failed tests
        const jsonReport = await merge(); // generate JSON report
        await generator.create(jsonReport);
        process.exit(totalFailed); // exit with the number of failed tests
    }
}

runTests();
