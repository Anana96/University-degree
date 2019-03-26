const path = require('path');
module.exports = {
    mode: 'development',
    entry: { main: './Scripts/myscripts/games/index.js' },
    output: {
        path: path.resolve(__dirname, './Scripts/build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env']
                ]
              }
            }]
          }
        ]
      }
};