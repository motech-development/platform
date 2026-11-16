# Accounts storage

> Attachment storage for Accounts

Owns the upload and download buckets for transaction attachments and issues presigned URLs so files never pass through the API. `@accounts/api` calls it on behalf of signed-in users. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/storage test-ci
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
