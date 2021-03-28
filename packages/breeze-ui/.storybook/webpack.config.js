const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
    }),
  );

  return config;
};
