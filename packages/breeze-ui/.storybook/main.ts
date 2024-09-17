import { dirname, join } from 'node:path';
import { StorybookConfig } from '@storybook/react-vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-knobs'),
    '@chromatic-com/storybook',
  ],
  docs: {},
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  stories: ['../src/**/*.@(mdx|stories.@(jsx|tsx))'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
