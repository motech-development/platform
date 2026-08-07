import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
      'react-dom': fileURLToPath(
        new URL('./node_modules/react-dom', import.meta.url),
      ),
      'virtual:pwa-register': fileURLToPath(
        new URL('./src/__mocks__/pwa-register.ts', import.meta.url),
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  test: {
    coverage: {
      exclude: [
        'src/graphql/**',
        'src/routeTree.gen.ts',
        'src/service-worker.ts',
      ],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    deps: {
      optimizer: {
        client: {
          enabled: true,
          include: ['@motech-development/breeze-ui'],
        },
      },
    },
    environment: 'jsdom',
    fileParallelism: false,
    globals: true,
    include: [
      'infrastructure/**/*.test.ts',
      'scripts/**/*.test.ts',
      'src/**/*.test.{ts,tsx}',
    ],
    setupFiles: ['./src/setupTests.ts'],
  },
});
