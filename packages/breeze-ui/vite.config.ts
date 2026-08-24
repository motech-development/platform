import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const cabinPackageDirectory = dirname(
  require.resolve('@fontsource-variable/cabin/package.json'),
);
const distributionDirectory = resolve(import.meta.dirname, 'lib');
const externalPackages = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});

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
        resolve(cabinPackageDirectory, 'LICENSE'),
        resolve(distributionDirectory, 'Cabin-LICENSE.txt'),
      );
      copyFileSync(
        resolve(import.meta.dirname, 'src/styles/theme.css'),
        resolve(distributionDirectory, 'theme.css'),
      );
    },
  };
}

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        icons: './src/icons/index.tsx',
        index: './src/index.ts',
        reset: './src/styles/reset.css',
        styles: './src/styles/styles.css',
      },
      formats: ['es'],
    },
    outDir: 'lib',
    rolldownOptions: {
      external: (id) =>
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
  plugins: [tailwindcss(), react(), distributionAssetsPlugin()],
});
