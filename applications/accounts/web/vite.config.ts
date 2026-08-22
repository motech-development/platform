import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, normalizePath } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import authentication from './src/locales/en-GB/authentication.json';
import shell from './src/locales/en-GB/shell.json';

const require = createRequire(import.meta.url);
const pdfDistributionDirectory = dirname(
  require.resolve('pdfjs-dist/package.json'),
);
const pdfCMapsDirectory = normalizePath(
  join(pdfDistributionDirectory, 'cmaps'),
);
const pdfStandardFontsDirectory = normalizePath(
  join(pdfDistributionDirectory, 'standard_fonts'),
);
const ssrInlinedReactDependencies = [
  'lucide-react',
  'react-aria',
  'react-aria-components',
  'react-stately',
  'use-sync-external-store',
];
const reactAliases = {
  react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
  'react-dom': fileURLToPath(
    new URL('./node_modules/react-dom', import.meta.url),
  ),
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const release = env.VITE_COMMIT_SHA || 'local';
  const uploadSentrySourceMaps = Boolean(
    env.SENTRY_AUTH_TOKEN && release !== 'local',
  );
  const sentry = sentryTanstackStart({
    authToken: env.SENTRY_AUTH_TOKEN,
    org: 'motech-development-206deb70e',
    project: 'accounts-web',
    release: { name: release },
    silent: !uploadSentrySourceMaps,
    sourcemaps: {
      assets: './dist/client/assets/**',
      disable: uploadSentrySourceMaps ? false : 'disable-upload',
      filesToDeleteAfterUpload: './dist/client/**/*.map',
    },
    telemetry: uploadSentrySourceMaps,
  });

  return {
    build: {
      sourcemap: 'hidden',
    },
    define: {
      global: 'globalThis',
    },
    environments: {
      client: {
        resolve: {
          // Linked Breeze packages must use the application's React instance.
          alias: reactAliases,
          dedupe: ['react', 'react-dom'],
        },
      },
      ssr: {
        optimizeDeps: {
          // Convert the CommonJS shim without bundling a second React instance.
          exclude: ['react'],
          include: ['use-sync-external-store/shim/index.js'],
        },
        resolve: {
          dedupe: ['react', 'react-dom', 'use-sync-external-store'],
          noExternal: ssrInlinedReactDependencies,
        },
      },
    },
    optimizeDeps: {
      include: ['@motech-development/breeze-ui'],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        router: {
          quoteStyle: 'single',
          semicolons: true,
        },
        spa: {
          enabled: true,
          prerender: {
            outputPath: '/_shell',
          },
        },
      }),
      react(),
      viteStaticCopy({
        targets: [
          {
            dest: 'cmaps',
            rename: { stripBase: true },
            src: `${pdfCMapsDirectory}/*`,
          },
          {
            dest: 'standard_fonts',
            rename: { stripBase: true },
            src: `${pdfStandardFontsDirectory}/*`,
          },
        ],
      }),
      VitePWA({
        devOptions: {
          enabled: false,
        },
        filename: 'service-worker.ts',
        manifest: {
          background_color: '#eef1f5',
          description:
            authentication[
              'A focused company ledger for confirmed sales, balances and VAT.'
            ],
          display: 'standalone',
          icons: [
            {
              purpose: 'any',
              sizes: '192x192',
              src: '/manifest-icon-192.png',
              type: 'image/png',
            },
            {
              purpose: 'any',
              sizes: '512x512',
              src: '/manifest-icon-512.png',
              type: 'image/png',
            },
            {
              purpose: 'maskable',
              sizes: '192x192',
              src: '/manifest-maskable-icon-192.png',
              type: 'image/png',
            },
            {
              purpose: 'maskable',
              sizes: '512x512',
              src: '/manifest-maskable-icon-512.png',
              type: 'image/png',
            },
          ],
          name: authentication['Accounts by Motech Development'],
          scope: '/',
          short_name: shell.Accounts,
          start_url: '/',
          theme_color: '#151c2b',
        },
        registerType: 'autoUpdate',
        srcDir: 'src',
        strategies: 'injectManifest',
      }),
      sentry,
    ],
    preview: {
      host: true,
      port: Number(env.PORT || 3000),
      strictPort: true,
    },
    server: {
      host: true,
      port: Number(env.PORT || 3000),
      strictPort: true,
    },
  };
});
