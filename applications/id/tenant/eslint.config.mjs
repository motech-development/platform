import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    rules: {
      'global-require': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
]);
