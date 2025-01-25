/**
 * @file ./scripts/postinstall/remaining-github-api-calls.mjs
 * @summary Expose the Github API rate limit to aid in debugging failed builds
 */

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import decorateLog from '../helpers/decorate-log.mjs';

const ghRateLimit = require('gh-rate-limit');

const token = process.env.GH_TOKEN ? process.env.GH_TOKEN : '';
let msg;

if (token !== '') {
    ghRateLimit({
        token: token
    }).then(status => {
        msg = `${status.core.remaining}/${status.core.limit} API calls remaining`;
        decorateLog([
            'postinstall',
            'Github API rate limit check',
            msg
        ]);
    });
} else {
    msg = 'skipping - GH_TOKEN not found)';
    decorateLog([
        'postinstall',
        'Github API rate limit check',
        msg
    ]);
}
