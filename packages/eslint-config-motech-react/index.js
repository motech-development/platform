// eslint-disable-next-line import/no-extraneous-dependencies
const { rules } = require('@motech-development/eslint-config-motech-base');
const findWorkspaceRoot = require('find-yarn-workspace-root');

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
        tsconfigRootDir: findWorkspaceRoot(),
      },
      plugins: ['@typescript-eslint', 'jest'],
    },
  ],
  plugins: ['jest'],
  root: true,
  rules: {
    ...rules,
  },
};
