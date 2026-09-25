import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/**/*.stories.tsx', 'src/**/*.d.ts', 'src/index.ts'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    projects: [
      {
        plugins: [react()],
        test: {
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        plugins: [
          tailwindcss(),
          storybookTest({
            configDir: resolve(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
          },
          // Focus, keyboard, and portalled stories share browser document state.
          fileParallelism: false,
          name: 'storybook',
        },
      },
    ],
  },
});
