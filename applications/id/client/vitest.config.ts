import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@motech-development/axios-hooks': resolve(
        import.meta.dirname,
        '../../../packages/axios-hooks/lib/axios-hooks.js',
      ),
      '@motech-development/ga-web-vitals': resolve(
        import.meta.dirname,
        '../../../packages/ga-web-vitals/lib/ga-web-vitals.js',
      ),
    },
  },
  test: {
    coverage: {
      exclude: ['src/{index,i18n}.{ts,tsx}', 'src/**/*/index.{ts,tsx}'],
      include: ['hooks/**/*.js', 'rules/**/*.js', 'src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    environment: 'jsdom',
    fileParallelism: false,
    globals: true,
    include: ['src/**/__tests__/**/*.{ts,tsx}'],
    setupFiles: ['./src/setupTests.ts'],
  },
});
