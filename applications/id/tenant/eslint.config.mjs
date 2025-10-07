import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  config,
  {
    languageOptions: {
      globals: {
        UnauthorizedError: 'readonly',
        auth0: 'readonly',
      },
    },
    rules: {
      'global-require': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
]);
