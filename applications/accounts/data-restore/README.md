# Accounts data restore

> Rolls the Accounts application table back to a recovery copy

A hand-deployed CDK stack with one Lambda that replaces every item in the application table with the items from a point-in-time recovery copy, pausing the table's stream consumers while it runs. Operators use it only when the table's data must be rolled back as a whole. Follow [docs/runbook.md](docs/runbook.md) to run a restore. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @accounts/data-restore test-ci
```

`yarn package` builds the shared packages this tool imports.

## Scripts

Run as `yarn workspace @accounts/data-restore <script>`.

| Script       | Purpose                                                                |
| ------------ | ---------------------------------------------------------------------- |
| `test`       | Vitest in watch mode.                                                  |
| `test-ci`    | One Vitest run with coverage.                                          |
| `lint`       | ESLint.                                                                |
| `typecheck`  | TypeScript.                                                            |
| `formatting` | Prettier check.                                                        |
| `build`      | Compiles with `tsc`.                                                   |
| `cdk`        | Runs the CDK CLI; the runbook uses it to deploy and destroy the stack. |
| `deploy`     | `cdk deploy --all`.                                                    |
| `teardown`   | `cdk destroy --all`.                                                   |
