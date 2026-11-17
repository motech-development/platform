# ID infrastructure architecture

## Purpose

`@id/infrastructure` hosts the static build of [`@id/client`](../../client/docs/architecture.md) on `<PREFIX or id>.<PROD_DOMAIN>`. See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path             | Contents                                  |
| ---------------- | ----------------------------------------- |
| `serverless.yml` | The whole stack; there is no source code. |

## Infrastructure

Stack `id-<stage>-infrastructure` (service `id-infrastructure`, default region `us-east-1`).

| Resource                         | Purpose                                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Bucket`                         | S3 bucket named after the subdomain; CORS allows `GET` from any origin.                                                                                                                     |
| `BucketPolicy`                   | Grants the CloudFront origin access identity read access to objects.                                                                                                                        |
| `CloudFrontOriginAccessIdentity` | Identity CloudFront uses to read the bucket.                                                                                                                                                |
| `CloudFrontDistribution`         | HTTPS-only (redirects HTTP), HTTP/2, compressed, `PriceClass_100`; no query strings or cookies forwarded; default root `/index.html`, and 403s are served as `/index.html` with status 200. |
| `DnsRecord`                      | A alias record for the subdomain pointing at the distribution.                                                                                                                              |

- **Imports**: `HostedZoneId` and `Certificate` from `@core/infrastructure`.
- **Exports**: none.
- **Build inputs**: `PROD_DOMAIN`, optional `PREFIX`.

## Failure handling and observability

None beyond CloudFormation and CloudFront defaults.

## Testing

No tests. Check the resolved configuration with `PROD_DOMAIN=example.invalid yarn workspace @id/infrastructure exec serverless print --stage local`.

## Making changes

- Deploy after `@core/infrastructure` and before `@id/client`, whose `deploy` uploads into this bucket.
- The bucket name is the subdomain, so `@id/client/serverless.yml` must resolve the same `PREFIX` and `PROD_DOMAIN`.
- Releases deploy this stack to Develop and production through the `id-infrastructure` Deployment Unit, after `core-infrastructure`. Changes to `applications/id` need explicit authorization; see [`AGENTS.md`](../../../../AGENTS.md).
