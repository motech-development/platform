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
| `src/shared/`                       | AppSync IAM client, beacon mutations, transaction company helper, stream filter.                                                                                                    |
| `src/graphql/graphql.ts`            | Types generated from the schema and the `gql` operations in `src`.                                                                                                                  |
| `codegen.ts`                        | GraphQL Code Generator config.                                                                                                                                                      |

## Authorisation model

- Default mode is `OPENID_CONNECT` with issuer `https://<AUTH0_DOMAIN>/`; `AWS_IAM` is an additional mode. Fields without a directive accept only OIDC callers. `transactionBeacon`, `transactionChangeBeacon` and `notificationBeacon` are `@aws_iam` only; `Balance`, `BalanceVat`, `Notification`, `Transaction` and `TransactionChange` are `@aws_iam @aws_oidc` so both modes can read them.
- The caller's identity is `$ctx.identity.sub`. Every item is stored with `owner` = that `sub`. The checks the templates use:
  - **Owner check on read**: `GetItem`, then the response template returns `unauthorized` unless `result.owner == sub`.
  - **Owner condition on write**: `UpdateItem`/`DeleteItem` with condition `#owner = :owner`; a failed condition becomes an error, and an empty result becomes `unauthorized`.
  - **Owner-scoped query**: `Query` on `__typename-data-index` with `data` beginning with `<sub>:…` and a filter `owner = sub`.
  - **Company gate**: the `getCompany` pipeline function loads the `Company` by `$ctx.args.id` and enforces the owner check before later functions run.
- New items get `groupsCanAccess: ["Admin"]`, `createdAt`, and `data` built from the owner and parent ids so list queries can use the index.

## Resolvers

Data sources: **Data** (DynamoDB, application table), **Resolver** (`NONE`, local), **TransactionState** (Lambda `GetTransactionState`), **Reports** (HTTP, reports API, IAM-signed), **StorageUpload** (HTTP, storage API, IAM-signed), **Queue** (HTTP, SQS endpoint, IAM-signed).

### Companies

| Field                    | Kind / data source                                                                                               | Behaviour and authorisation                                                                                                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getCompanies`     | Unit, Data                                                                                                       | Owner-scoped query of `Company` (`data` begins `<sub>`); returns `unauthorized` unless `args.id == sub`. Supports `count`/`nextToken`.                                                                                                                        |
| `Query.getCompany`       | Pipeline: `getCompany`                                                                                           | Owner check on read.                                                                                                                                                                                                                                          |
| `Mutation.createCompany` | Pipeline: `address`, `addressFiltering`, `companyNumber`, `telephone`, `vatRegistration`, `createCompany` (Data) | Validates, then one `TransactWriteItems` puts `Company`, `Balance` (opening balance, `GBP`, empty `items`), `BankSettings` (nulls), `Settings` (five protected categories, VAT, year end) and `Typeahead` (empty lists), all with a new id and owner = `sub`. |
| `Mutation.updateCompany` | Pipeline: `address`, `addressFiltering`, `companyNumber`, `telephone`, `updateCompany` (Data)                    | Owner-conditioned `UpdateItem`; empty-string fields are removed, others set; `data` = `<sub>:<name>`.                                                                                                                                                         |
| `Mutation.deleteCompany` | Pipeline: `deleteCompany` (Data), `queueCompanyDelete` (Queue)                                                   | Owner-conditioned delete of the `Company`, then `SendMessage` to the Accounts queue with attributes `id` and `owner`; `@accounts/queue` removes the rest. A non-200 from SQS becomes an error.                                                                |

### Clients

| Field                   | Kind / data source                                                                                       | Behaviour and authorisation                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Query.getClients`      | Unit, Data                                                                                               | Owner-scoped query, `data` begins `<sub>:<companyId>`.                                                                                                       |
| `Query.getClient`       | Unit, Data                                                                                               | Owner check on read.                                                                                                                                         |
| `Mutation.createClient` | Pipeline: `address`, `addressFiltering`, `telephone`, `getClientCompanyId` (Data), `createClient` (Data) | `getClientCompanyId` loads the `Company` from `input.companyId` and requires owner = `sub`; then a conditional put with `data` = `<sub>:<companyId>:<name>`. |
| `Mutation.updateClient` | Pipeline: same validation, `getClientCompanyId`, `updateClient` (Data)                                   | Company owner check, then owner-conditioned update.                                                                                                          |
| `Mutation.deleteClient` | Unit, Data                                                                                               | Owner-conditioned delete.                                                                                                                                    |

### Transactions and balance

| Field                              | Kind / data source        | Behaviour and authorisation                                                                                                                                                                                         |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getBalance`                 | Unit, Data                | Consistent `GetItem` of `Balance`; owner check on read.                                                                                                                                                             |
| `Query.getTransactions`            | Unit, Data                | Owner-scoped query, `data` begins `<sub>:<companyId>:<status>`; newest first for `confirmed`, oldest first for `pending`.                                                                                           |
| `Query.getTransaction`             | Unit, Data                | Owner check on read.                                                                                                                                                                                                |
| `Query.getTransactionState`        | Unit, TransactionState    | Invokes `GetTransactionState` with `arguments` and `identity`; returned `errorType`/`errorMessage` become a GraphQL error. Returns `null` when the transaction is missing, not the caller's, or in another company. |
| `Mutation.addTransaction`          | Unit, Data                | Conditional put (`attribute_not_exists(id)`, idempotent on retry via `equalsIgnore: createdAt`); id from input or generated; owner = `sub`; `data` = `<sub>:<companyId>:<status>:<date>`.                           |
| `Mutation.updateTransaction`       | Unit, Data                | Owner-conditioned update; rewrites `data`. `companyId` is not updated (the stream handlers derive it from `data`).                                                                                                  |
| `Mutation.deleteTransaction`       | Unit, Data                | Owner-conditioned delete.                                                                                                                                                                                           |
| `Mutation.transactionBeacon`       | Unit, Resolver (IAM only) | Echoes `{ id, owner, balance, vat }` to `Subscription.onTransaction`.                                                                                                                                               |
| `Mutation.transactionChangeBeacon` | Unit, Resolver (IAM only) | Echoes `{ id, owner, transactionId }` to `Subscription.onTransactionChange`.                                                                                                                                        |
| `Subscription.onTransactionChange` | Unit, Resolver            | Rejects the subscription unless `sub == args.owner`.                                                                                                                                                                |
| `Subscription.onTransaction`       | Unit, Resolver            | Rejects the subscription unless `sub == args.owner`.                                                                                                                                                                |

### Settings and typeahead

| Field                     | Kind / data source                                   | Behaviour and authorisation                                      |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| `Query.getSettings`       | Unit, Data                                           | Owner check on read.                                             |
| `Mutation.updateSettings` | Pipeline: `vatRegistration`, `updateSettings` (Data) | Owner-conditioned update; `data` = `<sub>:<companyId>:Settings`. |
| `Query.getTypeahead`      | Unit, Data                                           | Owner check on read. Written by `@accounts/data`.                |

### Storage

All three start with the `getCompany` gate on `args.id` (the company id).

| Field                    | Second function / data source    | Behaviour                                                                                                                                                  |
| ------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Mutation.requestUpload` | `requestUpload`, StorageUpload   | `POST /<stage>/api/v1/signed-upload` with `companyId`, `contentType`, `extension`, `metadata { id, typename }` and `owner` = `sub`; returns `{ id, url }`. |
| `Query.requestDownload`  | `requestDownload`, StorageUpload | `POST /<stage>/api/v1/signed-download` with `owner` = `sub` and `path`; returns `{ url }`.                                                                 |
| `Mutation.deleteFile`    | `deleteFile`, Queue              | `SendMessage` to the storage delete queue, delayed 300 s, attribute `key` = `<sub>/<path>`; returns `{ path }`.                                            |

Non-200 HTTP responses become GraphQL errors carrying the response body and status code.

### Reports

| Field                   | Kind / data source                                                      | Behaviour                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Mutation.createReport` | Pipeline: `getCompany` (on `input.companyId`), `createReport` (Reports) | `POST /<stage>/api/v1/generate-report/start` with `companyId`, `currency`, `owner` = `sub`, `status`, `year`, `yearEnd`; returns `{ status: "PENDING" }`. |
| `Query.getReports`      | Unit, Data                                                              | Owner-scoped query of `Report`, `data` begins `<sub>:<companyId>`.                                                                                        |

### Notifications

| Field                         | Kind / data source        | Behaviour and authorisation                                                                                                                               |
| ----------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Query.getNotifications`      | Unit, Data                | Owner-scoped query, `data` begins `<sub>:Notification`, newest first; `id` in the result is the caller's `sub`.                                           |
| `Mutation.markAsRead`         | Unit, Data                | `TransactWriteItems` setting `read = true` and `ttl` = now on each id, each conditioned on owner = `sub`; the response is `null` unless `args.id == sub`. |
| `Mutation.notificationBeacon` | Unit, Resolver (IAM only) | Echoes the notification to `Subscription.onNotification`.                                                                                                 |
| `Subscription.onNotification` | Unit, Resolver            | Rejects the subscription unless `sub == args.owner`.                                                                                                      |

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

All use Sentry (`init` + `wrapHandler`) and receive `SENTRY_ENVIRONMENT` and `SENTRY_DSN`. The two stream functions sign AppSync calls with their IAM role (`aws-appsync` client) using `AWS_REGION` and `ENDPOINT` (the API URL).

| Function               | Trigger                                                                      | Behaviour                                                                                                                                                                                                                                                                                                                                                                                  | Env vars   |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `GetTransactionState`  | `Query.getTransactionState`                                                  | Requires an identity with `sub`, else returns `UnauthorizedException`. Consistent read of the `Transaction`; returns `null` unless owner = `sub` and the company (derived from `data`, falling back to `companyId`) equals the requested one. Configuration-class AWS errors are captured in Sentry and returned as `ConfigurationError`; others are thrown.                               | `TABLE`    |
| `UpdateBalance`        | Table stream, batch 10, `LATEST`, 4 retries, `ReportBatchItemFailures`, 60 s | Processes records in order. `Balance` MODIFY: calls `transactionBeacon` with `balance` and `vat` (malformed balances are logged and skipped). `Transaction` INSERT/MODIFY/REMOVE: calls `transactionChangeBeacon`; on MODIFY that changed company, owner or id it also notifies the old scope. On the first failure it returns that record's sequence number so Lambda retries from there. | `ENDPOINT` |
| `PublishNotifications` | Table stream, `LATEST`, 4 retries                                            | For inserted `Notification` items, calls `notificationBeacon` with `id` = owner and `read: false`. Any failure fails the whole batch.                                                                                                                                                                                                                                                      | `ENDPOINT` |

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

Resources: the AppSync API `accounts-<stage>` (X-Ray on, `ERROR` logging), the three Lambdas, AppSync service roles for DynamoDB, reports, storage, queue and logging, a Lambda role for `GetTransactionState`, a shared role for the two stream functions, and two iterator-age alarms. Bundled with `serverless-esbuild`. Uses the `accounts-api-deployment-bucket` deployment bucket.

Output: `AccountsApiUrl` (not exported). On deploy `@motech-development/serverless-outputs-env` writes `REACT_APP_APPSYNC_URL` and `REACT_APP_AWS_REGION` to `../client/.env.production`.

Imports:

| Export                                                                                                                            | From                |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `<stage>-AccountsApplicationTable`, `…TableArn`, `…TableStreamArn`                                                                | `@accounts/data`    |
| `<stage>-AccountsReportsApiEndpoint`, `<stage>-AccountsReportsApiArn`                                                             | `@accounts/reports` |
| `<stage>-StorageUploadApiEndpoint`, `<stage>-StorageUploadApiArn`, `<stage>-DeleteFileQueueUrlPath`, `<stage>-DeleteFileQueueArn` | `@accounts/storage` |
| `<stage>-AccountsQueueUrl`, `<stage>-AccountsQueueArn`                                                                            | `@accounts/queue`   |

VTL substitutions: `appTable`, `deleteFileQueue`, `queue`, `stage`.

IAM in plain terms:

- AppSync can get, put, update, delete, query and scan the application table and its index; invoke the reports and storage APIs; send to the Accounts queue and the storage delete queue; and write its own logs.
- `GetTransactionState` can only get table items and write its own logs.
- The stream functions can read the table stream, call only the three beacon mutations, and write logs.

## Failure handling and observability

- Sentry captures unhandled Lambda errors, `UpdateBalance` record failures and `GetTransactionState` configuration errors.
- `UpdateBalance` checkpoints by sequence number, so successful records before a failure are not republished. After 4 retries the batch is dropped; there is no on-failure destination.
- `PublishNotifications` retries the whole batch up to 4 times, then drops it.
- Alarms `accounts-<stage>-update-balance-iterator-age` and `accounts-<stage>-publish-notifications-iterator-age` fire when stream lag reaches 15 minutes and invoke `accounts-data-<stage>-ReportSchedulingAlarm`, which reports to Sentry.
- AppSync logs errors only; Lambda log retention is 30 days.

## Testing

Vitest; Lambda tests are in `src/handlers/__tests__/`. `src/setupTests.ts` mocks `@motech-development/node-logger` and replaces `AWSAppSyncClient.prototype.mutate` with a spy; DynamoDB is mocked with `aws-sdk-client-mock`. VTL templates have no automated tests. Files run serially.

```sh
yarn workspace @accounts/api vitest run src/handlers/__tests__/update-balance.test.ts
```

To check the resolved Serverless configuration without deploying, use placeholder values:

```sh
AUTH0_DOMAIN=example.invalid SENTRY_DSN= yarn workspace @accounts/api exec serverless print --stage local
```

## Making changes

- After editing `schema/` or a `gql` operation in `src`, run `yarn workspace @accounts/api codegen.graphql` to regenerate `src/graphql/graphql.ts`. The client has its own generated types; update them too when the schema changes.
- A new schema file must be added to `appSync.schema` in `serverless.yml`; a new resolver or pipeline function must be wired there as well.
- Keep the `data` formats in step with `@accounts/data` (balance, typeahead, scheduling and attachment handlers query or rewrite them) and `@accounts/data-restore`.
- New beacon mutations need `@aws_iam`, and the stream role's `appsync:GraphQL` grant lists each beacon field explicitly.
- Deploy after `@accounts/data`, `@accounts/storage`, `@accounts/queue` and `@accounts/reports`, whose exports it imports.
