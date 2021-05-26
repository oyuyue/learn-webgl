const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

/**@type {import('webpack').Configuration} */
const config = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'index.min.js',
  },

  plugins: [
    new CleanWebpackPlugin(),
  ]
}

module.exports = merge(baseConfig, config)
