# Accounts client

> The Accounts web application

A React single-page app, built with Vite, that users sign in to with Auth0 to manage their companies, clients, transactions and reports. It talks to [`@accounts/api`](../api/) over GraphQL and is installable as a PWA. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/client start
```

`yarn package` builds the shared packages the client imports. The dev server opens on http://localhost:3000.

Create `applications/accounts/client/.env.local` (git-ignored) with values for an environment you have access to: `REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, `REACT_APP_AUTH0_AUDIENCE`, `REACT_APP_APPSYNC_URL`, `REACT_APP_AWS_REGION`, `REACT_APP_GA` and `REACT_APP_SENTRY_DSN`. End-to-end tests also need `E2E_USERNAME` and `E2E_PASSWORD`, and optionally `BASE_URL`. Never commit these values.

## Scripts

Run as `yarn workspace @accounts/client <script>`.

| Script                                            | Purpose                                                    |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `start`                                           | Vite dev server.                                           |
| `build`                                           | Production build to `build/`.                              |
| `serve`                                           | Serves the production build.                               |
| `test`                                            | Vitest in watch mode.                                      |
| `test-ci`                                         | One Vitest run with coverage.                              |
| `e2e`                                             | Playwright in UI mode.                                     |
| `e2e-ci`                                          | Playwright headless.                                       |
| `lint`                                            | ESLint.                                                    |
| `typecheck`                                       | TypeScript.                                                |
| `formatting`                                      | Prettier check.                                            |
| `codegen.graphql`                                 | Regenerates `src/graphql/` from the API schema.            |
| `codegen.graphql.watch`                           | The same, in watch mode.                                   |
| `build-icons`                                     | Generates PWA icons from `assets/icon.svg`.                |
| `build-splash:portrait`, `build-splash:landscape` | Generates splash screens from `assets/splash.svg`.         |
| `deploy`                                          | Uploads `build/` to the hosting bucket (used by delivery). |
| `teardown`                                        | Removes the uploaded files (used by delivery).             |
