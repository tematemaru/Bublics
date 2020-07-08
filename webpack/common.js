const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.APP_ENV === 'development';

module.exports = {
  context: path.resolve(process.cwd()),
  output: {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '/',
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    pathinfo: false,
  },
  module: {
    rules: require('./loaders'),
  },
  plugins: [
    new StyleLintPlugin({ failOnError: false }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      APP_ENV: JSON.stringify(process.env.APP_ENV || 'development'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'src/html/index.html'),
      title: 'Sloy',
    }),
  ],
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json'],
    alias: require('./alias'),
  },
  stats: {
    entrypoints: false,
  },
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
