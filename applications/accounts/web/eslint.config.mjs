import config from '@motech-development/eslint-config-motech-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'src/graphql/**'],
  },
  config,
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: [
      'infrastructure/**/*.ts',
      'scripts/**/*.{ts,tsx}',
      'src/**/*.{ts,tsx}',
      'src/observability.ts',
      'src/router.tsx',
      'src/shell/**/*.tsx',
    ],
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: ['src/service-worker.ts'],
    rules: {
      'no-underscore-dangle': ['error', { allow: ['__WB_MANIFEST'] }],
    },
  },
]);
