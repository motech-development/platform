const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { resolve } = require('path');

module.exports = {
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
          postcssOptions: {
            config: resolve(__dirname, '../postcss.config.js'),
          },
        },
      },
    },
  ],
  stories: ['../src/stories/*.stories.@(jsx|mdx|tsx)'],
  webpackFinal: (config) => {
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      }),
    );

    return config;
  },
};
