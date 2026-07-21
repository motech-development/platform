import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import normaliseComponentManifests from './component-manifest-preset.js';

interface ManifestStorybookConfig extends StorybookConfig {
  experimental_manifests: typeof normaliseComponentManifests;
}

const config: ManifestStorybookConfig = {
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  experimental_manifests: normaliseComponentManifests,
  features: {
    componentsManifest: true,
  },
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      exclude: ['**/.storybook/**'],
      tsconfigPath: resolve(import.meta.dirname, '../tsconfig.json'),
    },
  },
  viteFinal: (viteConfig, { configType }) => ({
    ...viteConfig,
    define: {
      ...viteConfig.define,
      'process.env.NODE_ENV': JSON.stringify(
        configType === 'PRODUCTION' ? 'production' : 'development',
      ),
      'process.env.VIRT_ON': JSON.stringify('1'),
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [
        ...(viteConfig.optimizeDeps?.include ?? []),
        'react-aria/PortalProvider',
        'react-aria-components/Dialog',
        'react-aria-components/GridList',
        'react-aria-components/Modal',
        'react-aria-components/Popover',
        'react-aria-components/ProgressBar',
        'react-aria-components/Table',
        'react-aria-components/Toast',
        'react-aria-components/Tooltip',
        'react-aria-components/Virtualizer',
        'react-dom',
      ],
    },
  }),
};

export default config;
