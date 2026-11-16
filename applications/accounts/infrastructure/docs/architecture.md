# Accounts infrastructure architecture

## Purpose

This workspace defines AWS infrastructure used by the Accounts web client. It
uses Serverless Framework and CloudFormation; the resource definitions are in
[`serverless.yml`](../serverless.yml), and workspace commands are in
[`package.json`](../package.json).

The workspace provisions the static client hosting and delivery resources,
including its storage, CDN, and DNS integration. CloudFront access logging is
also configured here. The separate [`@accounts/client`](../../client/) workspace
builds and publishes the web assets. API and other application services are
owned by their respective workspaces. See the
[repository architecture](../../../../docs/architecture.md) for the wider
picture.

## Layout

| Path             | Contents                                       |
| ---------------- | ---------------------------------------------- |
| `serverless.yml` | Every resource; there is no application code.  |
| `package.json`   | `formatting`, `deploy` and `teardown` scripts. |

## Resources

Stack `accounts-<stage>-infrastructure`, deployed to `us-east-1` (the default
region). A CloudFormation rule fails the deployment in any other region,
because CloudFront standard logging v2 requires `us-east-1`. The client domain
is `accounts.<PROD_DOMAIN>`, where `PROD_DOMAIN` is an environment variable
read at deploy time.

| Resource                                                                                   | Detail                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Bucket`                                                                                   | S3 bucket named after the client domain. Holds the built client.                                                                                                                                                                                                                                                 |
| `CloudFrontOriginAccessIdentity`                                                           | Lets CloudFront read the bucket; `BucketPolicy` grants it `s3:GetObject` only.                                                                                                                                                                                                                                   |
| `CloudFrontDistribution`                                                                   | Alias of the client domain with the imported certificate (SNI). Default root object `/index.html`; a `403` from S3 is served as `200 /index.html` so client-side routes work. HTTP/2, `PriceClass_100`, compression on, `GET`/`HEAD`/`OPTIONS`, no query strings or cookies forwarded, HTTP redirected to HTTPS. |
| `CloudFrontLogBucket`                                                                      | Encrypted (SSE-S3), all public access blocked, bucket-owner-enforced, objects expire after 14 days. Retained when the stack is deleted or the resource replaced.                                                                                                                                                 |
| `CloudFrontLogBucketPolicy`                                                                | Lets the CloudWatch Logs delivery service write only under the CloudFront log prefix, only for this stack's delivery source and account.                                                                                                                                                                         |
| `CloudFrontLogDeliverySource`, `CloudFrontLogDeliveryDestination`, `CloudFrontLogDelivery` | CloudFront standard logging v2 of access logs, in JSON, to the log bucket, with a fixed list of record fields.                                                                                                                                                                                                   |
| `DnsRecord`                                                                                | Route 53 `A` alias from the client domain to the distribution.                                                                                                                                                                                                                                                   |

## Imports and exports

| Imports        | Used for                            |
| -------------- | ----------------------------------- |
| `Certificate`  | The distribution's ACM certificate. |
| `HostedZoneId` | The hosted zone for the DNS record. |

Both are unprefixed exports from the `core-infrastructure` deployment, which
must be deployed first. The stack has no outputs or exports.

## Deployment

Production only, through the generated delivery workflows after
`core-infrastructure`. `@accounts/client` deploys after this stack and uploads
its build into the bucket with `serverless-finch`.

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
[repository contributor guidance](../../../../AGENTS.md) and authorized internal
procedures.

## Making changes

- The bucket name, distribution alias and DNS name all derive from
  `PROD_DOMAIN`; `@accounts/client`'s `serverless.yml` derives the same bucket
  name independently, so keep the two in sync.
- Keep the stack in `us-east-1` while CloudFront logging v2 is used.
- The log bucket is retained on delete; remove it by hand if the stack is torn
  down for good.
