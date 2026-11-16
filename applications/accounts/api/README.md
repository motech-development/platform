# Accounts API

> The AppSync GraphQL API behind the Accounts client

The client's only API. It authenticates users with Auth0 through OpenID Connect and backend services with IAM, and resolves most fields directly against the application table. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @accounts/api test-ci
```

Deploying needs `AUTH0_DOMAIN` and `SENTRY_DSN`.

## Scripts

| Script            | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `test`            | Vitest in watch mode.                             |
| `test-ci`         | One Vitest run with coverage.                     |
| `lint`            | ESLint.                                           |
| `typecheck`       | TypeScript.                                       |
| `formatting`      | Prettier check.                                   |
| `codegen.graphql` | Regenerates `src/graphql/` types from the schema. |
| `deploy`          | Deploys the stack.                                |
| `teardown`        | Removes the stack.                                |
