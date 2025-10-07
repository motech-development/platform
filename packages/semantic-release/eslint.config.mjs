import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginJest from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  {
    extends: [
      js.configs.recommended,
      compat.extends('airbnb-base'),
      eslintConfigPrettier,
    ],
    files: ['**/*.{js,mjs}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^node:', '^@?\\w', '^', '^\\.', '^\\u0000']],
        },
      ],
      'sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          natural: false,
        },
      ],
    },
  },
  {
    extends: [pluginJest.configs['flat/recommended']],
    files: ['**/__tests__/*.js', '**/*.spec.js', '**/*.test.js'],
    plugins: {
      jest: pluginJest,
    },
  },
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
    settings: {
      'import/core-modules': ['eslint/config'],
    },
  },
]);
