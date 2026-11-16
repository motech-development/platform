# Anti-virus

> Scans uploaded files with ClamAV

A shared service that scans every file uploaded to Accounts storage before anyone can download it. `@accounts/storage` queues new uploads here, and `@accounts/data` handles the failures. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn package
yarn workspace @core/anti-virus test-ci
```

Building the ClamAV binaries (`predeploy`) needs Docker.

## Scripts

| Script               | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `test`               | Vitest in watch mode.                              |
| `test-ci`            | One Vitest run with coverage.                      |
| `lint`               | ESLint.                                            |
| `typecheck`          | TypeScript.                                        |
| `formatting`         | Prettier check.                                    |
| `predeploy`          | Builds the ClamAV binaries.                        |
| `deploy`             | Builds the binaries and deploys the stack.         |
| `teardown`           | Removes the stack.                                 |
| `clean`              | Removes build output and the builder container.    |
| `update-definitions` | Invokes the deployed `UpdateDefinitions` function. |
