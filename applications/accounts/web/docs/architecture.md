# Accounts web architecture

## Purpose

A blank starting point for rebuilding Accounts. The app is a static HTML placeholder built and served by Vite; no application framework or UI library has been selected.

The previous screens, authentication, data clients, routing, PWA, application tests, and assets were intentionally removed in the reset. The earlier migration specification is historical context, not a claim that the placeholder provides those capabilities. The legacy Accounts client remains in `../client` ([`@accounts/client`](../../client/)). See the [repository architecture](../../../../docs/architecture.md) for the wider picture.

## Layout

| Path                         | Contents                                                                 |
| ---------------------------- | ------------------------------------------------------------------------ |
| `index.html`                 | The placeholder page.                                                    |
| `vite.config.ts`             | Dev and preview servers on port 8080 (`strictPort`).                     |
| `cdk.json`                   | Runs `infrastructure/app.ts` with `tsx`.                                 |
| `infrastructure/app.ts`      | CDK app: one stack, `accounts-web-hosting`.                              |
| `infrastructure/stack.ts`    | `AccountsWebStack`: the Amplify app, branches and domain.                |
| `infrastructure/stage.ts`    | Stage parsing and the stage-to-branch and stage-to-URL mapping.          |
| `infrastructure/deploy.ts`   | Exact-commit deployment command.                                         |
| `infrastructure/teardown.ts` | Preview Environment teardown command.                                    |
| `infrastructure/*.test.ts`   | Vitest tests for the above; `hosting-command.fixture.ts` fakes the CLIs. |

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

The root `amplify.yml` builds this workspace and publishes `dist/`. The SPA rewrite serves `index.html`.

CI/CD has been restored to commit `1c2b0a711657c61423d7a83fd613d12603b9b05a`, before the Accounts web rewrite. This workspace is private so the root release command excludes it, and it is outside the Deployment Catalog: automated Release, Develop, production, preview deployment, and preview teardown do not manage it. Existing Amplify resources are retained. The legacy client uses its original deployment and browser validation pipelines.

Reconciliation, deployment, and teardown commands change AWS or remote Git state; local build and tests do not deploy anything.

### Hosting stack

`yarn workspace @accounts/web reconcile` deploys the `accounts-web-hosting` CDK stack (region from `CDK_DEFAULT_REGION`, default `eu-west-1`). It contains:

| Resource                      | Detail                                                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccountsWebApp`              | Amplify app `accounts-web`, platform `WEB`, connected to the repository, `AMPLIFY_MONOREPO_APP_ROOT=applications/accounts/web`, branch auto-deletion on. A custom rule rewrites any path without a static-asset extension to `/index.html` with status `200`. |
| `AccountsWebDevelopBranch`    | `amplify/develop`, stage `DEVELOPMENT`.                                                                                                                                                                                                                       |
| `AccountsWebProductionBranch` | `amplify/production`, stage `PRODUCTION`, an isolated production candidate that receives no legacy traffic.                                                                                                                                                   |
| `AccountsWebDomain`           | Maps an `accounts-develop` subdomain to the Develop branch.                                                                                                                                                                                                   |

Both branches have auto-build, performance mode and pull request previews off, so builds happen only through the deploy command. The stack outputs `AmplifyAppId` and `AmplifyDefaultDomain` (CloudFormation outputs, not exports) and tags everything `Application=accounts-web`.

### Stages

`infrastructure/stage.ts` accepts only `--stage develop`, `--stage production` or `--stage pr-<number>`, and maps a stage to the Git branch `amplify/<stage>`. The deploy command reports the Develop stage at its custom subdomain and every other stage at Amplify's default `amplify-<stage>.<appId>` domain.

### Deploy command

`yarn workspace @accounts/web deploy --stage <stage> [--commit <revision>]` (default `HEAD`):

1. Resolves the revision to a commit ID and reads `AmplifyAppId` from the `accounts-web-hosting` stack.
2. Force-pushes that commit to `amplify/<stage>` on `origin`.
3. For a `pr-<number>` stage, creates the Amplify branch if it does not exist (stage `DEVELOPMENT`, no auto-build, no previews); any lookup error other than `NotFoundException` is rethrown.
4. Clears the branch's environment variables, leaving app-level settings alone.
5. Starts a `RELEASE` job for that commit, then polls every 20 seconds while the job is `CREATED`, `PENDING`, `PROVISIONING` or `RUNNING`, streaming new build log output to stderr.
6. Fails unless the job ends `SUCCEED` at the requested commit. On success it prints one JSON line with `amplify.appId`, `amplify.branchName`, `amplify.jobId`, `commitId` and `url`.

It shells out to `git`, the `aws` CLI and `curl`, so those must be on the path with credentials for the target account.

### Teardown command

`yarn workspace @accounts/web teardown --stage pr-<number>` refuses any non-preview stage. It deletes the Amplify branch, then the `amplify/<stage>` Git branch on `origin`. A missing hosting stack, Amplify branch or remote ref is treated as already absent; any other error fails the command.

## Testing

Tests are in `infrastructure/*.test.ts`. `stack.test.ts` asserts the synthesised template; the deploy and teardown tests replace `child_process` calls with the fixture in `hosting-command.fixture.ts` and assert the exact command sequence. Run them with:

```sh
yarn workspace @accounts/web exec vitest run infrastructure
```

## Making changes

- The rewrite rule's extension list decides which paths are served as files; add an extension there if a new static asset type is served.
- `stage.ts` is shared by deploy and teardown; keep the branch naming (`amplify/<stage>`) in step with the stack's branch names.
- Changes to the stack are applied only by running `reconcile` by hand.
