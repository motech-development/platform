# Accounts infrastructure

> Hosting for the Accounts web client

The S3 bucket, CloudFront distribution, access logging and DNS record that serve [`@accounts/client`](../client/) in production. It has no application code; everything is in `serverless.yml`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
PROD_DOMAIN=example.invalid yarn workspace @accounts/infrastructure exec serverless print --stage local
```

`PROD_DOMAIN` is required; the reserved `.invalid` domain is fine for local checks, which deploy nothing.

## Scripts

Run as `yarn workspace @accounts/infrastructure <script>`.

| Script       | Purpose                                 |
| ------------ | --------------------------------------- |
| `formatting` | Prettier check.                         |
| `deploy`     | `serverless deploy` (used by delivery). |
| `teardown`   | `serverless remove` (used by delivery). |
