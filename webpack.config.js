/* eslint-env node */

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { version } = require('./package.json')

const distFolder = path.join(__dirname, 'dist')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './web-app/index.js',
  output: {
    path: distFolder,
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './web-app', from: '*.css' }
    ]),
    new HtmlWebpackPlugin({
      template: './web-app/index.html',
      filename: path.resolve(distFolder, 'index.html'),
      version
    })
  ],
  devtool: 'source-map'
}
