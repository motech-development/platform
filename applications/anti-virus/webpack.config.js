/* eslint-disable @typescript-eslint/no-var-requires */
const PermissionsOutputPlugin = require('@motech-development/webpack-permissions-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { cpus } = require('os');
const { join, resolve } = require('path');
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
    // TODO: Make this conditional
    new CopyPlugin([resolve('./src/freshclam.conf'), resolve('./bin')]),
    new PermissionsOutputPlugin({
      file: '755',
      folders: compiler => {
        const entries = Object.keys(compiler.options.entry);

        return entries.map(entry => {
          const handler = `${entry}.handler`;
          const functions = Object.keys(slsw.lib.serverless.service.functions);
          const name = functions.find(
            func =>
              slsw.lib.serverless.service.functions[func].handler === handler,
          );

          return join(__dirname, '.webpack', name);
        });
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
};
