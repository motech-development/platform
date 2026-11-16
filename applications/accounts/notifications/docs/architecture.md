# Accounts notifications architecture

## Purpose

`@accounts/notifications` records in-app notifications for Accounts users. It owns the `accounts-<stage>-notifications` stack: one IAM-authenticated REST endpoint backed by one Lambda that writes a `Notification` item to the application table. Other services call it; today that is `@accounts/reports` when a report is ready. Delivery to the browser happens elsewhere: the table stream triggers `@accounts/api`, which publishes the `onNotification` subscription. See the [repository architecture](../../../../docs/architecture.md) for the wider picture.

## Layout

| Path                                  | Contents                                    |
| ------------------------------------- | ------------------------------------------- |
| `serverless.yml`                      | Function, HTTP event, IAM role and outputs. |
| `src/handlers/create-notification.ts` | The only handler.                           |
| `src/handlers/__tests__/`             | Vitest tests for the handler.               |
| `src/setupTests.ts`                   | AWS SDK matchers and the `uuid` mock.       |
| `__mocks__/uuid.ts`                   | Deterministic UUIDs for tests.              |

## Components

### `CreateNotification`

| Aspect   | Detail                                                                                                                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger  | `POST /api/v1/notifications` on this stack's REST API, `aws_iam` authorizer. Callers sign with SigV4 for `execute-api`.                                                                                                                                                                                                      |
| Input    | JSON body `{ message: string, owner: string, payload?: string }`. Unknown keys are stripped.                                                                                                                                                                                                                                 |
| Writes   | `PutItem` of a `Notification` item to the application table.                                                                                                                                                                                                                                                                 |
| Output   | `201` with an empty body.                                                                                                                                                                                                                                                                                                    |
| Errors   | `400` `No table set` if `TABLE` is missing; `400` `No body found` if the body is empty; `400` `{ message: 'Invalid request', statusCode: 400 }` if JSON parsing or validation fails. Other errors are handled by `apiGatewayHandler` from `@motech-development/api-gateway-handler` and passed to Sentry `captureException`. |
| Env vars | `TABLE`, `SENTRY_DSN`; `SENTRY_ENVIRONMENT` is the stage.                                                                                                                                                                                                                                                                    |

The handler is wrapped with Sentry `wrapHandler`, with tracing and profiling enabled.

## Data

`Notification` item:

| Field        | Value                                              |
| ------------ | -------------------------------------------------- |
| `__typename` | `Notification`                                     |
| `id`         | New UUID.                                          |
| `owner`      | From the request (the user's `sub`).               |
| `data`       | `<owner>:Notification:<createdAt>`                 |
| `createdAt`  | UTC ISO timestamp at write time.                   |
| `message`    | From the request, e.g. `REPORT_READY_TO_DOWNLOAD`. |
| `payload`    | From the request, optional free text.              |
| `read`       | `false`                                            |

The item has no `ttl`. `message` is a translation key the client looks up, and `payload` is interpreted by the client (reports send a query string).

## Infrastructure

Stack `accounts-<stage>-notifications`, region `eu-west-1` by default, Node.js 24, bundled with esbuild (`@sentry/profiling-node` and `yup` external). Log retention is 30 days.

| Imports                                       | Used for         |
| --------------------------------------------- | ---------------- |
| `<stage>-AccountsApplicationTable` / `...Arn` | `TABLE` and IAM. |

| Exports                            | Value                                       |
| ---------------------------------- | ------------------------------------------- |
| `<stage>-NotificationsApiEndpoint` | Base URL of the REST API (no stage path).   |
| `<stage>-NotificationsApiArn`      | `execute-api` ARN pattern for the REST API. |

The function's role can put items in the application table and write CloudWatch Logs. Callers need `execute-api:Invoke` on `<stage>-NotificationsApiArn`; `@accounts/reports` grants that to its own role.

## Failure handling and observability

Errors go to Sentry. There is no queue, retry or alarm in this stack; retries are the caller's responsibility. `@accounts/reports` treats a non-2xx response as a failed Step Functions step.

## Testing

Tests are in `src/handlers/__tests__/` and run in Node with Vitest globals. DynamoDB is stubbed with `aws-sdk-client-mock`, and `uuid` is mocked. Run one file from the repository root:

```sh
yarn workspace @accounts/notifications exec vitest run src/handlers/__tests__/create-notification.ts
```

## Making changes

- Callers build the URL as `<NotificationsApiEndpoint>/<stage>/api/v1/notifications`. Changing the path or method breaks `@accounts/reports`.
- The item shape must match the `Notification` type in `@accounts/api`'s schema and the client's notification handling.
- Deploy after `@accounts/data`. `@accounts/reports` imports this stack's exports, so deploy it after this one.
- Check the resolved configuration without deploying: `SENTRY_DSN= yarn workspace @accounts/notifications exec serverless print --stage local`.
