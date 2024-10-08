import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  const {
    PORT = '3000',
    PUBLIC_URL = '/',
    ...env
  } = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';

  return {
    base: PUBLIC_URL,
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    define: {
      ...(isBuild
        ? {}
        : {
            global: 'globalThis',
          }),
      'process.env': `(${JSON.stringify(env)})`,
    },
    plugins: [
      react(),
      eslint({
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      }),
      checker({
        typescript: true,
      }),
      VitePWA({
        devOptions: {
          navigateFallback: 'index.html',
        },
        filename: 'service-worker.ts',
        registerType: 'autoUpdate',
        srcDir: 'src',
        strategies: 'injectManifest',
      }),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'motech-development-206deb70e',
        project: 'accounts-client',
      }),
    ],
    preview: {
      host: true,
      port: parseInt(PORT, 10),
    },
    server: {
      host: true,
      open: true,
      port: parseInt(PORT, 10),
    },
  };
});
