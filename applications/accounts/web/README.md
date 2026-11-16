# Accounts web

> Placeholder for the Accounts rebuild

A static HTML placeholder, built and served by Vite, that will become the replacement for [`@accounts/client`](../client/). It is hosted on AWS Amplify and is outside the Deployment Catalog. See [docs/architecture.md](docs/architecture.md) for how it works and how hosting is managed.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @accounts/web start
```

Open http://localhost:8080 and edit `index.html`.

## Scripts

Run as `yarn workspace @accounts/web <script>`.

| Script       | Purpose                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `start`      | Vite dev server on port 8080.                                                       |
| `build`      | Production build to `dist/`.                                                        |
| `serve`      | Serves the production build on port 8080.                                           |
| `test`       | Vitest in watch mode.                                                               |
| `test-ci`    | One Vitest run with coverage.                                                       |
| `lint`       | ESLint.                                                                             |
| `typecheck`  | TypeScript.                                                                         |
| `formatting` | Prettier check.                                                                     |
| `cdk`        | Runs the CDK CLI.                                                                   |
| `reconcile`  | Deploys the `accounts-web-hosting` stack. Changes AWS.                              |
| `deploy`     | Deploys a commit to an Amplify branch (`--stage`, `--commit`). Changes AWS and Git. |
| `teardown`   | Removes a Preview Environment branch (`--stage pr-<number>`). Changes AWS and Git.  |
