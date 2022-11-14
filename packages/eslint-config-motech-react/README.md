[npm]: https://img.shields.io/npm/v/@motech-development/eslint-config-motech-react
[npm-url]: https://www.npmjs.com/package/@motech-development/eslint-config-motech-react
[size]: https://packagephobia.now.sh/badge?p=@motech-development/eslint-config-motech-react
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/eslint-config-motech-react

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Motech Development ESLint config for React apps

> Reusable ESLint config

# Installation

1. Install `@motech-development/eslint-config-motech-react` as a development dependency.

```bash
# Yarn
yarn add -D @motech-development/eslint-config-motech-react

# NPM
npm i -D @motech-development/eslint-config-motech-react
```

2. Extend your ESLint config.

```json
{
  "extends": "@motech-development/eslint-config-motech-react"
}
```

```js
module.exports = {
  extends: '@motech-development/eslint-config-motech-react',
};
```

3. Configure TypeScript by ensuring there is both a `tsconfig.json` and `tsconfig.eslint.json` file in your project. The latter config is for any additional files that are outside your TypeScript project that are picked up by ESLint.
