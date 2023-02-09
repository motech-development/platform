// eslint-disable-next-line import/no-extraneous-dependencies
const { overrides } = require('@motech-development/eslint-config-motech-base');

module.exports = {
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
        'prettier',
      ],
      files: ['*.ts', '*.tsx'],
      overrides: [
        {
          // TODO: Add Cypress eslint rules
          files: ['cypress/**/*.ts'],
          parserOptions: {
            project: ['./cypress/tsconfig.eslint.json', './tsconfig.json'],
          },
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          extends: ['plugin:jest/recommended'],
          files: [
            '**/__tests__/*.ts',
            '*.test.ts',
            '**/__tests__/*.tsx',
            '*.test.tsx',
          ],
          plugins: ['jest'],
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
      plugins: ['@typescript-eslint', 'react'],
      rules: {
        ...overrides[0].rules,
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
    {
      extends: [
        'eslint:recommended',
        'airbnb',
        'airbnb/hooks',
        'plugin:react/jsx-runtime',
        'prettier',
      ],
      files: ['*.js', '*.jsx'],
      overrides: [
        {
          // TODO: Add Cypress eslint rules
          files: ['cypress/**/*.js'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          extends: ['plugin:jest/recommended'],
          files: [
            '**/__tests__/*.js',
            '*.test.js',
            '**/__tests__/*.jsx',
            '*.test.jsx',
          ],
          plugins: ['jest'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['setupTests.js'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['*.stories.js', '*.stories.jsx'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      plugins: ['react'],
      rules: {
        ...overrides[1].rules,
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
  root: true,
};
