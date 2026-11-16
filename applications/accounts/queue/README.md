# Accounts queue

> Cleans up a deleted company's data

An SQS queue and Step Functions workflow that delete everything left behind when a user deletes a company. `@accounts/api` sends the message; nothing else uses it. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @accounts/queue test-ci
```

## Scripts

Run as `yarn workspace @accounts/queue <script>`.

| Script       | Purpose                                 |
| ------------ | --------------------------------------- |
| `test`       | Vitest in watch mode.                   |
| `test-ci`    | One Vitest run with coverage.           |
| `lint`       | ESLint.                                 |
| `typecheck`  | TypeScript.                             |
| `formatting` | Prettier check.                         |
| `deploy`     | `serverless deploy` (used by delivery). |
| `teardown`   | `serverless remove` (used by delivery). |
