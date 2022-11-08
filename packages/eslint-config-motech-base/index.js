// eslint-disable-next-line @typescript-eslint/no-var-requires
const findWorkspaceRoot = require('find-yarn-workspace-root');

module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:jest/recommended',
    'prettier',
  ],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'prettier',
      ],
      files: ['*.ts'],
      overrides: [
        {
          files: ['**/__tests__/*.ts', '*.test.ts'],
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
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
        tsconfigRootDir: findWorkspaceRoot(),
      },
      plugins: ['@typescript-eslint', 'jest'],
    },
  ],
  root: true,
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
};
