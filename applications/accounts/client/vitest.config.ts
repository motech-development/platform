import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@motech-development/appsync-apollo': resolve(
        import.meta.dirname,
        '../../../packages/appsync-apollo/lib/index.js',
      ),
      '@motech-development/auth': resolve(
        import.meta.dirname,
        '../../../packages/auth/lib/index.js',
      ),
      '@motech-development/axios-hooks': resolve(
        import.meta.dirname,
        '../../../packages/axios-hooks/lib/axios-hooks.js',
      ),
      '@motech-development/ga-web-vitals': resolve(
        import.meta.dirname,
        '../../../packages/ga-web-vitals/lib/ga-web-vitals.js',
      ),
      '@motech-development/query-string-hook': resolve(
        import.meta.dirname,
        '../../../packages/query-string-hook/lib/index.js',
      ),
    },
  },
  test: {
    coverage: {
      exclude: ['src/{index,i18n}.{ts,tsx}', 'src/**/*/index.{ts,tsx}'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    environment: 'jsdom',
    fileParallelism: false,
    globals: true,
    include: ['src/**/__tests__/**/*.{ts,tsx}'],
    mockReset: true,
    setupFiles: ['./src/setupTests.ts'],
    // TODO: Improve tests so that the timeout can be reduced.
    testTimeout: 30000,
  },
});
