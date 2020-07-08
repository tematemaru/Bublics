const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = require('./common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  cache: false,
  entry: path.resolve(process.cwd(), 'src/js/index.js'),
  plugins: [new webpack.HashedModuleIdsPlugin()],
});
