# Yarn plugin dedupe architecture

## Purpose

Keeps `yarn.lock` free of duplicate resolutions automatically, so contributors do not need to remember `yarn dedupe`. See the [repository architecture](../../../docs/architecture.md).

## API reference

`index.js` exports a Yarn plugin object named `@motech-development/plugin-dedupe` with one hook.

**`afterAllInstalled`:**

1. Skip if the command line contains `dedupe` (so `yarn dedupe` does not recurse) or if `MOTECH_PLUGIN_DEDUPE` is already set.
2. Set `process.env.MOTECH_PLUGIN_DEDUPE = 'true'` so nested Yarn processes skip.
3. Run `yarn dedupe --check` via `@yarnpkg/shell`; if it exits non-zero (duplicates found), run `yarn dedupe`.

Errors from `execute` are not caught.

## Making changes

Yarn loads the copy at `.yarn/plugins/@motech-development/plugin-dedupe.cjs`, not `index.js` directly. After editing, re-import it (`yarn plugin import ./packages/yarn-plugin-dedupe/index.js`) so the bundled copy matches.

## Testing

There are no automated tests; `lint` and `formatting` are the checks.

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
