/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { join, resolve } = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  externals: [
    nodeExternals({
      allowlist: [/^@motech-development\/[A-z]*$/],
    }),
    nodeExternals({
      allowlist: [/^@motech-development\/[A-z]*$/],
      modulesDir: resolve(__dirname, '../../../node_modules'),
    }),
  ],
  mode: 'production',
  module: {
    rules: [
      {
        loader: 'cache-loader',
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        resolve: {
          mainFields: ['main'],
        },
        test: /@octokit\/(.*?)/,
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
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
};
