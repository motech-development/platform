import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import optimizeLocales from '@react-aria/optimize-locales-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin, UserConfig } from 'vite';
import { defineConfig, esmExternalRequirePlugin } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const fontPackageDirectory = dirname(
  require.resolve('@fontsource-variable/public-sans/package.json'),
);
const distributionDirectory = resolve(import.meta.dirname, 'lib');
const externalPackages = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});
const esmExternalRequirePackages = ['react'];
const bundledReactAriaPackages = ['react-aria', 'react-aria-components'];
const bundledDependencyLicenses = [
  { fileName: 'LICENSE', packageName: '@internationalized/number' },
  { fileName: 'LICENSE', packageName: '@internationalized/string' },
  { fileName: 'license', packageName: 'clsx' },
  { fileName: 'LICENSE', packageName: 'react-aria' },
  { fileName: 'LICENSE', packageName: 'react-aria-components' },
  { fileName: 'LICENSE', packageName: 'react-stately' },
  { fileName: 'LICENSE', packageName: 'use-sync-external-store' },
];
const appliesToLibraryBuild = (config: UserConfig) =>
  Boolean(config.build?.lib);

const esmExternalRequire = Object.assign(
  esmExternalRequirePlugin({ external: esmExternalRequirePackages }),
  { apply: appliesToLibraryBuild },
);

function distributionAssetsPlugin(): Plugin {
  return {
    name: 'breeze-distribution-assets',
    writeBundle(outputOptions) {
      if (
        !outputOptions.dir ||
        resolve(import.meta.dirname, outputOptions.dir) !==
          distributionDirectory
      ) {
        return;
      }

      copyFileSync(
        resolve(fontPackageDirectory, 'LICENSE'),
        resolve(distributionDirectory, 'Public-Sans-LICENSE.txt'),
      );

      bundledDependencyLicenses.forEach(({ fileName, packageName }) => {
        let packageDirectory = dirname(require.resolve(packageName));

        while (packageDirectory !== dirname(packageDirectory)) {
          const packageJsonPath = resolve(packageDirectory, 'package.json');

          if (existsSync(packageJsonPath)) {
            const installedPackage = JSON.parse(
              readFileSync(packageJsonPath, 'utf8'),
            ) as { name?: string };

            if (installedPackage.name === packageName) {
              const outputDirectory = resolve(
                distributionDirectory,
                'licenses',
                packageName,
              );
              mkdirSync(outputDirectory, { recursive: true });
              copyFileSync(
                resolve(packageDirectory, fileName),
                resolve(outputDirectory, fileName),
              );

              return;
            }
          }

          packageDirectory = dirname(packageDirectory);
        }

        throw new Error(`Unable to locate package root for ${packageName}`);
      });
    },
  };
}

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: './src/index.ts',
        reset: './src/styles/reset.css',
        styles: './src/styles/styles.css',
      },
      formats: ['es'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
        !esmExternalRequirePackages.includes(id) &&
        !bundledReactAriaPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ) &&
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`),
        ),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.includes('reset.css')) {
            return 'reset.css';
          }

          if (assetInfo.names.includes('styles.css')) {
            return 'styles.css';
          }

          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
    react(),
    distributionAssetsPlugin(),
    {
      ...optimizeLocales.vite({ locales: ['en'] }),
      apply: appliesToLibraryBuild,
      enforce: 'pre' as const,
    },
    esmExternalRequire,
  ],
});
