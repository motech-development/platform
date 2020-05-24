/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { cpus } = require('os');
const { join } = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  mode: 'none',
  module: {
    rules: [
      {
        loader: 'cache-loader',
      },
      {
        loader: 'thread-loader',
        options: {
          workers: cpus().length - 1,
        },
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: join(__dirname, '.webpack'),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
};
