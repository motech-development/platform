import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/**/*.d.ts', 'src/integration/*.integration.ts'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    environment: 'node',
    fileParallelism: false,
    globals: true,
    include: [
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    setupFiles: ['./src/setupTests.ts'],
  },
});
