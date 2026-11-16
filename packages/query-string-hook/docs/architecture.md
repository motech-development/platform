# Query string hook architecture

## Purpose

Two React hooks for working with URL query strings. `@motech-development/auth` uses `useQueryString` to read Auth0 error parameters. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                    | Contents                    |
| ----------------------- | --------------------------- |
| `src/index.ts`          | Public exports              |
| `src/useQueryString.ts` | React Router query reader   |
| `src/useQs.ts`          | `qs` parse/stringify helper |
| `src/__tests__/`        | One suite per hook          |

## API reference

### `useQueryString()`

```ts
useQueryString(): URLSearchParams
```

Returns a new `URLSearchParams` built from `useLocation().search`. Must be rendered inside a React Router router, otherwise React Router throws.

```tsx
const term = useQueryString().get('term');
```

### `useQs<T>()`

```ts
useQs<T>(): { parse: (value: string) => T; stringify: (value: T) => string }
```

- `parse` calls `qs.parse` with a custom decoder: values matching `^(\d+|\d*\.\d+)$` become numbers, `true`, `false` and `null` become their literals, and everything else is `decodeURIComponent`-ed. The decoder applies to keys too. The result is cast to `T` without validation.
- `stringify` calls `qs.stringify` with default options.

```ts
const { parse, stringify } = useQs<{ page: number }>();
parse('page=2'); // { page: 2 }
stringify({ page: 3 }); // 'page=3'
```

`useQs` uses no React state; it is a hook by naming only and returns new functions on each call.

## Design notes

- Negative numbers and exponent notation are not matched by the number pattern and stay strings.
- `decodeURIComponent` throws `URIError` on malformed percent-encoding.

## Testing

Vitest in jsdom with Testing Library `renderHook`. `react-router-dom` is mocked so `useLocation` returns a fixed `search`.

Run one file: `yarn workspace @motech-development/query-string-hook vitest run src/__tests__/useQs.test.ts`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
