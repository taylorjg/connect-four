/* eslint-env node */

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')
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
      { context: './web-app', from: '*.css' },
      { context: './web-app', from: '*.gif' }
    ]),
    new HtmlWebpackPlugin({
      template: './web-app/index.html',
      filename: path.resolve(distFolder, 'index.html'),
      version
    }),
    new WorkerPlugin()
  ],
  devtool: 'source-map'
}
