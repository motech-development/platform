import config from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['cdk.out/**', 'coverage/**', 'dist/**'] },
  config,
  {
    files: ['infrastructure/**/*.ts'],
    rules: { 'import/prefer-default-export': 'off' },
  },
]);
