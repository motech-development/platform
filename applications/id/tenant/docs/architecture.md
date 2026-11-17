# ID tenant architecture

## Purpose

`@id/tenant` describes the Auth0 tenant that authenticates users of every Motech Development product. It bundles the custom pages from [`@id/client`](../../client/docs/architecture.md) and the email bodies from [`@id/emails`](../../emails/docs/architecture.md). See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path           | Contents                                                 |
| -------------- | -------------------------------------------------------- |
| `tenant.yaml`  | Exported tenant configuration in Deploy CLI YAML format. |
| `config.json`  | Non-secret Deploy CLI settings used in CI.               |
| `src/actions/` | Action code, with tests in `__tests__/`.                 |

## Configuration structure

`tenant.yaml` has a top-level key per Deploy CLI resource type. Secret and environment-specific values are not stored in it; they are `##KEYWORD##` placeholders the Deploy CLI replaces at deploy time from environment variables of the same name.

| Section                                            | What it holds                                                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `actions`, `triggers`                              | The three Actions below and their bindings to `post-login` and `pre-user-registration`.                                        |
| `pages`                                            | Custom `login` and `password_reset` pages, read from `../client/build/`.                                                       |
| `resourceServers`                                  | The Accounts API.                                                                                                              |
| `clients`                                          | The Accounts app, the default app, the Deploy CLI extension and `Login Actions`.                                               |
| `databases`, `connections`                         | The `Username-Password-Authentication` database and the Google social connection.                                              |
| `tenant`                                           | Tenant settings such as name and locales.                                                                                      |
| `emailProvider`, `emailTemplates`                  | Amazon SES provider and the four templates, with bodies read from `../emails/build/`.                                          |
| `clientGrants`, `guardian*`, `branding`, `prompts` | Grants (including `update:users` on the Management API for `Login Actions`), MFA factors (all disabled), branding and prompts. |
| Remaining keys                                     | Empty (`roles`, `organizations`, and so on).                                                                                   |

`config.json` sets `AUTH0_ALLOW_DELETE: false` and excludes `rules`, `rulesConfigs` and `hooks`, so a deploy never re-saves the tenants' legacy Rules and Hook. They are disabled in both tenants. CI passes it with `deploy -c config.json`.

## Actions

All three Actions run on Node 22.

| Action                           | Trigger                 | Behaviour                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Force email verification         | `post-login` (first)    | If the email is verified, removes `user_metadata.emailVerificationSentDate` when present and continues. Otherwise it resends the verification email and records the time, unless one was sent in the last 24 hours, then denies the login with "Please verify your email before logging in." A failed resend is logged and does not change the outcome. |
| Set name                         | `post-login` (second)   | If `user_metadata` has both `given_name` and `family_name` (set at sign-up), copies them to the root profile with `name` set to "given family", then removes them from metadata. A failed update fails the login.                                                                                                                                       |
| Set email verification sent date | `pre-user-registration` | Sets `user_metadata.emailVerificationSentDate` to now, so the first login does not immediately resend the verification email Auth0 sends at sign-up.                                                                                                                                                                                                    |

Actions cannot change root profile fields or send verification emails themselves, so Force email verification and Set name call the Management API. They authenticate as the `Login Actions` application, whose credentials reach them as Action secrets from the `AUTH0_ACTIONS_CLIENT_ID` and `AUTH0_ACTIONS_CLIENT_SECRET` keywords. That application is granted only `update:users`.

## Testing

Vitest. Actions are CommonJS modules exporting their trigger handler, so tests require them directly, pass stub `event` and `api` objects, and stub the `auth0` `ManagementClient` with `vi.spyOn`. Run one file with:

```sh
yarn workspace @id/tenant vitest run src/actions/__tests__/set-name.js
```

## Delivery

Releases deploy the tenant to Develop and production through the `id-tenant` Deployment Unit, after `id-infrastructure`. The job builds `@id/emails` and `@id/client`, deploys the client (which empties the bucket, uploads and pre-renders the pages), then runs `deploy -c config.json` with the keyword values from GitHub secrets. Sign-in can fail briefly between the upload and the import. `@id/tenant` depends on `@id/client` and `@id/emails`, so a release of either also redeploys the tenant. Preview Environments never deploy it, because they would all share one Auth0 tenant.

## Making changes

- Build `@id/emails` and `@id/client` (including `react-snap` pre-rendering) before deploying by hand, because `tenant.yaml` reads their output by relative path.
- After `import`, review the exported `tenant.yaml` and replace any secret or environment-specific value with a keyword placeholder before committing.
- An Action's `auth0` dependency is pinned in `tenant.yaml`; keep it in step with the workspace's `auth0` dependency, which the tests use.
- A new keyword needs a GitHub secret for each environment and an entry in both tenant deploy jobs. Those jobs are generated from the Deployment Catalog, so change the generator, not the workflow files.
