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
          extends: ['plugin:cypress/recommended'],
          files: ['cypress/**/*.ts'],
          parserOptions: {
            project: ['./cypress/tsconfig.eslint.json', './tsconfig.json'],
          },
          plugins: ['cypress'],
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
          files: [
            'setupTests.ts',
            '*.stories.ts',
            '*.stories.tsx',
            '*.config.ts',
          ],
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
        'react/jsx-no-useless-fragment': [
          'error',
          {
            allowExpressions: true,
          },
        ],
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
          extends: ['plugin:cypress/recommended'],
          files: ['cypress/**/*.js'],
          plugins: ['cypress'],
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
          files: [
            'setupTests.js',
            '*.stories.js',
            '*.stories.jsx',
            '*.config.js',
          ],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      plugins: ['react'],
      rules: {
        ...overrides[1].rules,
        'react/jsx-no-useless-fragment': [
          'error',
          {
            allowExpressions: true,
          },
        ],
      },
    },
  ],
  root: true,
};
