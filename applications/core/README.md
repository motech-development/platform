# Core

> Shared Motech Development services

Services that more than one product depends on: DNS and certificates, email sending, and virus scanning. See [Core](../../docs/architecture.md#core) in the architecture overview.

## Workspaces

| Workspace                                     | What it is                                                        |
| --------------------------------------------- | ----------------------------------------------------------------- |
| [`@core/infrastructure`](infrastructure/)     | Hosted zone, mail records and wildcard certificate.               |
| [`@core/comms`](comms/)                       | Amazon SES domain verification.                                   |
| [`@core/anti-virus`](anti-virus/)             | ClamAV scanning for uploaded files.                               |

Each workspace has a README to get started and a `docs/` folder with the detail.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @core/anti-virus test-ci
```

`@core/infrastructure` and `@core/comms` deploy to production only. `@core/anti-virus` also deploys to preview and Develop.
