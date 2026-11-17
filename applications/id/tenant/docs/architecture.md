# ID tenant architecture

## Purpose

`@id/tenant` describes the Auth0 tenant that authenticates users of every Motech Development product. It bundles the custom pages from [`@id/client`](../../client/docs/architecture.md) and the email bodies from [`@id/emails`](../../emails/docs/architecture.md). See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path                    | Contents                                                 |
| ----------------------- | -------------------------------------------------------- |
| `tenant.yaml`           | Exported tenant configuration in Deploy CLI YAML format. |
| `config.json`           | Non-secret Deploy CLI settings used in CI.               |
| `src/rules/`            | Rule scripts, with tests in `__tests__/`.                |
| `src/hooks/`            | Hook scripts, with tests in `__tests__/`.                |
| `src/utils/loadRule.js` | Test helper that runs a rule as Auth0 would.             |

## Configuration structure

`tenant.yaml` has a top-level key per Deploy CLI resource type. Secret and environment-specific values are not stored in it; they are `##KEYWORD##` placeholders the Deploy CLI replaces at deploy time from its keyword mappings.

| Section                                            | What it holds                                                                                   |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `rules`                                            | The two rules below, by script path, stage and order.                                           |
| `hooks`                                            | The pre-user-registration hook below.                                                           |
| `pages`                                            | Custom `login` and `password_reset` pages, read from `../client/build/`.                        |
| `resourceServers`                                  | The Accounts API.                                                                               |
| `clients`                                          | The Accounts app, a test application for the API, the default app and the Deploy CLI extension. |
| `databases`, `connections`                         | The `Username-Password-Authentication` database and the Google social connection.               |
| `tenant`                                           | Tenant settings such as name and locales.                                                       |
| `emailProvider`, `emailTemplates`                  | Amazon SES provider and the four templates, with bodies read from `../emails/build/`.           |
| `clientGrants`, `guardian*`, `branding`, `prompts` | Grants, MFA factors (all disabled), branding and prompts.                                       |
| Remaining keys                                     | Empty (`roles`, `actions`, `organizations`, and so on).                                         |

`config.json` sets `AUTH0_ALLOW_DELETE: false` and excludes no rules. It applies only when passed to `deploy` with `-c config.json`; the `deploy` script does not pass it.

## Rules and hooks

Both rules run at `login_success`, in order, inside Auth0's rule sandbox (globals `auth0`, `UnauthorizedError`, `require`). Each creates a Management API client from `auth0.domain` and `auth0.accessToken`.

| Order | Rule                                                     | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Force email verification (`force-email-verification.js`) | If the email is not verified: resends the verification email and stores `user_metadata.emailVerificationSentDate`, unless it was sent within the last 24 hours, then rejects the login with `UnauthorizedError('Please verify your email before logging in.')`. If verified: removes `emailVerificationSentDate` from metadata when present and continues. Management API failures are logged and do not change the outcome. |
| 2     | Set name (`set-name.js`)                                 | If `user_metadata` has both `given_name` and `family_name` (set at sign-up), moves them to the root profile, sets `name` to "given family", removes them from metadata and updates the user. An update failure fails the login with that error. Otherwise passes the user through.                                                                                                                                           |

| Hook                                  | Trigger                 | Behaviour                                                                                                                                            |
| ------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `set-email-verification-sent-date.js` | `pre-user-registration` | Sets `user_metadata.emailVerificationSentDate` to now, so the first login does not immediately resend the verification email Auth0 sends at sign-up. |

## Testing

Vitest. `src/setupTests.js` stubs the `auth0` `ManagementClient` methods the rules use. Rules are plain functions, not modules, so `loadRule` reads the file, instruments it for coverage and evaluates it in a `vm` context with stub `auth0`, `UnauthorizedError` and a `require` that drops the `@version` suffix. Hooks are CommonJS and are required directly. Run one file with:

```sh
yarn workspace @id/tenant vitest run src/rules/__tests__/set-name.js
```

## Making changes

- Build `@id/emails` and `@id/client` (including `react-snap` pre-rendering) before deploying, because `tenant.yaml` reads their output by relative path.
- After `import`, review the exported `tenant.yaml` and replace any secret or environment-specific value with a keyword placeholder before committing.
- Rules pin `auth0@3.0.1` inside Auth0; the workspace's `auth0` dependency is only for tests.
- Automated delivery for the ID workspaces is currently disabled and they are outside the Deployment Catalog.
