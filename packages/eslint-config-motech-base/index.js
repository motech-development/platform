module.exports = {
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      files: ['*.ts'],
      overrides: [
        {
          extends: ['plugin:jest/recommended'],
          files: ['**/__tests__/*.ts', '*.spec.ts', '*.test.ts'],
          plugins: ['jest'],
          rules: {
            '@typescript-eslint/unbound-method': 'off',
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['setupTests.ts', '*.config.ts'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
      },
      plugins: ['@typescript-eslint', 'simple-import-sort'],
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
      extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
      files: ['*.{js,mjs}'],
      overrides: [
        {
          extends: ['plugin:jest/recommended'],
          files: [
            '**/__tests__/*.{js,mjs}',
            '*.spec.{js,mjs}',
            '*.test.{js,mjs}',
          ],
          plugins: ['jest'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['setupTests.{js,mjs}', '*.config.{js,mjs}'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      plugins: ['simple-import-sort'],
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
  ],
  root: true,
};
