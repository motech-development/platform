# ID

> Identity for Motech Development products, built on Auth0

The Auth0 tenant configuration, a custom login page and the emails Auth0 sends. See [ID](../../docs/architecture.md#id) in the architecture overview.

Everything in this folder is sensitive. Do not change Auth0 code, configuration or dependencies without explicit authorization; see [`AGENTS.md`](../../AGENTS.md).

## Workspaces

| Workspace                                   | What it is                                           |
| ------------------------------------------- | ---------------------------------------------------- |
| [`@id/tenant`](tenant/)                     | Auth0 tenant configuration, rules and hooks.         |
| [`@id/client`](client/)                     | The custom universal login page.                     |
| [`@id/emails`](emails/)                     | Transactional email templates.                       |
| [`@id/infrastructure`](infrastructure/)     | Hosting for the login page.                          |

Each workspace has a README to get started and a `docs/` folder with the detail.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @id/client start
```

Automated delivery for these workspaces is currently disabled, and they are outside the Deployment Catalog.
