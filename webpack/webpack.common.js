const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const srcDir = '../src/'

module.exports = {
  entry: {
    main: path.join(__dirname, srcDir + 'main.js'),
    background: path.join(__dirname, srcDir + 'background.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js']
    }),
    new CopyPlugin({
      patterns: [{ from: '.', to: path.join(__dirname, '../dist'), context: 'public' }],
      options: {}
    })
  ]
}
