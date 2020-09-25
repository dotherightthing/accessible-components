/**
 * @file build-scripts/cypress.js
 * @see {@link https://docs.cypress.io/guides/tooling/reporters.html}
 * @see {@link http://antontelesh.github.io/testing/2019/02/04/mochawesome-merge.html}
 */

const cypress = require('cypress');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

/**
 * @function runTests
 * @summary Run tests and generate an HTML report to ./mochawesome-report/mochawesome.html
 */
async function runTests() {
    await fse.remove('mochawesome-report'); // remove the report folder
    const { totalFailed } = await cypress.run(); // get the number of failed tests
    const jsonReport = await merge(); // generate JSON report
    await generator.create(jsonReport);
    process.exit(totalFailed); // exit with the number of failed tests
}

runTests();
