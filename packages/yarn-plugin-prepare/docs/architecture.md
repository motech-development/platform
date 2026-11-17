# Yarn plugin prepare architecture

## Purpose

Runs `yarn prepare` from the directory the install ran in (in this repository, the root `prepare` script, for example Git hook setup) after every install, since Yarn 4 does not run it automatically. See the [repository architecture](../../../docs/architecture.md).

## API reference

`index.js` exports a Yarn plugin object named `@motech-development/plugin-prepare` with one hook.

**`afterAllInstalled`:** runs `yarn prepare` via `@yarnpkg/shell` and swallows any error, so a missing or failing `prepare` script never fails the install.

## Making changes

Yarn loads the copy at `.yarn/plugins/@motech-development/plugin-prepare.cjs`, not `index.js` directly. After editing, re-import it (`yarn plugin import ./packages/yarn-plugin-prepare/index.js`) so the bundled copy matches.

## Testing

There are no automated tests; `lint` and `formatting` are the checks.

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
