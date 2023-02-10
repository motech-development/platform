module.exports = {
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  overrides: [
    {
      extends: ['plugin:jest/recommended'],
      files: ['**/__tests__/*.js', '*.spec.js', '*.test.js'],
      plugins: ['jest'],
    },
  ],
  root: true,
  rules: {
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
