// eslint-disable-next-line import/no-extraneous-dependencies
const { rules } = require('@motech-development/eslint-config-motech-base');

module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'plugin:jest/recommended',
    'prettier',
  ],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/jsx-runtime',
        'plugin:jest/recommended',
        'prettier',
      ],
      files: ['*.ts', '*.tsx'],
      overrides: [
        {
          files: [
            '**/__tests__/*.ts',
            '*.test.ts',
            '**/__tests__/*.tsx',
            '*.test.tsx',
          ],
          rules: {
            '@typescript-eslint/unbound-method': 'off',
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['setupTests.ts'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['*.stories.ts', '*.stories.tsx'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
      },
      plugins: ['@typescript-eslint', 'jest'],
      rules: {
        // TODO: Enable this rule
        'react/function-component-definition': [
          'off',
          {
            namedComponents: ['function-declaration', 'function-expression'],
            unnamedComponents: 'function-expression',
          },
        ],
        'react/jsx-no-useless-fragment': [
          'error',
          {
            allowExpressions: true,
          },
        ],
        // TODO: Enable this rule
        'react/prop-types': 'off',
      },
    },
  ],
  plugins: ['jest'],
  root: true,
  rules: {
    ...rules,
  },
};
