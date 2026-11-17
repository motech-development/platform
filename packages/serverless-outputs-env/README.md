[npm]: https://img.shields.io/npm/v/@motech-development/serverless-outputs-env
[npm-url]: https://www.npmjs.com/package/@motech-development/serverless-outputs-env
[size]: https://packagephobia.now.sh/badge?p=@motech-development/serverless-outputs-env
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/serverless-outputs-env

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Serverless outputs env

> A Serverless plugin to get Serverless outputs as environment variables

After `serverless deploy`, writes selected CloudFormation stack outputs to `.env` files, replacing their contents. Used by `@accounts/api` to configure the web client. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add -D @motech-development/serverless-outputs-env
```

Set `provider.stackName`: without it the plugin looks up `<provider name>-<stage>` (for example `aws-dev`).

```yaml
provider:
  name: aws
  stackName: my-service-${sls:stage}

plugins:
  - '@motech-development/serverless-outputs-env'

custom:
  outputs:
    files:
      - ../client/.env.production
    env:
      ApiUrl: REACT_APP_API_URL
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/serverless-outputs-env test-ci
```

## Scripts

| Script                                                                 | Purpose                  |
| ---------------------------------------------------------------------- | ------------------------ |
| `yarn workspace @motech-development/serverless-outputs-env build`      | Build to `lib/`          |
| `yarn workspace @motech-development/serverless-outputs-env test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/serverless-outputs-env test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/serverless-outputs-env lint`       | ESLint                   |
| `yarn workspace @motech-development/serverless-outputs-env typecheck`  | TypeScript check         |
| `yarn workspace @motech-development/serverless-outputs-env formatting` | Prettier check           |
