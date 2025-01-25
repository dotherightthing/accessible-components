/**
 * @file ./scripts/release/copy-files.mjs
 * @summary Copy files to release directory.
 */

var totalSet = false;

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as fs from 'node:fs';
import * as path from 'path';

// if not loaded as a dependency
if (!fs.existsSync(`${path.resolve()}/package.json`)) {
    /* eslint-disable no-console */
    console.error('copy-files.mjs: package.json not found, exiting');
    /* eslint-enable no-console */
}

const Bar = require('progress-barjs');
import cpy from 'cpy';
import formatLog from '../helpers/format-log.mjs';
const numeral = require('numeral');
const packageJson = require(`${path.resolve('../../')}/package.json`);
const folderName = 'release';

formatLog([
    'release',
    'copy files',
    `to /${folderName}`
]);

// Release files are those that are required
// to use the package as a WP Parent Theme
let releaseFiles = [
    // Plugin/Theme Config
    './config/**/*',
    // Plugin/Theme CSS
    './css/*.css',
    // Plugin/Theme JS
    './js/*-es5.js',
    // Plugin/Theme WP Read Me
    './README.md',
    // Not release changelog
    '!./CHANGELOG.md',
    // Not CSS source maps
    '!./css/maps/**/*',
];

const npmDependencies = packageJson.dependencies;

if (typeof npmDependencies === 'object') {
    const npmDependencyNames = Object.keys(npmDependencies);
    const npmDependencyNamesFiltered = npmDependencyNames.filter(name => name !== 'wpdtrt-npm-scripts');

    npmDependencyNamesFiltered.forEach(name => {
        releaseFiles.push(`./node_modules/${name}/**/*`);
        releaseFiles.push(`!./node_modules/${name}/package.json`);
        releaseFiles.push(`!./node_modules/${name}/**/AUTHORS*`);
        releaseFiles.push(`!./node_modules/${name}/**/bin*`);
        releaseFiles.push(`!./node_modules/${name}/**/CHANGELOG*`);
        releaseFiles.push(`!./node_modules/${name}/**/changelog*`);
        releaseFiles.push(`!./node_modules/${name}/**/LICENSE*`);
        releaseFiles.push(`!./node_modules/${name}/**/README*`);
        releaseFiles.push(`!./node_modules/${name}/**/*.json`);
        releaseFiles.push(`!./node_modules/${name}/**/*.less`);
        releaseFiles.push(`!./node_modules/${name}/**/*.map`);
        releaseFiles.push(`!./node_modules/${name}/**/*.md`);
        releaseFiles.push(`!./node_modules/${name}/**/*.scss`);
        releaseFiles.push(`!./node_modules/${name}/**/*.txt`);
        releaseFiles.push(`!./node_modules/${name}/**/*.xml`);
        releaseFiles.push(`!./node_modules/${name}/**/*.zip`);
        releaseFiles.push(`!./node_modules/${name}/**/test/**/*`);
        releaseFiles.push(`!./node_modules/${name}/**/tests/**/*`);
    });
}

let bar = Bar({
    label: 'Copying files',
    info: '',
    append: false,
    show: {
        active: {
            date: false,
            bar: true,
            percent: true, // required for time
            count: false,
            time: true
        },
        overwrite: true,
        bar: {
            length: 20,
            completed: '=',
            incompleted: ' '
        },
        label: {
            color: '\x1b[0;37m' // white
        },
        info: {
            color: '\x1b[0;37m' // white
        },
        time: {
            color: '\x1b[0;37m' // white
        },
        percent: {
            color: '\x1b[0;37m' // white
        },
        count: {
            color: '\x1b[0;37m' // white
        },
        tick: {
            color: '\x1b[0;37m' // white
        }
    }
});

(async () => {
    await cpy(releaseFiles, folderName, {
        cwd: '../../',
        parents: true
    }).on('progress', progress => {
        const completedSize = numeral(progress.completedSize).format('0.0 b');

        if (!totalSet) {
            bar.setTotal(progress.totalFiles);
            totalSet = true;
        }

        // prevent a second bar from displaying the last few %
        // (this makes the file size slightly inaccurate)
        if (!bar.complete) {
            bar.tick(`[${completedSize}]`);
        }
    });
})();
