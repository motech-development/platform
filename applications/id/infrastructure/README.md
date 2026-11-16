# ID infrastructure

> Hosting for the custom login page

Creates the S3 bucket, CloudFront distribution and DNS record that serve [`@id/client`](../client/) on the `id` subdomain. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

There is no application code. From the repository root:

```sh
nvm use
yarn install
PROD_DOMAIN=example.invalid yarn workspace @id/infrastructure exec serverless print --stage local
```

`PROD_DOMAIN` is required to resolve the configuration; `PREFIX` optionally overrides the subdomain.

## Scripts

| Script                                         | Purpose            |
| ---------------------------------------------- | ------------------ |
| `yarn workspace @id/infrastructure formatting` | Prettier check.    |
| `yarn workspace @id/infrastructure deploy`     | Serverless deploy. |
| `yarn workspace @id/infrastructure teardown`   | Removes the stack. |
