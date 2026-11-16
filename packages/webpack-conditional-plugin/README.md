[npm]: https://img.shields.io/npm/v/@motech-development/webpack-conditional-plugin
[npm-url]: https://www.npmjs.com/package/@motech-development/webpack-conditional-plugin
[size]: https://packagephobia.now.sh/badge?p=@motech-development/webpack-conditional-plugin
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/webpack-conditional-plugin

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Webpack conditional plugin

> A Webpack plugin to conditionally apply plugins

Wraps another webpack 5 plugin and applies it only when a condition holds. Used by `@core/anti-virus`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add -D @motech-development/webpack-conditional-plugin
```

```js
new WebpackConditionalPlugin(
  (compiler) => compiler.options.mode === 'production',
  new SomePlugin(),
);
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/webpack-conditional-plugin test-ci
```

## Scripts

| Script                                                                     | Purpose                  |
| -------------------------------------------------------------------------- | ------------------------ |
| `yarn workspace @motech-development/webpack-conditional-plugin build`      | Build to `lib/`          |
| `yarn workspace @motech-development/webpack-conditional-plugin test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/webpack-conditional-plugin test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/webpack-conditional-plugin lint`       | ESLint                   |
| `yarn workspace @motech-development/webpack-conditional-plugin typecheck`  | TypeScript check         |
| `yarn workspace @motech-development/webpack-conditional-plugin formatting` | Prettier check           |
