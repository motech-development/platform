import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'infrastructure/**/*.test.ts',
        'infrastructure/**/*.fixture.ts',
      ],
      include: ['infrastructure/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    environment: 'node',
    globals: true,
    include: ['infrastructure/**/*.test.ts'],
  },
});
