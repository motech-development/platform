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
        'plugin:storybook/recommended',
        'prettier',
      ],
      files: ['*.mts', '*.ts', '*.tsx'],
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
            'codegen.ts',
            'setupTests.ts',
            '*.stories.ts',
            '*.stories.tsx',
            '*.config.mts',
            '*.config.ts',
          ],
          rules: {
            'import/no-extraneous-dependencies': 'off',
            'react/function-component-definition': 'off',
            'react/jsx-props-no-spreading': 'off',
          },
        },
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
      },
      plugins: ['@typescript-eslint', 'react', 'simple-import-sort'],
      rules: {
        ...overrides[0].rules,
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
      extends: [
        'eslint:recommended',
        'airbnb',
        'airbnb/hooks',
        'plugin:react/jsx-runtime',
        'plugin:storybook/recommended',
        'prettier',
      ],
      files: ['*.{js,jsx,mjs}'],
      overrides: [
        {
          extends: ['plugin:cypress/recommended'],
          files: ['cypress/**/*.{js,jsx,mjs}'],
          plugins: ['cypress'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          extends: ['plugin:jest/recommended'],
          files: ['**/__tests__/*.{js,jsx,mjs}', '*.test.{js,jsx,mjs}'],
          plugins: ['jest'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: [
            'setupTests.{js,jsx,mjs}',
            '*.stories.{js,jsx,mjs}',
            '*.config.{js,ejs}',
          ],
          rules: {
            'import/no-extraneous-dependencies': 'off',
            'react/function-component-definition': 'off',
            'react/jsx-props-no-spreading': 'off',
          },
        },
      ],
      plugins: ['react', 'simple-import-sort'],
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
