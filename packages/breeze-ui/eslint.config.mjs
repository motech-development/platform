import config from '@motech-development/eslint-config-motech-react';
import { defineConfig } from 'eslint/config';
import logicalProperties from './lint/logical-properties.mjs';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'lib/**', 'storybook-static/**'],
  },
  config,
  {
    // Storybook configuration is dev-only tooling, so it may import devDependencies.
    files: ['.storybook/**/*.{ts,tsx}'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true, optionalDependencies: false },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      breeze: {
        rules: {
          'logical-properties': logicalProperties,
        },
      },
    },
    rules: {
      'breeze/logical-properties': 'error',
    },
  },
]);
