import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
    },
  },
]);
