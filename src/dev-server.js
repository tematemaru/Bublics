const express = require('express');
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack');

const app = express();

const compiler = webpack(webpackConfig);

compiler.apply(new webpack.ProgressPlugin());

app.use(
  devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    quiet: true,
    noInfo: true,
    stats: 'minimal',
  })
);

app.use(
  hotMiddleware(compiler, {
    log: false,
  })
);

app.use(express.static(path.resolve(process.cwd(), 'public')));

if (process.env.PORT) {
  app.listen(process.env.PORT, err => {
    const url = `http://localhost:${process.env.PORT}`;

    if (err) {
      console.error(`==> 😭  OMG!!! ${err}`);
    }

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));
  });
} else {
  console.error(
    chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified')
  );
}
