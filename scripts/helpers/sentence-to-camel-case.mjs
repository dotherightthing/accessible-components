/**
 * @file ./helpers/helpers/sentence-to-camel-case.mjs
 */

/**
 * @function sentenceToCamelCase
 * @param {string} sentence - One sentence
 * @returns {string} OneSentence
 */
const sentenceToCamelCase = (sentence) => {
    let s = sentence;
    // 'foo bar'  -> ['foo', 'bar']
    let sArray = s.split(/ /g);
    // ['foo', 'bar']  -> ['Foo', 'Bar']
    sArray = sArray.map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    // ['Foo', 'Bar'] -> 'FooBar'
    const UpperCamelCase = sArray.join('');

    return UpperCamelCase;
};

export { sentenceToCamelCase as default };
