# Accounts web

A blank starting point for rebuilding Accounts. The app is a static HTML placeholder built and served by Vite; no application framework or UI library has been selected.

The previous screens, authentication, data clients, routing, PWA, application tests, and assets were intentionally removed in the reset. The earlier migration specification is historical context, not a claim that the placeholder provides those capabilities. The legacy Accounts client remains in `../client`.

## Local development

From the repository root:

```sh
yarn install --immutable
yarn workspace @accounts/web start
```

Open http://localhost:8080. Edit `index.html` to change the placeholder.

```sh
yarn workspace @accounts/web build
yarn workspace @accounts/web serve
yarn workspace @accounts/web exec vitest run infrastructure
yarn workspace @accounts/web typecheck
yarn workspace @accounts/web lint
```

## Hosting

`infrastructure/` retains the shared `accounts-web-hosting` Amplify app, Develop and production branches, Develop domain, and exact-commit deployment and preview teardown commands. The app's GitHub connection remains externally managed. No Auth0, AppSync, or Sentry configuration is needed to build or deploy the placeholder.

The root `amplify.yml` builds this workspace and publishes `dist/`. The SPA rewrite serves `index.html`. Preview validation checks the hosted placeholder without creating accounting fixtures. The legacy client keeps its own browser journeys.

Reconciliation, deployment, and teardown commands change AWS or remote Git state; local build and tests do not deploy anything.
