import { defineConfig } from 'eslint/config';
import config from './index.mjs';

export default defineConfig([
  config,
  {
    files: ['index.mjs'],
    settings: {
      'import/core-modules': ['eslint/config', 'typescript-eslint'],
    },
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          mjs: 'always',
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs', '.ts', '.mts', '.tsx'],
        },
      },
    },
  },
]);
