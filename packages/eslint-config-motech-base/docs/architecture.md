# Base ESLint config architecture

## Purpose

The flat ESLint config shared by Node and TypeScript workspaces (`index.mjs`, the package `main`). `@motech-development/eslint-config-motech-react` builds on the same ideas for React workspaces. See the [repository architecture](../../../docs/architecture.md).

## What it composes

`index.mjs` default-exports an array of config objects, each scoped by `files`:

| Files                                                    | Extends                                                                                                                                                       | Extra rules / settings                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `**/*.{mts,ts}`                                          | `@eslint/js` recommended, `airbnb-base`, `@kesills/airbnb-typescript/base` (stripped), `typescript-eslint` `recommendedTypeChecked`, `eslint-config-prettier` | Shared rules below; type-aware parsing via `projectService`; `import/*` TypeScript resolver |
| `**/__tests__/*.ts`, `**/*.{spec,test}.ts`               | Vitest `env` + `recommended`                                                                                                                                  | `@typescript-eslint/unbound-method` and `import/no-extraneous-dependencies` off             |
| `**/codegen.ts`, `**/setupTests.ts`, `*.config.{mts,ts}` | Vitest `env`                                                                                                                                                  | `import/no-extraneous-dependencies` off                                                     |
| `**/*.{js,mjs}`                                          | `@eslint/js` recommended, `airbnb-base`, `eslint-config-prettier`                                                                                             | Shared rules below; `ecmaVersion: 'latest'`                                                 |
| JS test files (`__tests__`, `.spec`, `.test`)            | Vitest `env` + `recommended`                                                                                                                                  | `import/no-extraneous-dependencies` off                                                     |
| `**/setupTests.{js,mjs}`, `*.config.{js,mjs}`            | Vitest `env`                                                                                                                                                  | `import/no-extraneous-dependencies` off                                                     |
| `eslint.config.{js,mjs}`                                 | —                                                                                                                                                             | Treat `eslint/config` as a core module for `import/*` rules                                 |

Shared rules for TS and JS source:

- `max-classes-per-file`: at most 4.
- `simple-import-sort/imports` and `/exports`: one group ordered `node:` builtins, packages, absolute, relative, side-effect imports.
- `sort-keys`: ascending, case-sensitive, non-natural. This is why object keys across the repo are alphabetical.

## Why

- **Airbnb via `FlatCompat`**: `airbnb-base` and `@kesills/airbnb-typescript` are legacy (eslintrc) configs, so they are loaded through `@eslint/eslintrc`'s `FlatCompat`.
- **`stripTsPlugin`**: the Airbnb TypeScript config registers its own `@typescript-eslint` plugin and language options, which clash with those from `typescript-eslint`. The helper deletes both from the compat output so `typescript-eslint` owns them.
- **Prettier last** in each `extends`, so formatting rules never fight Prettier.
- **Test and config files** relax `import/no-extraneous-dependencies` because they import dev dependencies legitimately; `unbound-method` is off in tests because mocks are commonly referenced unbound in assertions.

## Usage requirements

Peer dependencies: `eslint` ^9.37.0 and `typescript` >=5.8.2 <6.1.0. TypeScript files are linted with type information, so the consuming project needs a `tsconfig.json` that includes them.

## Making changes

Rule changes affect every workspace; run `yarn lint` across affected workspaces before committing. The package only lints its own `index.mjs` (`yarn workspace @motech-development/eslint-config-motech-base lint`).

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
