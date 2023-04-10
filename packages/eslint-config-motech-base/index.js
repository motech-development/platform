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
      plugins: ['@typescript-eslint'],
      rules: {
        'max-classes-per-file': ['error', 4],
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
      files: ['*.js'],
      overrides: [
        {
          extends: ['plugin:jest/recommended'],
          files: ['**/__tests__/*.js', '*.spec.js', '*.test.js'],
          plugins: ['jest'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
        {
          files: ['setupTests.js', '*.config.js'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
      rules: {
        'max-classes-per-file': ['error', 4],
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
