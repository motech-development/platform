# Accounts data architecture

## Purpose

`@accounts/data` (stack `accounts-<stage>-data`) owns the DynamoDB application table that holds every Accounts record, and the Lambdas that keep derived data in step with it: balances and VAT totals, typeahead suggestions, attachment clean-up, scheduled-transaction publication and alarm reporting. Most other Accounts stacks import the table from here. See the [repository architecture](../../../../docs/architecture.md#the-application-table) for the data model and [scheduled transactions](../../../../docs/architecture.md#scheduled-transactions). Design decisions are recorded in the [Accounts ADRs](../../docs/adr/).

## Layout

| Path                                 | Contents                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `serverless.yml`                     | Table, functions, queues, failure buckets, alarms, schedule group, IAM.                                    |
| `src/*.ts`                           | One Lambda entry point per file.                                                                           |
| `src/handlers/`                      | Per-event-type logic used by the entry points (insert/update/remove transactions, typeahead, attachments). |
| `src/shared/balance.ts`              | Idempotent balance writes.                                                                                 |
| `src/shared/aggregated-day.ts`       | Rounds a date down to UTC midnight for daily balance buckets.                                              |
| `src/shared/publication-command.ts`  | Shape of a scheduled publication message.                                                                  |
| `src/shared/publish-notification.ts` | Writes a `Notification` item.                                                                              |
| `src/shared/unmarshall-records.ts`   | Filters stream records by `__typename` and unmarshalls images.                                             |
| `src/shared/extract-stream.ts`       | Splits stream records into inserts, updates and removals; requires `TABLE`.                                |
| `src/shared/transaction.ts`          | `ITransaction` and `TransactionStatus` (`confirmed`, `pending`).                                           |

## Components

All handlers use Sentry (`init` + `wrapHandler`); every function receives `SENTRY_ENVIRONMENT` (the stage) and `SENTRY_DSN`.

| Function                | Trigger                                                                                | Env vars                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Transactions`          | Table stream, `LATEST`, 4 retries, on-failure to stream failure bucket                 | `TABLE`                                                                                       |
| `Typeahead`             | Table stream, `LATEST`, 4 retries                                                      | `TABLE`                                                                                       |
| `Attachments`           | Table stream, `LATEST`, 4 retries, on-failure to stream failure bucket                 | `ATTACHMENT_QUEUE`                                                                            |
| `ScheduleTransactions`  | Table stream, batch size 1, `LATEST`, 4 retries, on-failure to schedule failure bucket | `PUBLICATION_QUEUE_ARN`, `SCHEDULE_GROUP`, `SCHEDULER_DELIVERY_DLQ_ARN`, `SCHEDULER_ROLE_ARN` |
| `PublishTransactions`   | Publication queue, batch size 1, 30 s timeout                                          | `TABLE`                                                                                       |
| `ClearAttachments`      | Anti-virus failure queue, `ReportBatchItemFailures`                                    | `BUCKET`, `TABLE`                                                                             |
| `ReportSchedulingAlarm` | CloudWatch alarm actions                                                               | none beyond Sentry                                                                            |

### `Transactions`

Handles `Transaction` items only and applies writes one at a time, in order:

- **Insert** of a `confirmed` transaction adds it to the company's `Balance`.
- **Modify**: `pending` to `confirmed` adds; `confirmed` to `pending` subtracts the old values; `pending` to `pending` is ignored; otherwise applies the difference, moving amounts between daily buckets and VAT properties when the date or category changes.
- **Remove** of a `confirmed` transaction subtracts it.

Each write is a DynamoDB transaction that puts a `BalanceEvent` keyed by the stream `eventID` (condition: not already present, 7-day `ttl`) and updates the `Balance` (condition: it exists). A conditional-check cancellation is treated as already applied, so retries are idempotent. Amounts use `decimal.js` for differences.

VAT: category `VAT payment` uses `amount`, others use `vat`. `VAT payment` and `Sales` go to `vat.owed`, everything else to `vat.paid`.

### `Typeahead`

For inserted and modified `Transaction` items, groups by `companyId` (throws if one company has transactions from different owners), merges into the company's `Typeahead` item: `Sales` descriptions into `sales`, other descriptions into `purchases` and names into `suppliers`, all sorted and de-duplicated. Skips the write when nothing changed. The update is conditional on the previously read values (optimistic concurrency) and on the owner matching; a mismatched owner throws. Sets `data` to `<owner>:<companyId>:Typeahead` and `groupsCanAccess` to `['Admin']` if absent.

### `Attachments`

For removed `Transaction` items with an `attachment`, sends one `SendMessageBatch` to the storage delete queue: `DelaySeconds` 300, `Id` the transaction id, attribute `key` = `<owner>/<attachment>`. Throws if any entry fails.

### `ScheduleTransactions`

Keeps one EventBridge Scheduler schedule per scheduled transaction (`scheduled` true and `status` `pending`), named `transaction-<id>` in the group `accounts-<stage>-scheduled-transactions`. Records are processed sequentially:

- Insert of a scheduled transaction creates a schedule (updates on conflict).
- Modify: became scheduled creates; stopped being scheduled deletes; still scheduled with a new `date` updates (creates if missing).
- Remove of a scheduled transaction deletes the schedule (missing is fine).

Each schedule is a one-off `at(<date>)` in UTC, deleted after completion, targeting the publication queue with input `{ expectedScheduledTime, transactionId }`, the scheduler role, a delivery DLQ, and a retry policy of 185 attempts within 24 hours.

### `PublishTransactions`

Parses the publication command (throws on invalid shape), reads the transaction with a consistent read, and returns without action unless it is still `pending`, `scheduled` and has `date` equal to `expectedScheduledTime`. Otherwise it transactionally sets `status` to `confirmed`, `scheduled` to false, `data` to `<owner>:<companyId>:confirmed:<date>` and `updatedAt`, and puts a `Notification` with message `TRANSACTION_PUBLISHED`. A condition failure is treated as already handled. Other errors fail the message, which SQS retries.

### `ClearAttachments`

Processes each anti-virus failure message independently. Ignores messages whose `source` is not the storage upload bucket (`BUCKET`) or whose `key` or `metadata` attribute has no value; a message missing one of the three attributes entirely fails and is returned as a batch item failure. Splits the decoded key into `owner/companyId/file`, queries `__typename-data-index` for items of the metadata `typename` whose `data` begins with `<owner>:<companyId>` and whose `attachment` equals `<companyId>/<file>` (all pages), removes `attachment` from each match and writes a `VIRUS_SCAN_FAIL` notification for its owner. When nothing matches and the message was sent less than 10 minutes ago, returns it as a batch item failure without reporting it, so the queue redelivers it once the transaction may have been saved. Failed messages are returned as batch item failures and captured in Sentry.

### `ReportSchedulingAlarm`

Invoked directly by CloudWatch alarms whose names start with `accounts-<stage>-`. Recognises names ending in `-dlq-messages-visible` (failure, tagged with the queue name) and `-iterator-age` (stream lag, tagged with the function name). Sends an error `Accounts <boundary> failure|stream lag` to Sentry with the alarm ARN, reason and resource, then flushes; throws if the name is unrecognised or the flush fails. Alarms from `@accounts/storage` and `@core/anti-virus` also target this function.

## Data

**Application table** `accounts-<stage>-application`: on-demand, partition key `id`, sort key `__typename`, GSI `__typename-data-index` (`__typename` + `data`, all attributes), stream `NEW_AND_OLD_IMAGES`, point-in-time recovery, TTL on `ttl`. Develop and production retain the table if it is removed from the stack or replaced; previews delete it. A retained table keeps its name, so a removed develop or production stack can't be redeployed directly. First create `accounts-<stage>-data` with a CloudFormation import change set whose template contains only the table, then deploy normally to add the rest.

Item types this workspace reads or writes:

| `__typename`   | Key `id`        | Fields used here                                                                                                                           |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Transaction`  | transaction id  | `amount`, `attachment`, `category`, `companyId`, `date`, `description`, `name`, `owner`, `scheduled`, `status`, `vat`, `data`, `updatedAt` |
| `Balance`      | company id      | `balance`, `vat.owed`, `vat.paid`, `items.<UTC midnight ISO date>`, `updatedAt`                                                            |
| `BalanceEvent` | stream event id | `ttl` (7 days)                                                                                                                             |
| `Typeahead`    | company id      | `owner`, `purchases`, `sales`, `suppliers`, `data`, `groupsCanAccess`, `createdAt`, `updatedAt`                                            |
| `Notification` | UUID            | `owner`, `message` (`TRANSACTION_PUBLISHED`, `VIRUS_SCAN_FAIL`), `read` false, `createdAt`, `data` = `<owner>:Notification:<createdAt>`    |

**Publication queue message**: JSON `{ "expectedScheduledTime": "<transaction date>", "transactionId": "<id>" }`.

**Failure buckets** `accounts-<stage>-stream-processing-failures-<account>` and `accounts-<stage>-schedule-sync-failures-<account>`: Lambda on-failure records for exhausted stream batches, encrypted, public access blocked, expire after 14 days.

## Infrastructure

Resources: the table; the scheduler group and the scheduler role (can only send to the publication queue and the delivery DLQ, assumable only by Scheduler for this group); the publication queue (visibility 180 s, DLQ after 5 receives) and DLQs for publication, scheduler delivery, stream processing and schedule synchronisation (14-day retention); the two failure buckets with EventBridge rules that forward each new object to the matching DLQ; DLQ and iterator-age alarms; and the alarm reporter's invoke permission for alarms named `accounts-<stage>-*`.

Exports: `<stage>-AccountsApplicationTable`, `<stage>-AccountsApplicationTableArn`, `<stage>-AccountsApplicationTableStreamArn`.

Imports: `<stage>-DeleteFileQueueUrl`, `<stage>-DeleteFileQueueArn`, `<stage>-StorageUploadBucket` (from `@accounts/storage`) and `<stage>-AntiVirusFailureQueueArn` (from `@core/anti-virus`).

IAM in plain terms:

- The shared data role (`Transactions`, `Typeahead`, `Attachments`, `ClearAttachments`) can read the stream, get, put, query and update the table and its index, send to the delete queue, consume the anti-virus failure queue, write to the stream failure bucket and write logs.
- `ScheduleTransactions` can read the stream, create, update and delete `transaction-*` schedules in its group, pass the scheduler role to Scheduler only, write to the schedule failure bucket and write logs.
- `PublishTransactions` can get, put and update table items, consume the publication queue and write logs.
- `ReportSchedulingAlarm` can only write logs.

## Failure handling and observability

See [ADR 0002](../../docs/adr/0002-retain-exhausted-stream-batches-for-balance-and-attachment-processing.md) and [ADR 0003](../../docs/adr/0003-report-dead-letter-and-stream-lag-alarms-through-one-reporter.md).

| Boundary                      | Retry                             | After exhaustion                                           | Alarm (`accounts-<stage>-…`)                                                          |
| ----------------------------- | --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `Transactions` stream         | 4 retries                         | Stream failure bucket, then stream-processing DLQ          | `stream-processing-dlq-messages-visible`, `transactions-iterator-age`                 |
| `Attachments` stream          | 4 retries                         | Stream failure bucket, then stream-processing DLQ          | same DLQ alarm, `attachments-iterator-age`                                            |
| `Typeahead` stream            | 4 retries                         | Dropped (no on-failure destination)                        | `typeahead-iterator-age`                                                              |
| `ScheduleTransactions` stream | 4 retries, batch size 1           | Schedule failure bucket, then schedule-synchronisation DLQ | `schedule-synchronisation-dlq-messages-visible`, `schedule-transactions-iterator-age` |
| Scheduler delivery            | 185 attempts in 24 h              | Scheduler delivery DLQ                                     | `scheduler-delivery-dlq-messages-visible`                                             |
| Publication queue             | 5 receives                        | Publication processing DLQ                                 | `publication-processing-dlq-messages-visible`                                         |
| Anti-virus failure queue      | 15 receives (owned by anti-virus) | Anti-virus failure DLQ                                     | `anti-virus-failure-dlq-messages-visible`                                             |

DLQ alarms fire on one visible message; iterator-age alarms fire at 15 minutes (900000 ms). All invoke `ReportSchedulingAlarm`. Balance writes are idempotent by stream event id, so retried batches do not double-count. Log retention is 30 days.

## Testing

Vitest. Entry-point tests are in `src/__tests__/`, logic tests in `src/handlers/__tests__/` and `src/shared/__tests__/`. `src/setupTests.ts` loads the `aws-sdk-client-mock-vitest` matchers and mocks `@motech-development/node-logger` and `uuid`. AWS clients are mocked with `aws-sdk-client-mock`. Files run serially.

```sh
yarn workspace @accounts/data vitest run src/__tests__/transactions.test.ts
```

## Making changes

- Deploy after `@core/anti-virus` and `@accounts/storage`. Changing the table's keys or index replaces it and breaks every importing stack; restore with [`@accounts/data-restore`](../../data-restore/).
- `Transaction` fields and `data` formats are shared with the VTL resolvers in `@accounts/api`; change them together.
- The publication command shape is written by `ScheduleTransactions` and read by `PublishTransactions`; existing schedules keep their old input until they fire.
- New alarms must be named `accounts-<stage>-<boundary>-dlq-messages-visible` or `…-iterator-age`, or the reporter rejects them.
- The failure message from anti-virus (`key`, `source`, `metadata`) must match what `clear-attachments` expects.
