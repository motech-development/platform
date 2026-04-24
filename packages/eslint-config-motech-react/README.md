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

```js
import config from '@motech-development/eslint-config-motech-react';
import { defineConfig } from 'eslint/config';

export default defineConfig(config);
```

3. Configure TypeScript by ensuring there is a `tsconfig.json` file in your project.
