# Comms architecture

## Purpose

`@core/comms` owns the Amazon SES domain identity for the production domain. It verifies the domain, enables DKIM and writes the verification, DKIM, SPF and DMARC records into the shared hosted zone owned by [`@core/infrastructure`](../../infrastructure/docs/architecture.md). See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path                             | Contents                                          |
| -------------------------------- | ------------------------------------------------- |
| `serverless.yml`                 | Stack, Lambda, custom resource, DNS records, IAM. |
| `src/verify-domain.ts`           | The custom resource handler.                      |
| `src/__tests__/verify-domain.ts` | Handler tests.                                    |
| `webpack.config.js`              | Lambda bundling for `serverless-webpack`.         |

## Components

### `VerifyDomain` Lambda (`src/verify-domain.handler`)

- **Trigger**: CloudFormation, through the `Custom::VerifyDomain` resource in the same stack.
- **Input**: `ResourceProperties` validated with yup: `Domain`, `Region` (SES region), `SPF`, `DMARC` and `TTL`, all required. The values are set in `serverless.yml`.
- **Create / Update**: calls SES `VerifyDomainIdentity` and `VerifyDomainDkim` in parallel, then responds `SUCCESS` with `Arn`, `Domain` and `Route53RecordSets`:
  - a `_amazonses.<domain>` TXT record with the verification token (only when SES returns one);
  - a `_dmarc.<domain>` TXT record with the DMARC policy;
  - a TXT record on the apex with the SPF policy;
  - one `<token>._domainkey.<domain>` CNAME per DKIM token.
- **Delete**: calls SES `DeleteIdentity` and responds `SUCCESS`.
- **Physical resource ID**: the SES identity ARN, built from the stack's account and the SES region.
- **Errors**: an unknown request type, a validation failure or any SES error is reported to CloudFormation as `FAILED` with the error message as the reason, so the stack operation fails and rolls back. There are no retries beyond CloudFormation's own behaviour.
- **Environment**: `SENTRY_DSN`, `SENTRY_ENVIRONMENT` (the stage).

## Infrastructure

Stack `platform-<stage>-comms` (service `platform-comms`, default region `us-east-1`; SES calls go to the region in the resource properties).

| Resource                     | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| `VerifyDomainLambdaFunction` | The handler above.                                                     |
| `VerifyDomain`               | Custom resource that invokes it.                                       |
| `EmailVerificationRecords`   | Route 53 record set group built from `VerifyDomain.Route53RecordSets`. |
| `LambdaFunctionRole`         | Lambda execution role.                                                 |

- **Imports**: `HostedZoneId` from `@core/infrastructure`.
- **Exports**: none.
- **IAM**: the Lambda may verify and delete SES domain identities and enable DKIM, and write its own CloudWatch logs.
- **Build inputs**: `PROD_DOMAIN` and `SENTRY_DSN` environment variables at deploy time.

## Failure handling and observability

The handler is wrapped with Sentry (`@sentry/aws-serverless`, tracing and profiling enabled). Logs are kept for 30 days. Failures surface as a failed CloudFormation stack operation; there are no alarms or dead-letter queues.

## Testing

Vitest with `aws-sdk-client-mock` mocking the SES client, `cfn-response-async` mocked to capture the response, and `aws-lambda-mock-context` for the context. Run one file with:

```sh
yarn workspace @core/comms vitest run src/__tests__/verify-domain.ts
```

## Making changes

- Deploy after `@core/infrastructure`, which owns the hosted zone this stack writes to.
- Changing `SPF`, `DMARC` or `TTL` in `serverless.yml` changes properties, so CloudFormation sends an `Update` and the records are rewritten.
- Changing `Domain` replaces the identity; CloudFormation sends `Delete` for the old one after the new one is created.
- `serverless print` resolves the configuration without deploying: `PROD_DOMAIN=example.invalid SENTRY_DSN= yarn workspace @core/comms exec serverless print --stage local`.
