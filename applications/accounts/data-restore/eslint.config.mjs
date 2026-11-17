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
  {
    files: ['lib/__tests__/**/*.ts'],
    rules: {
      // CDK Template matchers assert by throwing.
      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'template.*'] },
      ],
    },
  },
]);
