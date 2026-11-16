# Semantic Release config architecture

## Purpose

Central semantic-release configuration. Every workspace's `.releaserc.json` extends one of its two configs, and multi-semantic-release runs them from Conventional Commits on `main`. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path             | Contents                                    |
| ---------------- | ------------------------------------------- |
| `package.js`     | Config for published packages               |
| `application.js` | Config for applications (no npm publish)    |
| `index.js`       | Exports both as `package` and `application` |
| `src/utils.js`   | Shared `branches` and plugin definitions    |

## API reference

| Entry                                              | Branches       | Plugins (in order)                                                                                 |
| -------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `@motech-development/semantic-release/package`     | `main`, `next` | commit-analyzer, release-notes-generator, `@semantic-release/npm` (publishes), github              |
| `@motech-development/semantic-release/application` | `main`, `next` | commit-analyzer, release-notes-generator, `@semantic-release/npm` with `npmPublish: false`, github |

The GitHub plugin is configured with `failComment`, `labels` and `successComment` all `false`, so releases do not comment on or label issues and PRs.

`src/utils.js` exports `branches` and `plugins` (`commitAnalyzer`, `releaseNotesGenerator`, `github`, and `npm(isPackage = false)`).

## Design notes

- The `application` config still runs the npm plugin so `package.json` versions are bumped, which drives Release tags for deployments.
- The package is plain CommonJS with no build step.

## Testing

```bash
yarn workspace @motech-development/semantic-release vitest run src/__tests__/utils.test.js
```

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
