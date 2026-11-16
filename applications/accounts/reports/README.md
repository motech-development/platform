# Accounts reports

> Generates financial-year exports

A Step Functions workflow that builds a ZIP of a company's transactions (as CSV) and attachments for a financial year, then notifies the user with a download link. `@accounts/api` starts it from the `createReport` mutation. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/reports test-ci
```

`yarn package` builds the shared packages this service imports.

## Scripts

Run as `yarn workspace @accounts/reports <script>`.

| Script       | Purpose                                 |
| ------------ | --------------------------------------- |
| `test`       | Vitest in watch mode.                   |
| `test-ci`    | One Vitest run with coverage.           |
| `lint`       | ESLint.                                 |
| `typecheck`  | TypeScript.                             |
| `formatting` | Prettier check.                         |
| `deploy`     | `serverless deploy` (used by delivery). |
| `teardown`   | `serverless remove` (used by delivery). |
