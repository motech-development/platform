[npm]: https://img.shields.io/npm/v/@motech-development/prettier-motech-config
[npm-url]: https://www.npmjs.com/package/@motech-development/prettier-motech-config
[size]: https://packagephobia.now.sh/badge?p=@motech-development/prettier-motech-config
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/prettier-motech-config

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Motech Development Prettier config

> Reusable Prettier config

The shared Prettier config used by every workspace in this repository. See [docs/architecture.md](docs/architecture.md) for what it sets.

## Installation

```bash
yarn add -D @motech-development/prettier-motech-config prettier
```

Reference it from `.prettierrc.json`:

```json
"@motech-development/prettier-motech-config"
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/prettier-motech-config formatting
```

## Scripts

| Script                                                                 | Purpose        |
| ---------------------------------------------------------------------- | -------------- |
| `yarn workspace @motech-development/prettier-motech-config formatting` | Prettier check |
