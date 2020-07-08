const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(process.cwd(), 'src/js/index.js'),
  ],
  cache: true,
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
