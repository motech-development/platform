# Core infrastructure

> DNS and TLS for the platform

Creates the shared Route 53 hosted zone for the production domain, its mail records and a wildcard ACM certificate. The hosting stacks and `@core/comms` import its outputs. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

There is no application code. From the repository root:

```sh
nvm use
yarn install
PROD_DOMAIN=example.invalid yarn workspace @core/infrastructure exec serverless print --stage local
```

`PROD_DOMAIN` is required to resolve the configuration.

## Scripts

| Script                                           | Purpose                               |
| ------------------------------------------------ | ------------------------------------- |
| `yarn workspace @core/infrastructure formatting` | Prettier check.                       |
| `yarn workspace @core/infrastructure deploy`     | Serverless deploy (used by delivery). |
| `yarn workspace @core/infrastructure teardown`   | Removes the stack.                    |
