# Accounts infrastructure

This workspace defines AWS infrastructure used by the Accounts web client. It
uses Serverless Framework and CloudFormation; the resource definitions are in
[`serverless.yml`](./serverless.yml), and workspace commands are in
[`package.json`](./package.json).

The workspace provisions the static client hosting and delivery resources,
including its storage, CDN, and DNS integration. CloudFront access logging is
also configured here. The separate [`@accounts/client`](../client/) workspace
builds and publishes the web assets. API and other application services are
owned by their respective workspaces.

## Local setup and checks

From the repository root, select the repository's Node.js version and install
dependencies with Yarn:

```sh
nvm use
yarn install
```

For local checks, use the reserved `.invalid` domain and `local` stage. These
commands format-check the workspace, print the resolved configuration, or
create a local Serverless package without deploying resources:

```sh
yarn workspace @accounts/infrastructure formatting
PROD_DOMAIN=example.invalid yarn workspace @accounts/infrastructure exec serverless print --stage local
PROD_DOMAIN=example.invalid yarn workspace @accounts/infrastructure exec serverless package --stage local
```

Deployment and maintenance follow the
[repository contributor guidance](../../../AGENTS.md) and authorized internal
procedures.
