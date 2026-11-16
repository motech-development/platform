# API Gateway handler architecture

## Purpose

A small helper library for AWS Lambda functions behind API Gateway proxy integrations. It turns expected errors into HTTP responses and gives unexpected errors a uniform `500` body. Consumers are `@accounts/notifications` and `@accounts/storage`. See the [repository architecture](../../../docs/architecture.md) for where those services sit.

## Layout

| Path                         | Contents                                            |
| ---------------------------- | --------------------------------------------------- |
| `src/index.ts`               | Public exports                                      |
| `src/api-gateway-handler.ts` | Handler wrapper                                     |
| `src/param-check.ts`         | Required-value guard                                |
| `src/response.ts`            | Response builder                                    |
| `src/error-response.ts`      | Internal `ErrorResponse` error class (not exported) |
| `src/__tests__/`             | Vitest suites, one per public function              |

The build emits `lib/index.cjs.js` (`main`), `lib/index.esm.js` (`module`) and `lib/index.d.ts`.

## API reference

### `apiGatewayHandler(handler, onError?)`

```ts
apiGatewayHandler(
  handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>,
  onError?: (error: unknown) => unknown,
): (event, context) => Promise<APIGatewayProxyResult>
```

Returns a Lambda handler that awaits `handler` and returns its result. If it throws:

- an `ErrorResponse` (thrown by `paramCheck`) becomes `{ body, statusCode }` from that error;
- anything else is logged with `console.error`, passed to `onError` (awaited; errors it throws are logged and swallowed), and returned as status `500` with body `{"message":"Unhandled exception.","statusCode":500}`.

The wrapper never rejects, so Lambda never records an invocation error for handler failures.

```ts
export const handler = apiGatewayHandler(
  async (event) => response({ ok: true }, 200),
  (error) => Sentry.captureException(error),
);
```

### `paramCheck(value, message, statusCode)`

```ts
paramCheck<T>(value: T | null | undefined, message: string, statusCode: number): T
```

Returns `value` when it is truthy. Otherwise throws an `ErrorResponse` whose body is `{ message, statusCode }` (JSON) and whose status is `statusCode`. Falsy values such as `0` and `''` also throw. Only meaningful inside `apiGatewayHandler`; elsewhere the error propagates as an ordinary `Error`.

```ts
const bucket = paramCheck(process.env.BUCKET, 'No bucket set', 500);
```

### `response(body, statusCode)`

```ts
response<T>(body: T, statusCode: number): { body: string; statusCode: number }
```

Returns `body` unchanged when it is a string, otherwise `JSON.stringify(body)`. Sets no headers.

## Design notes

- `ErrorResponse` is internal; callers produce expected failures through `paramCheck` rather than constructing errors.
- Reporting (for example Sentry) is injected through `onError` so the package has no runtime dependencies.

## Testing

Vitest in a Node environment, using `aws-lambda-mock-context` for the Lambda context. Nothing else is mocked except `console.error` spies.

Run one file: `yarn workspace @motech-development/api-gateway-handler vitest run src/__tests__/param-check.ts`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
