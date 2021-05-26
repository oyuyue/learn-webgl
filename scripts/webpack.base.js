const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


/**@type {import('webpack').Configuration} */
module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    })
  ]
}
