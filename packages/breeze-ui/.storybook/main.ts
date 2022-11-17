module.exports = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-knobs'],
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.@(jsx|mdx|tsx)'],
};
