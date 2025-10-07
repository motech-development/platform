import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    files: ['index.mjs'],
    settings: {
      'import/core-modules': ['eslint/config', 'typescript-eslint'],
    },
  },
]);
