import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const cabinPackageDirectory = dirname(
  require.resolve('@fontsource-variable/cabin/package.json'),
);

function cabinAssetsPlugin(): Plugin {
  return {
    name: 'breeze-cabin-assets',
    writeBundle() {
      copyFileSync(
        resolve(cabinPackageDirectory, 'LICENSE'),
        resolve(import.meta.dirname, 'dist/Cabin-LICENSE.txt'),
      );
    },
  };
}

export default defineConfig({
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
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@internationalized\/date(?:\/.*)?$/,
        /^lucide-react(?:\/.*)?$/,
        /^react-aria(?:\/.*)?$/,
        /^react-aria-components(?:\/.*)?$/,
        'tailwind-merge',
        'tailwind-variants',
      ],
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
  },
  plugins: [tailwindcss(), react(), cabinAssetsPlugin()],
});
