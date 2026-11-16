# AppSync Apollo architecture

## Purpose

A React provider that creates an Apollo Client for AWS AppSync using `OPENID_CONNECT` authorisation, with real-time subscriptions. Used by `@accounts/client` to talk to the Accounts GraphQL API. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                                 | Contents                                 |
| ------------------------------------ | ---------------------------------------- |
| `src/index.ts`                       | Public exports                           |
| `src/Apollo/Apollo.tsx`              | Provider component                       |
| `src/waitForApollo/waitForApollo.ts` | Test helper                              |
| `src/setupTests.ts`                  | jest-dom matchers and `unfetch` polyfill |

Runtime dependencies: `aws-appsync-auth-link` and `aws-appsync-subscription-link`.

## API reference

### `Apollo` (props: `IApolloProps`)

| Prop               | Type                                 | Notes                                               |
| ------------------ | ------------------------------------ | --------------------------------------------------- |
| `children`         | `ReactNode`                          | Rendered inside `ApolloProvider` when ready         |
| `error`            | `ReactNode`                          | Rendered when either env var is missing             |
| `fallback`         | `ReactNode`                          | Rendered while `isLoading`                          |
| `unauthorised`     | `ReactNode`                          | Rendered when not `isAuthenticated`                 |
| `isAuthenticated`  | `boolean`                            | From the auth provider                              |
| `isLoading`        | `boolean`                            | From the auth provider                              |
| `getTokenSilently` | `() => Promise<string \| undefined>` | Called for each request/subscription to get the JWT |
| `cacheConfig`      | `InMemoryCacheConfig`                | Optional, passed to `InMemoryCache`                 |

Reads `process.env.REACT_APP_APPSYNC_URL` and `process.env.REACT_APP_AWS_REGION`; the consuming bundler must replace them at build time. Render order: `error` (missing config), then `fallback` (loading), then `unauthorised`, then `children`.

The link chain is `removeTypenameFromVariables` → AppSync auth link → AppSync subscription handshake link.

### `waitForApollo(ms)`

```ts
waitForApollo(ms: number): Promise<void>
```

Resolves after `ms` milliseconds via `setTimeout`; used in consumer tests to let mocked queries settle.

## Design notes

- The client is created once per mount (`useMemo` with no dependencies). Changes to `cacheConfig` or `getTokenSilently` after mount are ignored; `getTokenSilently` is captured from the first render.
- `__typename` is stripped from variables so query results can be sent back as mutation inputs.

## Testing

Vitest in jsdom with Testing Library. Tests set the two env vars on `process.env` to exercise each render branch; `unfetch` polyfills `fetch`.

Run one file: `yarn workspace @motech-development/appsync-apollo vitest run src/Apollo/__tests__/Apollo.tsx`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
