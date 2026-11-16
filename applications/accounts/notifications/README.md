# Accounts notifications

> Records in-app notifications for Accounts users

A small IAM-authenticated REST API that other services call to store a notification for a user; `@accounts/reports` uses it when a report is ready. `@accounts/api` then pushes the notification to the browser. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/notifications test-ci
```

`yarn package` builds the shared packages this service imports.

## Scripts

Run as `yarn workspace @accounts/notifications <script>`.

| Script       | Purpose                                 |
| ------------ | --------------------------------------- |
| `test`       | Vitest in watch mode.                   |
| `test-ci`    | One Vitest run with coverage.           |
| `lint`       | ESLint.                                 |
| `typecheck`  | TypeScript.                             |
| `formatting` | Prettier check.                         |
| `deploy`     | `serverless deploy` (used by delivery). |
| `teardown`   | `serverless remove` (used by delivery). |
