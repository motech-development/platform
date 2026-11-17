[npm]: https://img.shields.io/npm/v/@motech-development/webpack-permissions-plugin
[npm-url]: https://www.npmjs.com/package/@motech-development/webpack-permissions-plugin
[size]: https://packagephobia.now.sh/badge?p=@motech-development/webpack-permissions-plugin
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/webpack-permissions-plugin

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Webpack permissions plugin

> A Webpack plugin to set permissions for your output files and folders

Sets the file mode of every file directly in chosen folders (not subfolders) once a webpack 5 build finishes. Used by `@core/anti-virus`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add -D @motech-development/webpack-permissions-plugin
```

```js
new WebpackPermissionsPlugin({
  file: '755',
  folders: (compiler) => [`${compiler.options.output.path}/bin`],
});
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/webpack-permissions-plugin test-ci
```

## Scripts

| Script                                                                     | Purpose                  |
| -------------------------------------------------------------------------- | ------------------------ |
| `yarn workspace @motech-development/webpack-permissions-plugin build`      | Build to `lib/`          |
| `yarn workspace @motech-development/webpack-permissions-plugin test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/webpack-permissions-plugin test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/webpack-permissions-plugin lint`       | ESLint                   |
| `yarn workspace @motech-development/webpack-permissions-plugin typecheck`  | TypeScript check         |
| `yarn workspace @motech-development/webpack-permissions-plugin formatting` | Prettier check           |
