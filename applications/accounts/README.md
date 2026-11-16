# Accounts

> Bookkeeping application to keep on top of your finances

Accounts records a company's transactions, clients, attachments and financial-year reports. A React client talks to an AppSync GraphQL API, which is backed by a single DynamoDB table and a set of small services. See [How Accounts works](../../docs/architecture.md#how-accounts-works) for the full picture.

## Workspaces

| Workspace                                    | What it is                                                         |
| -------------------------------------------- | ------------------------------------------------------------------ |
| [`@accounts/client`](client/)                | The web app users work in.                                         |
| [`@accounts/api`](api/)                      | The AppSync GraphQL API.                                           |
| [`@accounts/data`](data/)                    | The application table and its stream processors.                   |
| [`@accounts/storage`](storage/)              | Attachment buckets and presigned URLs.                             |
| [`@accounts/reports`](reports/)              | Financial-year export generator.                                   |
| [`@accounts/notifications`](notifications/)  | In-app notifications.                                              |
| [`@accounts/queue`](queue/)                  | Clean-up after a company is deleted.                               |
| [`@accounts/infrastructure`](infrastructure/) | Hosting for the client.                                           |
| [`@accounts/web`](web/)                      | Placeholder for the Accounts rebuild.                              |
| [`@accounts/data-restore`](data-restore/)    | Runbook tool for rolling the application table back.               |

Each workspace has a README to get started and a `docs/` folder with the detail.

Accounts also relies on [`@core/anti-virus`](../core/anti-virus/) to scan uploads, and on [ID](../id/) for sign-in.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/client start
```

The client needs settings for an environment you can access; see its [README](client/README.md).

## Domain

- [Glossary](GLOSSARY.md): the Accounts domain language.
- [ADRs](docs/adr/): recorded Accounts decisions.
