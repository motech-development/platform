import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    rules: {
      'import/prefer-default-export': 'off',
      'no-new': 'off',
    },
  },
]);
