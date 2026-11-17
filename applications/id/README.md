# ID

> Identity for Motech Development products, built on Auth0

The Auth0 tenant configuration, a custom login page and the emails Auth0 sends. See [ID](../../docs/architecture.md#id) in the architecture overview.

Everything in this folder is sensitive. Do not change Auth0 code, configuration or dependencies without explicit authorization; see [`AGENTS.md`](../../AGENTS.md).

## Workspaces

| Workspace                                   | What it is                                           |
| ------------------------------------------- | ---------------------------------------------------- |
| [`@id/tenant`](tenant/)                     | Auth0 tenant configuration and Actions.              |
| [`@id/client`](client/)                     | The custom universal login page.                     |
| [`@id/emails`](emails/)                     | Transactional email templates.                       |
| [`@id/infrastructure`](infrastructure/)     | Hosting for the login page.                          |

Each workspace has a README to get started and a `docs/` folder with the detail.

## Getting started

`@id/client` needs `REACT_APP_GA` and `REACT_APP_SENTRY_DSN` set before it starts; see its [README](client/README.md). Then, from the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @id/client start
```

Releases deploy these workspaces to Develop and production through the `id-infrastructure` and `id-tenant` Deployment Units; see [ID](../../docs/architecture.md#id).
