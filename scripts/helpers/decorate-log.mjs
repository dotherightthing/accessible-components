/**
 * @file ./helpers/helpers/decorate-log.mjs
 * @summary Functions relating to styling logged messages.
 */

/**
 * @function decorateLog
 * @summary Log a Gulp task result with emoji and colour.
 * @param {Function} color - gulp-color
 * @param {Function} log - gulp-log
 * @param {object} filePath, messageCount, warningCount, errorCount
 * @returns {string} decorated string
 */
function decorateLog(color, log, {
    textstring = '',
    messageCount = 0,
    warningCount = 0,
    errorCount = 0
} = {}) {
    const colors = {
        pass: 'GREEN',
        message: 'WHITE',
        warning: 'YELLOW',
        error: 'RED'
    };
    const emojis = {
        pass: '✔',
        message: '💬',
        warning: '⚠️',
        error: '✖'
    };
    let state;

    if (errorCount > 0) {
        state = 'error';
    } else if (warningCount > 0) {
        state = 'warning';
    } else if (messageCount > 0) {
        state = 'message';
    } else {
        state = 'pass';
    }

    const iconStr = `${emojis[state]} ${textstring}`;

    return (
        color(iconStr, `${colors[state]}`)
    );
}

export { decorateLog as default };
