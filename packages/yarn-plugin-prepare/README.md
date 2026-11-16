[npm]: https://img.shields.io/npm/v/@motech-development/yarn-plugin-prepare
[npm-url]: https://www.npmjs.com/package/@motech-development/yarn-plugin-prepare
[size]: https://packagephobia.now.sh/badge?p=@motech-development/yarn-plugin-prepare
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/yarn-plugin-prepare

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Yarn plugin prepare

> Run Yarn prepare after every installation

A Yarn 4 plugin that runs `yarn prepare` after every install. This repository loads it from `.yarnrc.yml`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

Add it to `.yarnrc.yml`:

```yaml
plugins:
  - path: .yarn/plugins/@motech-development/plugin-prepare.cjs
    spec: packages/yarn-plugin-prepare/index.js
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/yarn-plugin-prepare lint
```

## Scripts

| Script                                                              | Purpose        |
| ------------------------------------------------------------------- | -------------- |
| `yarn workspace @motech-development/yarn-plugin-prepare lint`       | ESLint         |
| `yarn workspace @motech-development/yarn-plugin-prepare formatting` | Prettier check |
