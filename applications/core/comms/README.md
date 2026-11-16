# Comms

> Email domain verification for Amazon SES

Verifies the production domain with Amazon SES and publishes the DNS records SES needs, so platform services can send email from it. It is infrastructure only and has no callers at runtime. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @core/comms test-ci
```

## Scripts

| Script                                  | Purpose                               |
| --------------------------------------- | ------------------------------------- |
| `yarn workspace @core/comms test`       | Vitest in watch mode.                 |
| `yarn workspace @core/comms test-ci`    | One Vitest run with coverage.         |
| `yarn workspace @core/comms lint`       | ESLint.                               |
| `yarn workspace @core/comms typecheck`  | TypeScript.                           |
| `yarn workspace @core/comms formatting` | Prettier check.                       |
| `yarn workspace @core/comms deploy`     | Serverless deploy (used by delivery). |
| `yarn workspace @core/comms teardown`   | Removes the stack.                    |
