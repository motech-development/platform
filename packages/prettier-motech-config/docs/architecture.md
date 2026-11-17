# Prettier config architecture

## Purpose

A single JSON Prettier config (`index.json`, the package `main`) shared by all workspaces through their `.prettierrc.json`. See the [repository architecture](../../../docs/architecture.md).

## API reference

| Option          | Value                             | Effect from Prettier defaults      |
| --------------- | --------------------------------- | ---------------------------------- |
| `endOfLine`     | `lf`                              | Same as default; stated explicitly |
| `plugins`       | `["prettier-plugin-tailwindcss"]` | Sorts Tailwind class names         |
| `singleQuote`   | `true`                            | Single quotes in JS/TS             |
| `trailingComma` | `all`                             | Same as Prettier 3 default         |

Peer dependency: `prettier` ^3.2.5. `prettier-plugin-tailwindcss` is a dependency of this package, but the config names it as a string, so under Plug'n'Play or a strict `node_modules` layout consumers may need to install it themselves.

## Making changes

Any change reformats every workspace; run `yarn prettier --write .` from the root in the same commit.

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
