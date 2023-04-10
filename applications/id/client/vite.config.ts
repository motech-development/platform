import dns from 'dns';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

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
        cache: true,
        cacheLocation: '.eslintcache',
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      }),
      checker({
        typescript: true,
      }),
    ],
    preview: {
      port: parseInt(PORT, 10),
    },
    server: {
      open: true,
      port: parseInt(PORT, 10),
    },
  };
});
