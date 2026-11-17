# Accounts data restore architecture

## Purpose

`@accounts/data-restore` is a hand-deployed CDK stack with one Lambda that replaces every item in the Accounts application table with the items from a source table, normally a point-in-time recovery copy. It pauses and later resumes the table's stream consumers so other services do not react to the restore. It is outside the Deployment Catalog. The operational procedure is in the [runbook](runbook.md); this page describes the stack and code. See the [repository architecture](../../../../docs/architecture.md) for the wider picture.

## Layout

| Path                                 | Contents                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `bin/infrastructure.ts`              | CDK app entry. Reads `source` and `target` context and creates the stack. |
| `lib/data-restore-stack.ts`          | `DataRestoreStack`: the Lambda and its permissions.                       |
| `lib/__tests__/`                     | Snapshot test of the synthesised template.                                |
| `src/data-restore.ts`                | The Lambda handler.                                                       |
| `src/__tests__/data-restore.test.ts` | Handler tests.                                                            |
| `cdk.json`                           | Runs the app with `ts-node`, plus CDK feature flags.                      |

## Stack

`bin/infrastructure.ts` creates one stack, `DataRestoreStack`, in the account and region from `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION`. Synthesis throws if the `source` or `target` context value is missing, or if they are the same table:

```sh
yarn cdk deploy -c source=<source table> -c target=<target table>
```

The stack imports both tables by name (`Table.fromTableAttributes`) and creates:

| Resource                        | Detail                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NodejsFunction` `data-restore` | Function name `data-restore`, Node.js 24, 15-minute timeout, minified bundle of `src/data-restore.ts`. Env vars `SOURCE`, `TARGET` (table names) and `LOG_LEVEL=debug`. |

Permissions, in plain terms:

- read the source table;
- read and write the target table (including `DescribeTable`, used to find its stream);
- list Lambda event source mappings (any) and read CloudWatch metric data (any);
- get and update event source mappings in the stack's account and region.

It has no exports, imports, alarms or Sentry integration. Logging uses `@motech-development/node-logger`.

## Handler

Invoke the function directly with `{ "action": "restore" | "resume" | "release" }`. Any other value, or a missing `SOURCE`/`TARGET`, throws.

Every action first finds the consumers: it describes the target table, takes its `LatestStreamArn` and lists the event source mappings on it. It throws if the table has no stream, if there are no mappings, or if the list has a second page (`NextMarker`), before changing anything.

| Action    | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `restore` | Disables every mapping not already `Disabled`, polling each every 5 seconds until it reports `Disabled`. Then runs the quiet check, clears the target and copies the source (below). Clear and copy errors are logged and rethrown, and the mappings stay disabled. Errors while pausing or in the quiet check are thrown without that log line, and a failed pause can leave some mappings enabled; running `restore` again disables them. |
| `resume`  | Sleeps 120 seconds (twice the 60-second maximum record age), then sets every mapping to `Enabled: true` with `MaximumRecordAgeInSeconds: 60` and waits for each to report `Enabled`.                                                                                                                                                                                                                                                        |
| `release` | Throws `Resume target table consumers before releasing them` unless every mapping is `Enabled`. Otherwise sets `MaximumRecordAgeInSeconds: -1` on each and waits for `Enabled`.                                                                                                                                                                                                                                                             |

The stream itself is never modified.

### Quiet check

A `Disabled` mapping can still deliver records for a short time, so `restore` does not trust the state alone. It waits 60 seconds, writes a canary item (`__typename` `DataRestoreCanary`) to the target, then waits 5 minutes to cover the canary's delivery, the longest consumer timeout and metric publication. It then reads each consumer function's CloudWatch `Invocations` from the canary's minute onwards. If any consumer was invoked, or the counts are incomplete, it throws and asks for `restore` to be run again; the mappings stay disabled. The clear removes the canary.

### Clear and copy

- **Clear**: scans the target page by page. Each page is split into chunks of 25 and deleted with `BatchWriteItem` using the key `{ __typename, id }`, all chunks in parallel. It follows `LastEvaluatedKey` until the scan is complete.
- **Copy**: scans the source page by page, unmarshalls and re-marshalls each item, and writes chunks of 25 with `BatchWriteItem` `PutRequest`s in parallel, following `LastEvaluatedKey`.
- **Retries**: unprocessed items from any `BatchWriteItem` are retried with exponential backoff (`2^attempt × 100` ms) up to 5 attempts in total, then the write throws `Unable to write <n> items to <table>`.

Everything happens in one invocation, so the table must clear and copy within the 15-minute timeout, six minutes of which are the quiet check. The handler is safe to run again from the start after a failure: the clear removes anything partially copied.

## Testing

`src/__tests__/data-restore.test.ts` stubs the DynamoDB and Lambda clients with `aws-sdk-client-mock` and uses `aws-lambda-mock-context`. It covers pagination, chunking, unprocessed-item retries, the consumer checks and each action. `sleep` resolves immediately when `NODE_ENV` is `test`. `lib/__tests__/data-restore-stack.test.ts` compares the synthesised template with a snapshot; update the snapshot deliberately when the stack changes.

Run one file from the repository root:

```sh
yarn workspace @accounts/data-restore exec vitest run src/__tests__/data-restore.test.ts
```

## Making changes

- The key used by the clear step (`__typename`, `id`) must match the application table's primary key, defined in `@accounts/data`.
- The 60-second record age and 120-second wait are tied to the runbook's release gate. Change them together.
- If the table ever gets more mappings than one `ListEventSourceMappings` page returns, the handler refuses to run; add pagination rather than removing the check.
- The stack is deployed and destroyed by hand for each restore; follow the [runbook](runbook.md).
