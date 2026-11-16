# ESLint config for React architecture

## Purpose

A shared ESLint 9 flat config for React and TypeScript workspaces in this monorepo (for example `@accounts/client`, `@motech-development/breeze-ui`, `@motech-development/auth`). It layers React, hooks and accessibility rules on top of [`@motech-development/eslint-config-motech-base`](../../eslint-config-motech-base), which holds the shared rule set. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                | Contents                             |
| ------------------- | ------------------------------------ |
| `index.mjs`         | The config (the only published file) |
| `eslint.config.mjs` | Lints `index.mjs` itself             |

## What it exports

`index.mjs` default-exports an array of flat config objects. Entries that reuse the base config index into its exported array, so the two packages must keep the same order.

| Files                                                                        | Composition                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `**/*.{ts,tsx,mts}`                                                          | `@eslint/js` recommended, Airbnb and Airbnb hooks, Airbnb TypeScript (with its plugin and language options stripped), `typescript-eslint` `recommendedTypeChecked`, React `jsx-runtime`, Prettier; base TypeScript rules (`[0]`); `projectService` type-aware parsing; TypeScript import resolver |
| `**/e2e/**/*.{mts,ts}`                                                       | Relaxes `import/no-extraneous-dependencies`, `no-console`, `no-empty-pattern` and `react-hooks/rules-of-hooks` for Playwright fixtures                                                                                                                                                            |
| `**/__tests__/*`, `*.spec.*`, `*.test.*` (TypeScript)                        | Base TypeScript test block (`[1]`)                                                                                                                                                                                                                                                                |
| `**/*.types.test.{ts,tsx}`                                                   | Turns off `vitest/expect-expect` for type-only tests                                                                                                                                                                                                                                              |
| Base config/setup files and `**/*.stories.{mts,ts,tsx}`                      | Base TypeScript tooling block (`[2]`)                                                                                                                                                                                                                                                             |
| `**/*.{js,jsx,mjs}`                                                          | Same Airbnb, React and Prettier layers without TypeScript; base JavaScript rules (`[3]`)                                                                                                                                                                                                          |
| `**/e2e/**/*.{js,mjs}`                                                       | Same e2e relaxations                                                                                                                                                                                                                                                                              |
| `**/__tests__/*`, `*.spec.*`, `*.test.*` (JavaScript)                        | Base JavaScript test block (`[4]`)                                                                                                                                                                                                                                                                |
| Base JS config/setup files, `**/*.stories.{js,jsx,mjs}`, `*.config.{js,mjs}` | Base JavaScript tooling block (`[5]`)                                                                                                                                                                                                                                                             |
| (base `[6]`)                                                                 | Base block for `eslint.config.{js,mjs}`                                                                                                                                                                                                                                                           |

React-specific rule changes on both TypeScript and JavaScript files:

- `react/jsx-no-useless-fragment` allows expression fragments, so components can return `<>{children}</>`.
- `react/require-default-props` is off for TypeScript, where optional props are typed rather than defaulted.
- `react.version` is `detect`.

## Design notes

- Airbnb configs are still eslintrc-format, so they are loaded through `FlatCompat`.
- `stripTsPlugin` removes the `@typescript-eslint` plugin and language options from the Airbnb TypeScript config so they do not clash with the `typescript-eslint` flat config that registers the same plugin.
- `eslint-config-prettier` comes last in each `extends` so Prettier owns formatting.
- Type-aware rules need a `tsconfig.json` in the consuming project; `projectService` finds it.

## Testing

There are no tests. `yarn workspace @motech-development/eslint-config-motech-react lint` lints `index.mjs`; changes are exercised by linting a consuming workspace, for example `yarn workspace @motech-development/auth lint`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. A rule change that makes consumers fail lint should be released as a breaking change.
