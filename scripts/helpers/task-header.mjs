/**
 * @file ./helpers/helpers/task-header.mjs
 * @summary Helper functions to visually organise build logs.
 */

/**
 * @function taskHeader
 * @summary Displays a block comment for each task that runs.
 * @param {string} step - Step number
 * @param {string} taskCategory - Task category
 * @param {string} taskAction - Task action
 * @param {string} taskDetail - Task detail
 * @returns {string} String
 */
function taskHeader(
    step = '1/1',
    taskCategory = '',
    taskAction = '',
    taskDetail = ''
) {
    let str = '';
    str += '\n';
    str += '========================================\n';
    str += `${taskCategory} step ${step}:\n`;
    str += `=> ${taskAction}: ${taskDetail}\n`;
    str += '----------------------------------------\n';

    return str;
}

export { taskHeader as default };
