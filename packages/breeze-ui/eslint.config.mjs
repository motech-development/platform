import config from '@motech-development/eslint-config-motech-react';
import { defineConfig } from 'eslint/config';
import logicalProperties from './lint/logical-properties.mjs';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'lib/**', 'storybook-static/**'],
  },
  config,
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
