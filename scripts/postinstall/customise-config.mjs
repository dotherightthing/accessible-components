/**
 * @file ./scripts/postinstall/customise-config.mjs
 * @summary Replace template $placeholders with project specific values
 */

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as fs from 'node:fs';
import * as path from 'path';
import decorateLog from '../helpers/decorate-log.mjs';

// if not loaded as a dependency
if (!fs.existsSync(`${path.resolve()}/package.json`)) {
    /* eslint-disable no-console */
    console.error('customise-config.mjs: package.json not found, exiting');
    /* eslint-enable no-console */
}

const packageJson = require(`${path.resolve()}/package.json`);
const replaceInFiles = require('replace-in-files');

// from and to are required
// but are overridden in the pipes
const options = {
    files: [
        '../../config/naturaldocs/Project.txt'
    ],
    from: '$packageName',
    to: packageJson.name
};

const customiseConfig = async function () {
    try {
        const {
            countOfMatchesByPaths
        } = await replaceInFiles(options)
            .pipe({ from: '$packageName', to: packageJson.name })
            .pipe({ from: '$packageVersion', to: packageJson.version });

        // filter out empty objects
        const changedFiles = countOfMatchesByPaths
            .filter(thepath => Object.keys(thepath).length);

        const suffix = changedFiles.length > 1 ? 's' : '';

        decorateLog([
            'postinstall',
            'customise config',
            `${changedFiles.length} string${suffix} replaced`
        ]);
    } catch (error) {
        decorateLog([
            'postinstall',
            'customise config',
            `${error}`
        ]);
    }
};

customiseConfig();
