# Core infrastructure architecture

## Purpose

`@core/infrastructure` owns the production domain's DNS zone and its TLS certificate. Every public subdomain depends on it. See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path             | Contents                                  |
| ---------------- | ----------------------------------------- |
| `serverless.yml` | The whole stack; there is no source code. |

## Infrastructure

Stack `platform-<stage>-infrastructure` (service `platform-infrastructure`, region `us-east-1`, which CloudFront requires for its certificates).

| Resource       | Purpose                                                          |
| -------------- | ---------------------------------------------------------------- |
| `HostedZone`   | Route 53 hosted zone for `PROD_DOMAIN`.                          |
| `MxRecords`    | MX record on the apex for the organisation's mail service.       |
| `CNameRecords` | `autodiscover` CNAME for the mail service.                       |
| `Certificate`  | ACM certificate for the apex and `*.<domain>`, validated by DNS. |

**Exports** (not stage-prefixed, so one per account and region):

| Export         | Value                | Imported by                                                     |
| -------------- | -------------------- | --------------------------------------------------------------- |
| `HostedZoneId` | The hosted zone ID.  | `@core/comms`, `@accounts/infrastructure`, `@id/infrastructure` |
| `Certificate`  | The certificate ARN. | `@accounts/infrastructure`, `@id/infrastructure`                |

There are no IAM resources and no runtime components. Build input: `PROD_DOMAIN`.

## Failure handling and observability

None beyond CloudFormation. DNS validation of the certificate requires the validation records to be resolvable, so on first deploy the domain's registrar must delegate to the new hosted zone's name servers. Once delegated, this zone answers for the whole domain, so copy any records the domain already serves elsewhere into it before delegating. The certificate does not set `DomainValidationOptions`, so CloudFormation does not create its validation record: add the CNAME that ACM shows for the certificate (in the ACM console or `aws acm describe-certificate`) to the hosted zone. Until then the stack stays in progress.

## Testing

No tests. Check the resolved configuration with `PROD_DOMAIN=example.invalid yarn workspace @core/infrastructure exec serverless print --stage local`.

## Making changes

- Deploy this stack first; dependents cannot resolve their imports until it exists.
- CloudFormation will not delete or change an export that another stack imports, so replacing the hosted zone or certificate needs the importing stacks updated first.
- Replacing the hosted zone changes its name servers, which must then be updated at the domain registrar.
- Mail records here are separate from the SES records written by `@core/comms`; keep the SPF policy there consistent with the mail service configured here.
