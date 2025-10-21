import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigMotechBase from '@motech-development/eslint-config-motech-base';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginReact from 'eslint-plugin-react';
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
      compat.extends('airbnb'),
      compat.extends('airbnb/hooks'),
      stripTsPlugin('@kesills/airbnb-typescript'),
      tseslint.configs.recommendedTypeChecked,
      pluginReact.configs.flat['jsx-runtime'],
      eslintConfigPrettier,
    ],
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: pluginReact,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...eslintConfigMotechBase[0].rules,
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      'react/require-default-props': 'off',
    },
  },
  {
    files: ['**/e2e/**/*.{mts,ts}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'no-empty-pattern': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ...eslintConfigMotechBase[1],
    files: [
      '**/__tests__/*.{mts,ts,tsx}',
      '**/*.spec.{mts,ts,tsx}',
      '**/*.test.{mts,ts,tsx}',
    ],
  },
  eslintConfigMotechBase[2],
  {
    ...eslintConfigMotechBase[2],
    files: ['**/*.stories.{mts,ts,tsx}'],
  },
  {
    extends: [
      js.configs.recommended,
      compat.extends('airbnb'),
      compat.extends('airbnb/hooks'),
      pluginReact.configs.flat['jsx-runtime'],
      eslintConfigPrettier,
    ],
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
    },
    plugins: {
      react: pluginReact,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...eslintConfigMotechBase[3].rules,
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
    },
  },
  {
    files: ['**/e2e/**/*.{js,mjs}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'no-empty-pattern': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ...eslintConfigMotechBase[4],
    files: [
      '**/__tests__/*.{js,jsx,mjs}',
      '**/*.spec.{js,jsx,mjs}',
      '**/*.test.{js,jsx,mjs}',
    ],
  },
  eslintConfigMotechBase[5],
  {
    ...eslintConfigMotechBase[5],
    files: ['**/*.stories.{js,jsx,mjs}', '*.config.{js,mjs}'],
  },
  eslintConfigMotechBase[6],
];
