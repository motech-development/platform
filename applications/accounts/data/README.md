# Accounts data

> The Accounts application table and its stream processors

Owns the DynamoDB application table that holds every Accounts record, and the Lambdas that keep balances, typeahead suggestions, attachments and scheduled transactions in step with it. Most other Accounts stacks import the table from here. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @accounts/data test-ci
```

## Scripts

| Script       | Purpose                       |
| ------------ | ----------------------------- |
| `test`       | Vitest in watch mode.         |
| `test-ci`    | One Vitest run with coverage. |
| `lint`       | ESLint.                       |
| `typecheck`  | TypeScript.                   |
| `formatting` | Prettier check.               |
| `deploy`     | Deploys the stack.            |
| `teardown`   | Removes the stack.            |
