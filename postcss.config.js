module.exports = {
  plugins: [
    require('postcss-custom-properties')( {
      importFrom: `css/${require('./package.json').name}-variables.css`,
      preserve: true
    } ),
    require('autoprefixer')( {
      cascade: false
    } ),
    require('postcss-pxtorem')( {
      rootValue: 16,
      unitPrecision: 5,
      propList: [
        'font',
        'font-size',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'bottom',
        'top',
        'max-width'
      ],
      selectorBlackList: [],
      replace: false,
      mediaQuery: true,
      minPixelValue: 0
    } ),
    require('postcss-typescale')
  ]
}
