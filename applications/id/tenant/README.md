# ID tenant

> Auth0 tenant configuration as code

The Auth0 tenant for all Motech Development products, managed with the [Auth0 Deploy CLI](https://auth0.com/docs/deploy-monitor/deploy-cli-tool) (`a0deploy`), plus the Auth0 Action code it deploys. See [docs/architecture.md](docs/architecture.md) for how it works.

Auth0 configuration is sensitive. Do not change it, or Auth0 dependencies, without explicit authorization; see [`AGENTS.md`](../../../AGENTS.md).

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @id/tenant test-ci
```

`import` and `deploy:local` read Deploy CLI credentials and keyword values from a git-ignored `config.local.json`. Never commit it.

## Scripts

| Script                                   | Purpose                                               |
| ---------------------------------------- | ----------------------------------------------------- |
| `yarn workspace @id/tenant test`         | Vitest in watch mode.                                 |
| `yarn workspace @id/tenant test-ci`      | One Vitest run with coverage.                         |
| `yarn workspace @id/tenant lint`         | ESLint.                                               |
| `yarn workspace @id/tenant formatting`   | Prettier check.                                       |
| `yarn workspace @id/tenant import`       | Exports the live tenant into this directory.          |
| `yarn workspace @id/tenant deploy:local` | Deploys this configuration using `config.local.json`. |
| `yarn workspace @id/tenant deploy`       | Deploys this configuration (CI).                      |
