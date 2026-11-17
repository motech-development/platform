# ID client architecture

## Purpose

`@id/client` is the custom Auth0 universal login page: log in, sign up, forgotten password and reset password screens. The built HTML is uploaded to the Auth0 tenant by [`@id/tenant`](../../tenant/docs/architecture.md) as its custom `login` and `password_reset` pages, and the static assets are hosted by [`@id/infrastructure`](../../infrastructure/docs/architecture.md). See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path                           | Contents                                                          |
| ------------------------------ | ----------------------------------------------------------------- |
| `src/index.tsx`                | Bootstrap: Sentry, Google Analytics, hydrate or render.           |
| `src/App.tsx`                  | Routes `/login` and `/lo/reset`.                                  |
| `src/pages/`                   | `Login` and `Reset` pages; `views/` holds the individual screens. |
| `src/components/`              | Shared forms and layout.                                          |
| `src/hooks/useAuth.ts`         | Builds an `auth0-js` `WebAuth` client from `window.config`.       |
| `src/utils/getErrorMessage.ts` | Maps Auth0 error codes to messages.                               |
| `src/locales/en/`              | i18next translations.                                             |
| `src/global.d.ts`              | Types for `window.config` and `window.passwordReset`.             |
| `serverless.yml`               | `serverless-finch` upload settings.                               |

## Components

### Runtime configuration

Auth0 substitutes its template variables into the page it serves:

- **`window.config`** (login page): `auth0Domain`, `clientID`, `callbackURL`, `internalOptions` and optional `dict`. If it is not already defined, `Login` appends a script that decodes the `@@config@@` placeholder (base64 JSON) Auth0 replaces.
- **`window.passwordReset`** (reset page): `csrfToken`, `email`, `passwordPolicy`, `ticket`, filled from Auth0's Liquid variables by a script `Reset` appends.

Each page shows a loader until its object exists.

### Pages

| Route       | Page    | Views                                  | Calls                                                                                                             |
| ----------- | ------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/login`    | `Login` | `LogIn`, `SignUp`, `ForgottenPassword` | `WebAuth.login`, `WebAuth.signup`, `WebAuth.changePassword` on the `Username-Password-Authentication` connection. |
| `/lo/reset` | `Reset` | `ResetPassword`, `Success`             | `POST /lo/reset` (same origin, Auth0) with the form values via `@motech-development/axios-hooks`.                 |

`useAuth` creates the `WebAuth` client with `responseType: 'code'` and the injected domain, client ID and callback URL. Every view change is recorded as a Google Analytics page view.

### Errors

Auth0 errors are shown as toasts. `getErrorMessage` shows Auth0's own description for `access_denied`, `invalid_user_password` and `unauthorized`, a fallback message for `invalid_signup`, `mfa_required` and `PasswordHistoryError`, and otherwise a translated message keyed by the error code. Reset errors show the server message or a generic translation.

### Environment

Read at build time through Vite's `process.env` define: `REACT_APP_SENTRY_DSN` and `REACT_APP_GA` (both required; the app throws without them), `STAGE` (Sentry environment), `PORT`, `PUBLIC_URL`. Only `REACT_APP_*` variables, `STAGE` and `NODE_ENV` are built into the bundle, so never give a secret a `REACT_APP_` name. `SENTRY_AUTH_TOKEN` lets the build upload source maps; it is read from `process.env`, so export it in the shell or CI environment that runs the build rather than setting it in `.env.local`.

## Infrastructure

The workspace creates no AWS resources (`manageResources: false`). `deploy` uses `serverless-finch` to empty the bucket named after the `id` subdomain (override with `PREFIX`) and upload `build/` to it, with long cache headers for CSS and JS and no-store for HTML. It then runs `react-snap` to pre-render `/login` and `/lo/reset`. Deploy input: `PROD_DOMAIN`.

## Failure handling and observability

Sentry React (enabled only in production builds) with tracing and session replay; source maps are uploaded by `@sentry/vite-plugin`. Web vitals are sent to Google Analytics through `@motech-development/ga-web-vitals`.

## Testing

Vitest with Testing Library. `src/setupTests.ts` mocks `auth0-js`'s `WebAuth` methods; tests set `window.config` and `window.passwordReset` themselves. `vitest.config.ts` aliases the workspace packages to their built `lib/` output, so run `yarn package` first. Run one file with:

```sh
yarn workspace @id/client vitest run src/pages/__tests__/Login.tsx
```

## Making changes

- The route paths must match the HTML paths `@id/tenant` uploads (`build/login/index.html`, `build/lo/reset/index.html`), which exist only after `react-snap` pre-renders them.
- `build` does not pre-render. Run `build`, then `react-snap` (run by `deploy` after upload), before deploying `@id/tenant`.
- Releases deploy this workspace through the `id-tenant` Deployment Unit, which builds, uploads and pre-renders it before importing the tenant. Emptying the bucket means the live login page can fail to load its scripts until that import finishes.
