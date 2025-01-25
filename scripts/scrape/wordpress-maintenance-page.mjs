/**
 * @file Scrape WordPress Maintenance Page
 * @summary Scrape the WordPress maintenance page and save it for use with the maintenance-switch plugin.
 * @description
 * Source page must be (locally) published to /maintenance-template/ with Visibility:Public.
 * @see https://wordpress.org/plugins/maintenance-switch/
 */
import axios from 'axios';
import * as fs from 'node:fs';

import decorateLog from '../helpers/decorate-log.mjs';

const baseURL = process.argv[2]; // note: no trailing slash
const sourceUrl = 'maintenance-template';
const targetPageTemplate = 'maintenance.php';

decorateLog([
    'scrape',
    `wordpress ${sourceUrl}`,
    `to /${targetPageTemplate}`
]);

if (typeof baseURL === 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Failed. Please add $npm_package_config_wpdtrt_base_url_local to package.json');
}

axios({
    method: 'get',
    url: `${baseURL}/${sourceUrl}`,
    responseType: 'text',
    transformResponse: [ function (data) { // eslint-disable-line func-names
        const regexp = new RegExp(baseURL, 'g');
        let absoluteUrls = data.replace(regexp, '');

        return absoluteUrls;
    } ]
})
    .then(function (response) { // eslint-disable-line func-names
        let timeStamp = '\r\n';
        timeStamp += `<!-- Scraped from ${baseURL}${sourceUrl} on ${response.headers.date}, by wpdtrt-npm-scripts -->`;

        fs.writeFileSync(`../../${targetPageTemplate}`, response.data + timeStamp, {
            encoding: 'utf8'
        });
    })
    .catch(function (error) { // eslint-disable-line func-names
        // eslint-disable-next-line no-console
        console.log(error);
    });
