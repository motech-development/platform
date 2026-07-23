import config from '@motech-development/eslint-config-motech-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'lib/**', 'storybook-static/**'],
  },
  config,
]);
