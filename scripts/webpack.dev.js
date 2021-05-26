const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

/**@type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: ['webpack-dev-server/client', path.resolve(__dirname, '../src/index.js')],

  devServer: {
    contentBase: [path.resolve(__dirname, '../src')],
    watchContentBase: true,
    liveReload: true,
    injectClient: false,
    host: '0.0.0.0'
  }
}

module.exports =  merge(baseConfig, config)
