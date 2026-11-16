[npm]: https://img.shields.io/npm/v/@motech-development/yarn-plugin-dedupe
[npm-url]: https://www.npmjs.com/package/@motech-development/yarn-plugin-dedupe
[size]: https://packagephobia.now.sh/badge?p=@motech-development/yarn-plugin-dedupe
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/yarn-plugin-dedupe

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Yarn plugin dedupe

> Run Yarn dedupe after every installation

A Yarn 4 plugin that runs `yarn dedupe` after an install when duplicates are found. This repository loads it from `.yarnrc.yml`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

Add it to `.yarnrc.yml`:

```yaml
plugins:
  - path: .yarn/plugins/@motech-development/plugin-dedupe.cjs
    spec: packages/yarn-plugin-dedupe/index.js
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/yarn-plugin-dedupe lint
```

## Scripts

| Script                                                             | Purpose        |
| ------------------------------------------------------------------ | -------------- |
| `yarn workspace @motech-development/yarn-plugin-dedupe lint`       | ESLint         |
| `yarn workspace @motech-development/yarn-plugin-dedupe formatting` | Prettier check |
