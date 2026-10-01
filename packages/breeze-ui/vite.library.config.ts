import optimizeLocales from '@react-aria/optimize-locales-plugin';
import { esmExternalRequirePlugin, mergeConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };
import {
  createLocaleOutputBudgetPlugin,
  REACT_ARIA_LOCALES,
} from './scripts/locale-output-budget';
import baseConfig from './vite.config';

const externalPackages = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});
const bundledReactAriaPackages = ['react-aria', 'react-aria-components'];
const esmExternalRequirePackages = ['react'];

export default mergeConfig(baseConfig, {
  build: {
    rolldownOptions: {
      external: (id: string) =>
        !esmExternalRequirePackages.includes(id) &&
        !bundledReactAriaPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ) &&
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ),
    },
  },
  plugins: [
    {
      ...optimizeLocales.vite({ locales: [...REACT_ARIA_LOCALES] }),
      enforce: 'pre' as const,
    },
    esmExternalRequirePlugin({ external: esmExternalRequirePackages }),
    createLocaleOutputBudgetPlugin(),
  ],
});
