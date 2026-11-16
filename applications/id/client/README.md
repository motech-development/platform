# ID client

> The custom Auth0 universal login page

A React app, built with Vite, that replaces Auth0's hosted login and password reset pages for every Motech Development product. Auth0 serves it and injects the tenant settings at runtime. See [docs/architecture.md](docs/architecture.md) for how it works.

Auth0-related code in `applications/id` is sensitive; read [`AGENTS.md`](../../../AGENTS.md) before changing it.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @id/client start
```

`REACT_APP_SENTRY_DSN` and `REACT_APP_GA` must be set (for example in a git-ignored `.env.local` here) or the app throws on start. Without Auth0's injected `window.config` the login screens show a loader, so a real sign-in cannot be completed locally.

## Scripts

| Script                                  | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| `yarn workspace @id/client start`       | Vite dev server.                                          |
| `yarn workspace @id/client build`       | Production build into `build/`.                           |
| `yarn workspace @id/client serve`       | Serves the production build.                              |
| `yarn workspace @id/client test`        | Vitest in watch mode.                                     |
| `yarn workspace @id/client test-ci`     | One Vitest run with coverage.                             |
| `yarn workspace @id/client lint`        | ESLint.                                                   |
| `yarn workspace @id/client typecheck`   | TypeScript.                                               |
| `yarn workspace @id/client formatting`  | Prettier check.                                           |
| `yarn workspace @id/client build-icons` | Regenerates icons in `public/` from `assets/icon.svg`.    |
| `yarn workspace @id/client deploy`      | Uploads `build/` to the hosting bucket, then pre-renders. |
| `yarn workspace @id/client teardown`    | Empties the hosting bucket.                               |
