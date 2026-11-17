[npm]: https://img.shields.io/npm/v/@motech-development/semantic-release
[npm-url]: https://www.npmjs.com/package/@motech-development/semantic-release
[size]: https://packagephobia.now.sh/badge?p=@motech-development/semantic-release
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/semantic-release

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Motech Development Semantic Release config

> Reusable Semantic Release config

Shared semantic-release configs used by every workspace in this repository: `package` publishes to npm, `application` bumps the version and creates a GitHub release without publishing to npm. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add -D @motech-development/semantic-release
```

```json
{
  "extends": "@motech-development/semantic-release/package"
}
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/semantic-release test-ci
```

## Scripts

| Script                                                           | Purpose                  |
| ---------------------------------------------------------------- | ------------------------ |
| `yarn workspace @motech-development/semantic-release test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/semantic-release test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/semantic-release lint`       | ESLint                   |
| `yarn workspace @motech-development/semantic-release formatting` | Prettier check           |
