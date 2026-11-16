# Serverless outputs env architecture

## Purpose

A Serverless Framework plugin that, after a deploy, reads the stack's CloudFormation outputs and writes a chosen subset to one or more env files. `@accounts/api` uses it to hand deployed values to the client build. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                        | Contents                          |
| --------------------------- | --------------------------------- |
| `src/outputs-env-plugin.ts` | The plugin class (default export) |
| `src/typings.d.ts`          | Types for `tomlify-j0.4`          |
| `src/__tests__/`            | Vitest tests                      |

## API reference

### `default` — `class OutputsEnvPlugin`

`new OutputsEnvPlugin(serverless, options)` — constructed by Serverless. Exported types: `IServerlessInstance`, `IServerlessOptions` (`{ noDeploy?: boolean }`), `IServerlessCli`.

**Hook:** `after:deploy:deploy`.

**Configuration** (`custom.outputs`):

| Key     | Type                     | Meaning                                           |
| ------- | ------------------------ | ------------------------------------------------- |
| `files` | `string[]`               | Paths to write; every file gets identical content |
| `env`   | `Record<string, string>` | Stack output key → variable name to write         |

**Flow:**

1. Validate: `provider.name` must be `aws` and `--noDeploy` must not be set. A failed check logs `Cannot process Stack Output: <reason>!` and returns without error.
2. Call `CloudFormation.describeStacks` through the Serverless AWS provider for `provider.stackName`, or `<provider name>-<stage>` if unset, in the provider region.
3. Build a map of `OutputKey → OutputValue` from the last stack returned, seeded with `AWS_REGION` = provider region. If the stack has no outputs, throws `No output found.` (fails the deploy command).
4. Keep only keys listed in `env`, renamed to their target names; keys missing from the outputs are skipped silently.
5. Serialise with `tomlify-j0.4` (`KEY = "value"` lines) and write each file, overwriting it. Logs `.env file has been written in requested locations`.

## Design notes

- `AWS_REGION` is always available to map, even though it is not a real stack output.
- TOML string syntax is used because it is compatible with dotenv parsing for simple values.
- The unusual default stack name (`<provider name>-<stage>`, i.e. `aws-<stage>`) only matters when `provider.stackName` is unset; set it explicitly.

## Testing

Vitest with the Serverless instance stubbed. Run one file:

```bash
yarn workspace @motech-development/serverless-outputs-env vitest run src/__tests__/outputs-env-plugin.ts
```

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
