/**
 * @file ./helpers/helpers/env.mjs
 * @summary Environment Variables.
 * @see https://github.com/dotherightthing/generator-wpdtrt-plugin-boilerplate/wiki/Set-up-environmental-variables
 */

/**
 * @constant CYPRESS_RECORD_KEY
 * @summary Key for recording headless CI tests.
 * @description
 * Note:
 * - This is in addition to the projectId in cypress.config.js.
 */
const CYPRESS_RECORD_KEY = process.env.CYPRESS_RECORD_KEY || '';

/**
 * @constant CI
 * @summary CI CI flag (boolean).
 * @see https://confluence.atlassian.com/bitbucket/environment-variables-794502608.html
 */
const CI = (typeof process.env.CI !== 'undefined');

export { CYPRESS_RECORD_KEY, CI };
