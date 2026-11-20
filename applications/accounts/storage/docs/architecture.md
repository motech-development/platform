# Accounts storage architecture

## Purpose

`@accounts/storage` (stack `accounts-<stage>-storage`) owns the buckets for transaction attachments and issues short-lived presigned URLs so files never pass through the API. Uploads land in a quarantine bucket, are scanned by `@core/anti-virus`, and only clean files reach the download bucket. Only `@accounts/api` calls its HTTP endpoints, signing requests with IAM on behalf of a signed-in user. See the [repository architecture](../../../../docs/architecture.md#attachments) for the end-to-end flow.

## Layout

| Path                              | Contents                                         |
| --------------------------------- | ------------------------------------------------ |
| `serverless.yml`                  | Functions, buckets, delete queue, alarm and IAM. |
| `src/handlers/signed-upload.ts`   | Presigned PUT into the upload bucket.            |
| `src/handlers/signed-download.ts` | Presigned GET from the download bucket.          |
| `src/handlers/queue-upload.ts`    | Queues new uploads for scanning.                 |
| `src/handlers/process-delete.ts`  | Deletes files that are no longer referenced.     |
| `src/handlers/__tests__/`         | One test file per handler.                       |

## Components

All handlers use Sentry (`init` + `wrapHandler`). Every function receives `ATTACHMENT_TABLE` (imported), `DOWNLOAD_BUCKET`, `UPLOAD_BUCKET`, `QUARANTINE_RETENTION_DAYS` (`1`), `SENTRY_ENVIRONMENT` and `SENTRY_DSN`.

### `SignedUpload` — `POST /api/v1/signed-upload` (IAM)

Request body, validated with Yup (unknown keys stripped):

| Field         | Rules                                                  |
| ------------- | ------------------------------------------------------ |
| `owner`       | required string                                        |
| `companyId`   | required string                                        |
| `contentType` | required string                                        |
| `extension`   | lower-cased, one of `gif`, `jpeg`, `jpg`, `pdf`, `png` |
| `metadata`    | `{ typename: string (required), id?: string \| null }` |

It generates a UUID, builds key `<owner>/<companyId>/<uuid>.<extension>`, registers it as a `pending` staged file in the attachment table (`allocateStagedFile`, expiring after `QUARANTINE_RETENTION_DAYS`), and returns `{ id, url }` where `url` is a 30-second presigned `putObject` URL. The URL fixes `ContentType` and metadata `attachment-lifecycle: v1`, `typename` and, when given, `id`.

### `SignedDownload` — `POST /api/v1/signed-download` (IAM)

Body `{ owner, path }` (both required). Returns `{ url }`, a 30-second presigned `getObject` URL for `<owner>/<path>` in the download bucket. A path that resolves outside `<owner>/` returns `{ message: 'Invalid request', statusCode: 400 }`.

Both HTTP handlers use `apiGatewayHandler` from `@motech-development/api-gateway-handler`: a missing body or env var returns 400, an invalid body returns `{ message: 'Invalid request', statusCode: 400 }`, and unexpected errors are passed to Sentry's `captureException`.

### `QueueUpload` — `s3:ObjectCreated:Put` on the upload bucket

Sends one `SendMessageBatch` to the anti-virus scan queue with an entry per record: `Id` is the file name without extension, body `Upload <key>`, attributes `from` (bucket), `key` (as received in the event) and `to` (`DOWNLOAD_BUCKET`). Throws if any entry fails, so S3 retries the invocation. Extra env var: `QUEUE_URL`.

### `ProcessDelete` — delete queue (SQS, `ReportBatchItemFailures`)

For each record with a `key` attribute it calls `deleteStagedFile(UPLOAD_BUCKET, DOWNLOAD_BUCKET, key)`. Failed records are reported as batch item failures and captured in Sentry; records without a key succeed without action. Messages come from `@accounts/data` (removed transactions) and `@accounts/api` (`deleteFile`).

## Data

**Upload bucket** `accounts-<stage>-uploads`: quarantine. Objects expire after 1 day. CORS allows `PUT` from any origin. Key `<owner>/<companyId>/<uuid>.<ext>`.

**Download bucket** `accounts-<stage>-downloads`: clean files at the same key, written by anti-virus. Incomplete multipart uploads are aborted after 1 day. CORS allows `GET` from any origin.

**Attachment table** (owned by `@core/anti-virus`): one record per staged path with `state` `pending`, `ready` or `deleting`, managed through `@motech-development/s3-file-operations`.

**Delete queue** `accounts-<stage>-delete-file-queue`: string attribute `key` = `<owner>/<companyId>/<file>`.

## Infrastructure

Develop and production retain the download bucket if it is removed from the stack or replaced; previews delete it. A retained bucket keeps its name, so a removed develop or production stack can't be redeployed until the bucket is imported back into it with a CloudFormation import change set. The upload bucket's objects expire after a day, so it is not retained.

Resources: both buckets, the delete queue and its DLQ (after 5 receives, 14-day retention), a DLQ alarm, the REST API created by the HTTP events, and one Lambda role. Bundled with `serverless-esbuild` (Node 24, `@sentry/profiling-node` external). Uses the `accounts-storage-deployment-bucket` deployment bucket.

Exports:

| Export                             | Value                                                     |
| ---------------------------------- | --------------------------------------------------------- |
| `<stage>-StorageUploadApiEndpoint` | REST API base URL                                         |
| `<stage>-StorageUploadApiArn`      | execute-api ARN for IAM grants                            |
| `<stage>-StorageUploadBucket`      | Upload bucket name                                        |
| `<stage>-StorageDownloadBucket`    | Download bucket name                                      |
| `<stage>-StorageDownloadBucketArn` | Download bucket ARN                                       |
| `<stage>-DeleteFileQueueArn`       | Delete queue ARN                                          |
| `<stage>-DeleteFileQueueUrl`       | Delete queue URL                                          |
| `<stage>-DeleteFileQueueUrlPath`   | Delete queue path, used by AppSync's SQS HTTP data source |

Imports from `@core/anti-virus`: `<stage>-AttachmentTable`, `<stage>-AttachmentTableArn`, `<stage>-AntiVirusQueueUrl`, `<stage>-AntiVirusQueueArn`.

IAM in plain terms: the Lambda role can get, delete and abort multipart uploads on download-bucket objects; put and delete upload-bucket objects; put, get, update and delete attachment-table items; consume the delete queue; send to the anti-virus scan queue; and write logs.

## Failure handling and observability

- Sentry captures unhandled errors and each failed `ProcessDelete` record.
- The delete queue redrives to `accounts-<stage>-delete-file-dlq` after 5 receives. The alarm `accounts-<stage>-delete-file-dlq-messages-visible` fires on one visible message and invokes `accounts-data-<stage>-ReportSchedulingAlarm`, which reports to Sentry.
- Unscanned or rejected uploads expire from the quarantine bucket after 1 day; anti-virus `CleanupAttachments` reconciles abandoned lifecycle records.
- Log retention is 30 days.

## Testing

Vitest; tests live in `src/handlers/__tests__/` (plain `.ts` names, matched by the `__tests__` include). `src/setupTests.ts` loads the `aws-sdk-client-mock-vitest` matchers; AWS clients are mocked with `aws-sdk-client-mock`. Files run serially.

```sh
yarn workspace @accounts/storage vitest run src/handlers/__tests__/signed-upload.ts
```

## Making changes

- Deploy after `@core/anti-virus`; `@accounts/data` and `@accounts/api` import this stack's exports.
- Allowed upload extensions live in `signed-upload.ts`; the client's file picker should match.
- The metadata written on upload (`attachment-lifecycle`, `typename`, `id`) is read by anti-virus and forwarded to `@accounts/data` on failure. Keep the three in step.
- Bucket names are hard-coded in `@core/anti-virus` IAM; renaming them needs a change there too.
