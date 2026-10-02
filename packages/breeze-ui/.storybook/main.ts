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
    // Pre-bundle every react-aria and react-aria-components subpath that `src` imports.
    // A missing one is discovered mid-run on a cold cache, and the resulting
    // re-optimisation reloads the page and fails the stories that were running.
    // Keep this list in step with the imports.
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [
        ...(viteConfig.optimizeDeps?.include ?? []),
        'react-aria-components/Button',
        'react-aria-components/Calendar',
        'react-aria-components/Checkbox',
        'react-aria-components/ComboBox',
        'react-aria-components/Dialog',
        'react-aria-components/FieldError',
        'react-aria-components/GridList',
        'react-aria-components/Group',
        'react-aria-components/I18nProvider',
        'react-aria-components/Input',
        'react-aria-components/Label',
        'react-aria-components/ListBox',
        'react-aria-components/Menu',
        'react-aria-components/Modal',
        'react-aria-components/NumberField',
        'react-aria-components/Popover',
        'react-aria-components/ProgressBar',
        'react-aria-components/Select',
        'react-aria-components/Text',
        'react-aria-components/TextField',
        'react-aria-components/ToggleButton',
        'react-aria-components/ToggleButtonGroup',
        'react-aria-components/slots',
        'react-aria/FocusScope',
        'react-aria/PortalProvider',
        'react-aria/useObjectRef',
        'react-aria/usePreventScroll',
        'react-dom',
      ],
    },
  }),
};

export default config;
