const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { join, resolve } = require('node:path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  externals: [
    nodeExternals({
      allowlist: [/^@motech-development\/[^/]*$/],
    }),
    nodeExternals({
      allowlist: [/^@motech-development\/[^/]*$/],
      modulesDir: resolve(__dirname, '../../../node_modules'),
    }),
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'swc-loader',
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
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
};
