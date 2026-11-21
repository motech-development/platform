# Accounts API architecture

## Purpose

`@accounts/api` (stack `accounts-<stage>-api`) is the AWS AppSync GraphQL API behind the Accounts client and the client's only API. Users authenticate with Auth0 through OpenID Connect; backend Lambdas authenticate with IAM to drive subscriptions. Most resolvers are VTL templates that read and write the application table directly; a few call the storage and reports HTTP APIs or the Accounts queue. See the [repository architecture](../../../../docs/architecture.md#how-accounts-works) for how it fits with the other Accounts services.

## Layout

| Path                                | Contents                                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema/`                           | GraphQL SDL, one file per area. `schema.graphql` holds `Query`, `Mutation` and `Subscription`. `appsync.graphql` declares the AppSync scalars for codegen only and is not deployed. |
| `mapping-templates/<area>/<field>/` | VTL for one resolver: `<Type>.<field>.req/res.vtl` and any `Pipeline.<function>.req/res.vtl`.                                                                                       |
| `mapping-templates/shared/`         | Pipeline functions reused across areas (validation, `getCompany`).                                                                                                                  |
| `serverless.yml`                    | AppSync API, resolver wiring, data sources, Lambdas, IAM and alarms.                                                                                                                |
| `src/handlers/`                     | Lambda entry points.                                                                                                                                                                |
| `src/shared/`                       | AppSync IAM client, beacon mutations, idempotent balance writes, transaction company helper, stream filter.                                                                         |
| `src/graphql/graphql.ts`            | Types generated from the schema and the `gql` operations in `src`.                                                                                                                  |
| `codegen.ts`                        | GraphQL Code Generator config.                                                                                                                                                      |

## Authorisation model

- Default mode is `OPENID_CONNECT` with issuer `https://<AUTH0_DOMAIN>/`; `AWS_IAM` is an additional mode. Fields without a directive accept only OIDC callers. `transactionBeacon`, `transactionChangeBeacon` and `notificationBeacon` are `@aws_iam` only; `Balance`, `BalanceVat`, `Notification`, `Transaction` and `TransactionChange` are `@aws_iam @aws_oidc` so both modes can read them.
- The caller's identity is their Accounts Owner ID (`ownerId` below): the `https://motechdevelopment.co.uk/owner_id` claim of the Auth0 access token, which the tenant's Set owner ID Action sets to the Auth0 user ID, or `$ctx.identity.sub` when the claim is missing. Templates read it through the `${ownerId}` substitution in `serverless.yml`. For users who existed before the claim, it equals their `ownerId`. Every item is stored with `owner` = `ownerId`. The checks the templates use:
  - **Owner check on read**: `GetItem`, then the response template returns `unauthorized` unless `result.owner == ownerId`.
  - **Owner condition on write**: `UpdateItem`/`DeleteItem` with condition `#owner = :owner`; a failed condition becomes an error, and an empty result becomes `unauthorized`.
  - **Owner-scoped query**: `Query` on `__typename-data-index` with `data` beginning with `<ownerId>:…` and a filter `owner = ownerId`.
  - **Company gate**: the `getCompany` pipeline function loads the `Company` by `$ctx.args.id` and enforces the owner check before later functions run.
- New items get `groupsCanAccess: ["Admin"]`, `createdAt`, and `data` built from the owner and parent ids so list queries can use the index.

## Resolvers

Data sources: **Data** (DynamoDB, application table), **Resolver** (`NONE`, local), **TransactionState** (Lambda `GetTransactionState`), **Reports** (HTTP, reports API, IAM-signed), **StorageUpload** (HTTP, storage API, IAM-signed), **Queue** (HTTP, SQS endpoint, IAM-signed).

### Companies

| Field                    | Kind / data source                                                                                               | Behaviour and authorisation                                                                                                                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getCompanies`     | Unit, Data                                                                                                       | Owner-scoped query of `Company` (`data` begins `<ownerId>`); returns `unauthorized` unless `args.id == ownerId`. Supports `count`/`nextToken`.                                                                                                                    |
| `Query.getCompany`       | Pipeline: `getCompany`                                                                                           | Owner check on read.                                                                                                                                                                                                                                              |
| `Mutation.createCompany` | Pipeline: `address`, `addressFiltering`, `companyNumber`, `telephone`, `vatRegistration`, `createCompany` (Data) | Validates, then one `TransactWriteItems` puts `Company`, `Balance` (opening balance, `GBP`, empty `items`), `BankSettings` (nulls), `Settings` (five protected categories, VAT, year end) and `Typeahead` (empty lists), all with a new id and owner = `ownerId`. |
| `Mutation.updateCompany` | Pipeline: `address`, `addressFiltering`, `companyNumber`, `telephone`, `updateCompany` (Data)                    | Owner-conditioned `UpdateItem`; empty-string fields are removed, others set; `data` = `<ownerId>:<name>`.                                                                                                                                                         |
| `Mutation.deleteCompany` | Pipeline: `deleteCompany` (Data), `queueCompanyDelete` (Queue)                                                   | Owner-conditioned delete of the `Company`, then `SendMessage` to the Accounts queue with attributes `id` and `owner`; `@accounts/queue` removes the rest. A non-200 from SQS becomes an error.                                                                    |

### Clients

| Field                   | Kind / data source                                                                                       | Behaviour and authorisation                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getClients`      | Unit, Data                                                                                               | Owner-scoped query, `data` begins `<ownerId>:<companyId>`.                                                                                                           |
| `Query.getClient`       | Unit, Data                                                                                               | Owner check on read.                                                                                                                                                 |
| `Mutation.createClient` | Pipeline: `address`, `addressFiltering`, `telephone`, `getClientCompanyId` (Data), `createClient` (Data) | `getClientCompanyId` loads the `Company` from `input.companyId` and requires owner = `ownerId`; then a conditional put with `data` = `<ownerId>:<companyId>:<name>`. |
| `Mutation.updateClient` | Pipeline: same validation, `getClientCompanyId`, `updateClient` (Data)                                   | Company owner check, then owner-conditioned update.                                                                                                                  |
| `Mutation.deleteClient` | Unit, Data                                                                                               | Owner-conditioned delete.                                                                                                                                            |

### Transactions and balance

| Field                              | Kind / data source                                                        | Behaviour and authorisation                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getBalance`                 | Unit, Data                                                                | Consistent `GetItem` of `Balance`; owner check on read.                                                                                                                                                                     |
| `Query.getTransactions`            | Unit, Data                                                                | Owner-scoped query, `data` begins `<ownerId>:<companyId>:<status>`; newest first for `confirmed`, oldest first for `pending`.                                                                                               |
| `Query.getTransaction`             | Unit, Data                                                                | Owner check on read.                                                                                                                                                                                                        |
| `Query.getTransactionState`        | Unit, TransactionState                                                    | Invokes `GetTransactionState` with `arguments` and `identity`; returned `errorType`/`errorMessage` become a GraphQL error. Returns `null` when the transaction is missing, not the caller's, or in another company.         |
| `Mutation.addTransaction`          | Pipeline: `getCompany` (on `input.companyId`), `addTransaction` (Data)    | Company owner check, then conditional put (`attribute_not_exists(id)`, idempotent on retry via `equalsIgnore: createdAt`); id from input or generated; owner = `ownerId`; `data` = `<ownerId>:<companyId>:<status>:<date>`. |
| `Mutation.updateTransaction`       | Pipeline: `getCompany` (on `input.companyId`), `updateTransaction` (Data) | Company owner check, then owner-conditioned update; writes `companyId` with `data`.                                                                                                                                         |
| `Mutation.deleteTransaction`       | Unit, Data                                                                | Owner-conditioned delete.                                                                                                                                                                                                   |
| `Mutation.transactionBeacon`       | Unit, Resolver (IAM only)                                                 | Echoes `{ id, owner, balance, vat }` to `Subscription.onTransaction`.                                                                                                                                                       |
| `Mutation.transactionChangeBeacon` | Unit, Resolver (IAM only)                                                 | Echoes `{ id, owner, transactionId }` to `Subscription.onTransactionChange`.                                                                                                                                                |
| `Subscription.onTransactionChange` | Unit, Resolver                                                            | Rejects the subscription unless `ownerId == args.owner`.                                                                                                                                                                    |
| `Subscription.onTransaction`       | Unit, Resolver                                                            | Rejects the subscription unless `ownerId == args.owner`.                                                                                                                                                                    |

### Settings and typeahead

| Field                     | Kind / data source                                   | Behaviour and authorisation                                          |
| ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| `Query.getSettings`       | Unit, Data                                           | Owner check on read.                                                 |
| `Mutation.updateSettings` | Pipeline: `vatRegistration`, `updateSettings` (Data) | Owner-conditioned update; `data` = `<ownerId>:<companyId>:Settings`. |
| `Query.getTypeahead`      | Unit, Data                                           | Owner check on read. Written by `@accounts/data`.                    |

### Storage

All three start with the `getCompany` gate on `args.id` (the company id).

| Field                    | Second function / data source    | Behaviour                                                                                                                                                      |
| ------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Mutation.requestUpload` | `requestUpload`, StorageUpload   | `POST /<stage>/api/v1/signed-upload` with `companyId`, `contentType`, `extension`, `metadata { id, typename }` and `owner` = `ownerId`; returns `{ id, url }`. |
| `Query.requestDownload`  | `requestDownload`, StorageUpload | `POST /<stage>/api/v1/signed-download` with `owner` = `ownerId` and `path`; returns `{ url }`.                                                                 |
| `Mutation.deleteFile`    | `deleteFile`, Queue              | `SendMessage` to the storage delete queue, delayed 300 s, attribute `key` = `<ownerId>/<path>`; returns `{ path }`.                                            |

Non-200 HTTP responses become GraphQL errors carrying the response body and status code.

### Reports

| Field                   | Kind / data source                                                      | Behaviour                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Mutation.createReport` | Pipeline: `getCompany` (on `input.companyId`), `createReport` (Reports) | `POST /<stage>/api/v1/generate-report/start` with `companyId`, `currency`, `owner` = `ownerId`, `status`, `year`, `yearEnd`; returns `{ status: "PENDING" }`. |
| `Query.getReports`      | Unit, Data                                                              | Owner-scoped query of `Report`, `data` begins `<ownerId>:<companyId>`.                                                                                        |

### Notifications

| Field                         | Kind / data source        | Behaviour and authorisation                                                                                                                                       |
| ----------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getNotifications`      | Unit, Data                | Owner-scoped query, `data` begins `<ownerId>:Notification`, newest first; `id` in the result is the caller's `ownerId`.                                           |
| `Mutation.markAsRead`         | Unit, Data                | `TransactWriteItems` setting `read = true` and `ttl` = now on each id, each conditioned on owner = `ownerId`; the response is `null` unless `args.id == ownerId`. |
| `Mutation.notificationBeacon` | Unit, Resolver (IAM only) | Echoes the notification to `Subscription.onNotification`.                                                                                                         |
| `Subscription.onNotification` | Unit, Resolver            | Rejects the subscription unless `ownerId == args.owner`.                                                                                                          |

### Shared pipeline functions

| Function           | Data source | Behaviour                                                                 |
| ------------------ | ----------- | ------------------------------------------------------------------------- |
| `address`          | Resolver    | Requires `line1` and `line3`; `line5` must match the UK postcode pattern. |
| `addressFiltering` | Resolver    | Drops empty-string address fields from the stash.                         |
| `companyNumber`    | Resolver    | Eight digits.                                                             |
| `telephone`        | Resolver    | UK telephone pattern.                                                     |
| `vatRegistration`  | Resolver    | Empty, or optional `GB` followed by 9 or 12 digits.                       |
| `getCompany`       | Data        | Loads `Company` by `$ctx.args.id`; owner check.                           |

The `mapping-templates/bank/` templates and `shared/bank`, `shared/bankSettings` are not wired into `serverless.yml` and `schema/bank.graphql` defines no root fields, so they are not deployed.

## Lambdas

All use Sentry (`init` + `wrapHandler`) and receive `SENTRY_ENVIRONMENT` and `SENTRY_DSN`. The stream function signs AppSync calls with their IAM role (`aws-appsync` client) using `AWS_REGION` and `ENDPOINT` (the API URL).

| Function              | Trigger                                                                      | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Env vars            |
| --------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `GetTransactionState` | `Query.getTransactionState`                                                  | Requires an identity with an `ownerId`, else returns `UnauthorizedException`. Consistent read of the `Transaction`; returns `null` unless owner = `ownerId` and the company (derived from `data`, falling back to `companyId`) equals the requested one. Configuration-class AWS errors are captured in Sentry and returned as `ConfigurationError`; others are thrown.                                                                                                                                                                                                                                                      | `TABLE`             |
| `PublishStream`       | Table stream, batch 10, `LATEST`, 4 retries, `ReportBatchItemFailures`, 60 s | Processes records in order. `Transaction` changes that move a confirmed amount are applied to the company `Balance` (see below); each `Balance` changed is then read back consistently and sent with `transactionBeacon` (malformed or missing balances are logged and skipped). `Transaction` INSERT/MODIFY/REMOVE: calls `transactionChangeBeacon`; on MODIFY that changed company, owner or id it also notifies the old scope. Inserted `Notification` items: calls `notificationBeacon` with `id` = owner and `read: false`. On the first failure it returns that record's sequence number so Lambda retries from there. | `ENDPOINT`, `TABLE` |

### Balances (`src/shared/apply-balance.ts`)

`PublishStream` is the only stream consumer that changes a `Balance` (see [ADR 0004](../../docs/adr/0004-read-the-application-table-stream-with-two-consumers.md)). Only a `confirmed` `Transaction` counts towards a `Balance`: the one keyed by its stored `companyId`. A confirmed transaction without a `companyId` is skipped. Earlier `updateTransaction` calls left `companyId` unchanged when `data` moved, so such a row keeps its amount on its stored `companyId` until its next edit writes both.

- A transaction that starts counting (inserted as `confirmed`, or changed to `confirmed`) adds its values.
- A transaction that stops counting (removed, or changed to `pending`) subtracts its old values.
- A transaction that stays confirmed applies the difference, moving amounts between daily buckets and VAT properties when the date or category changes.
- A transaction that stays confirmed but changes company subtracts its old values from the old company's `Balance` and adds its new values to the new company's.

Each change is one DynamoDB transaction that puts a `BalanceEvent` keyed by the stream `eventID` (condition: not already present, 7-day `ttl`) and updates each affected `Balance` (condition: it exists). A conditional-check cancellation is treated as already applied, so a retried record is not counted twice. Differences use `decimal.js`. Daily buckets are keyed by the transaction date's UTC midnight.

VAT: category `VAT payment` uses `amount`, others use `vat`. `VAT payment` and `Sales` go to `vat.owed`, everything else to `vat.paid`.

## Data

Reads and writes the application table owned by `@accounts/data` (see its [architecture](../../data/docs/architecture.md#data)). Item types touched by resolvers: `Company`, `Balance`, `BankSettings`, `Settings`, `Typeahead`, `Client`, `Transaction`, `Notification`, `Report`. `data` formats:

| `__typename`   | `data`                                                             |
| -------------- | ------------------------------------------------------------------ |
| `Company`      | `<owner>:<name>`                                                   |
| `Balance`      | `<owner>:<companyId>:Balance`                                      |
| `BankSettings` | `<owner>:<companyId>:BankSettings`                                 |
| `Settings`     | `<owner>:<companyId>:Settings`                                     |
| `Typeahead`    | `<owner>:<companyId>:Typeahead`                                    |
| `Client`       | `<owner>:<companyId>:<name>`                                       |
| `Transaction`  | `<owner>:<companyId>:<status>:<date>`                              |
| `Notification` | `<owner>:Notification:<createdAt>`                                 |
| `Report`       | `<owner>:<companyId>:<createdAt>` (written by `@accounts/reports`) |

Messages sent: Accounts queue `Delete company <id>` with attributes `id`, `owner`; storage delete queue `Delete file <key>` with attribute `key`.

## Infrastructure

Resources: the AppSync API `accounts-<stage>` (X-Ray on, `ERROR` logging), the two Lambdas, AppSync service roles for DynamoDB, reports, storage, queue and logging, a Lambda role for `GetTransactionState`, a role and an explicit event source mapping for the stream function, and an iterator-age alarm. Bundled with `serverless-esbuild`. Uses the `accounts-api-deployment-bucket` deployment bucket.

Output: `AccountsApiUrl` (not exported). On deploy `@motech-development/serverless-outputs-env` writes `REACT_APP_APPSYNC_URL` and `REACT_APP_AWS_REGION` to `../client/.env.production`.

Imports:

| Export                                                                                                                            | From                |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `<stage>-AccountsApplicationTable`, `…TableArn`, `…TableStreamArn`, `<stage>-AccountsStreamProcessingFailureBucketArn`            | `@accounts/data`    |
| `<stage>-AccountsReportsApiEndpoint`, `<stage>-AccountsReportsApiArn`                                                             | `@accounts/reports` |
| `<stage>-StorageUploadApiEndpoint`, `<stage>-StorageUploadApiArn`, `<stage>-DeleteFileQueueUrlPath`, `<stage>-DeleteFileQueueArn` | `@accounts/storage` |
| `<stage>-AccountsQueueUrl`, `<stage>-AccountsQueueArn`                                                                            | `@accounts/queue`   |

VTL substitutions: `appTable`, `deleteFileQueue`, `queue`, `stage`.

IAM in plain terms:

- AppSync can get, put, update, delete, query and scan the application table and its index; invoke the reports and storage APIs; send to the Accounts queue and the storage delete queue; and write its own logs.
- `GetTransactionState` can only get table items and write its own logs.
- `PublishStream` can read the table stream, get, put and update table items, call only the three beacon mutations, write to the stream failure bucket and write logs.

## Failure handling and observability

- Sentry captures unhandled Lambda errors, `PublishStream` record failures and `GetTransactionState` configuration errors.
- `PublishStream` checkpoints by sequence number, so successful records before a failure are not republished. After 4 retries the batch goes to `@accounts/data`'s stream failure bucket and stream-processing dead-letter queue (see ADRs [0002](../../docs/adr/0002-retain-exhausted-stream-batches-for-balance-and-attachment-processing.md) and [0004](../../docs/adr/0004-read-the-application-table-stream-with-two-consumers.md)).
- Alarm `accounts-<stage>-publish-stream-iterator-age` fires when stream lag reaches 15 minutes and invokes `accounts-data-<stage>-ReportSchedulingAlarm`, which reports to Sentry.
- AppSync logs errors only; Lambda log retention is 30 days.

## Testing

Vitest; Lambda tests are in `src/handlers/__tests__/`. `src/setupTests.ts` mocks `@motech-development/node-logger` and replaces `AWSAppSyncClient.prototype.mutate` with a spy; DynamoDB is mocked with `aws-sdk-client-mock`. VTL templates have no automated tests. Files run serially.

```sh
yarn workspace @accounts/api vitest run src/handlers/__tests__/publish-stream.test.ts
```

To check the resolved Serverless configuration without deploying, use placeholder values:

```sh
AUTH0_DOMAIN=example.invalid SENTRY_DSN= yarn workspace @accounts/api exec serverless print --stage local
```

## Making changes

- After editing `schema/` or a `gql` operation in `src`, run `yarn workspace @accounts/api codegen.graphql` to regenerate `src/graphql/graphql.ts`. The client has its own generated types; update them too when the schema changes.
- A new schema file must be added to `appSync.schema` in `serverless.yml`; a new resolver or pipeline function must be wired there as well.
- Keep the `data` formats in step with `@accounts/data` (typeahead, scheduling and attachment handlers query or rewrite them) and `@accounts/data-restore`.
- New beacon mutations need `@aws_iam`, and the stream role's `appsync:GraphQL` grant lists each beacon field explicitly.
- Deploy after `@accounts/data`, `@accounts/storage`, `@accounts/queue` and `@accounts/reports`, whose exports it imports.
