[npm]: https://img.shields.io/npm/v/@motech-development/node-logger
[npm-url]: https://www.npmjs.com/package/@motech-development/node-logger
[size]: https://packagephobia.now.sh/badge?p=@motech-development/node-logger
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/node-logger

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Node logger

> Logger for NodeJS applications

A [winston](https://github.com/winstonjs/winston) logger whose console transport writes through `console.log` and `console.error`, so output reaches Lambda logs. Used by Node services in this repository. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/node-logger
```

```ts
import logger from '@motech-development/node-logger';

logger.info('Report created');
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/node-logger test-ci
```

## Scripts

| Script                                                      | Purpose                  |
| ----------------------------------------------------------- | ------------------------ |
| `yarn workspace @motech-development/node-logger build`      | Build to `lib/`          |
| `yarn workspace @motech-development/node-logger test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/node-logger test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/node-logger lint`       | ESLint                   |
| `yarn workspace @motech-development/node-logger typecheck`  | TypeScript check         |
| `yarn workspace @motech-development/node-logger formatting` | Prettier check           |
