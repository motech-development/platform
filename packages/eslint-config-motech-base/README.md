[npm]: https://img.shields.io/npm/v/@motech-development/eslint-config-motech-base
[npm-url]: https://www.npmjs.com/package/@motech-development/eslint-config-motech-base
[size]: https://packagephobia.now.sh/badge?p=@motech-development/eslint-config-motech-base
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/eslint-config-motech-base

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Motech Development base ESLint config

> Reusable ESLint config

# Installation

1. Install `@motech-development/eslint-config-motech-base` as a development dependency.

```bash
# Yarn
yarn add -D @motech-development/eslint-config-motech-base

# NPM
npm i -D @motech-development/eslint-config-motech-base
```

2. Extend your ESLint config.

```js
import base from '@motech-development/eslint-config-motech-base';
import { defineConfig } from 'eslint/config';

export default defineConfig(base);
```

3. Configure TypeScript by ensuring there is a `tsconfig.json` file in your project.
