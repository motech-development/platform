import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginJest from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

function stripTsPlugin(name) {
  const config = compat.extends(name);

  delete config[0]?.plugins?.['@typescript-eslint'];
  delete config[0]?.languageOptions;

  return config;
}

export default [
  {
    extends: [
      js.configs.recommended,
      compat.extends('airbnb-base'),
      stripTsPlugin('@kesills/airbnb-typescript/base'),
      tseslint.configs.recommendedTypeChecked,
      eslintConfigPrettier,
    ],
    files: ['**/*.{mts,ts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'max-classes-per-file': ['error', 4],
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
    files: ['**/__tests__/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    plugins: {
      jest: pluginJest,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['**/codegen.ts', '**/setupTests.ts', '*.config.{mts,ts}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    extends: [
      js.configs.recommended,
      compat.extends('airbnb-base'),
      eslintConfigPrettier,
    ],
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'max-classes-per-file': ['error', 4],
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
    files: [
      '**/__tests__/*.{js,mjs}',
      '**/*.spec.{js,mjs}',
      '**/*.test.{js,mjs}',
    ],
    plugins: {
      jest: pluginJest,
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['**/setupTests.{js,mjs}', '*.config.{js,mjs}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['eslint.config.{js,mjs}'],
    settings: {
      'import/core-modules': ['eslint/config'],
    },
  },
];
