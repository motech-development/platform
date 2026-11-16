# Axios hooks architecture

## Purpose

React hooks that perform HTTP requests and expose `data`, `error` and `loading` state. The name is historical: requests use the global `fetch`, and the package has no Axios dependency. Used by `@accounts/client` and `@id/client`. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                 | Contents                                        |
| -------------------- | ----------------------------------------------- |
| `src/axios-hooks.ts` | Hooks (package entry point)                     |
| `src/utils.ts`       | `request`: fetch, body/header encoding, parsing |
| `src/types.ts`       | Types (not re-exported from the entry point)    |
| `src/__tests__/`     | Hook tests                                      |

## API reference

### Shared options

`IOptions<TData, TError>`:

| Option         | Type                                          | Notes                                         |
| -------------- | --------------------------------------------- | --------------------------------------------- |
| `headers`      | `Record<string, string>`                      | Sent with every request from the hook         |
| `responseType` | `'arrayBuffer' \| 'blob' \| 'json' \| 'text'` | See response parsing                          |
| `onCompleted`  | `(data: TData) => void`                       | Called when `data` changes to a defined value |
| `onError`      | `(error: IFetchError<TError>) => void`        | Called when `error` changes                   |

Results (`IResults`): `{ data?: TData; error?: IFetchError<TError>; loading: boolean }`.

### `useGet<TData, TError>(url, options?)`

Sends `GET url` once on mount (later `url` or `options` changes are ignored) and returns results.

```ts
const { data, error, loading } = useGet<User>('/api/user');
```

### `useLazyGet<TData, TError>(options?)`

Returns `[execute, results]`, where `execute(url, headers?)` sends a GET and resolves to the data, or `undefined` on error.

### `usePost<TData, TBody, TError>(options?)` and `usePut<...>(options?)`

Return `[execute, results]`, where `execute(url, body, headers?)` sends a POST or PUT and resolves to the data, or `undefined` on error.

```ts
const [save] = usePost<User, UserInput>({
  headers: { Authorization: `Bearer ${token}` },
});
await save('/api/user', { name: 'Ada' });
```

Per-call `headers` are merged over the hook's `options.headers`.

### Request encoding

- Bodies that are already `BodyInit` (string, `Blob`, `FormData`, `URLSearchParams`, `ArrayBuffer`, typed arrays, `ReadableStream`) are sent as-is.
- Any other body is `JSON.stringify`-ed and `Content-Type: application/json` is added unless a content-type header (any case) is already present.

### Response parsing

- `arrayBuffer`, `blob`, `text`: the matching `Response` method.
- `json`: body text parsed as JSON; empty body gives `null`.
- Not set: JSON if `content-type` contains `application/json` (empty gives `null`), otherwise the text, or `null` if empty.

### Errors

A non-2xx response throws an `Error` whose `message` is the status text, with `status` and `response: { data, status, statusText }`, where `data` is the error body parsed as above (or `null` if parsing fails). Network errors and non-`Error` throws are normalised to `Error`. The hook stores the error in `error`, calls `onError`, and `execute` resolves to `undefined`; it never rejects.

## Design notes

- `data` and `error` are not cleared at the start of a new request, so a later success leaves a previous `error` in place.
- `onCompleted` fires on a change of `data`; repeating a request that returns an identical primitive value does not fire it again.
- Only `GET`, `POST` and `PUT` hooks exist, although the internal `Method` type also lists `DELETE` and `PATCH`.

## Testing

Vitest in jsdom with Testing Library. The global `fetch` is replaced with a `vi.fn()` returning stub `Response`-like objects.

Run one file: `yarn workspace @motech-development/axios-hooks vitest run src/__tests__/axios-hooks.ts`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
