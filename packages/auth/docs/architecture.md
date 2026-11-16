# Auth architecture

## Purpose

React components that gate React Router routes on [Auth0 React](https://github.com/auth0/auth0-react) state. Used by `@accounts/client`. See the [repository architecture](../../../docs/architecture.md) for how sign-in fits the system.

## Layout

| Path                       | Contents                         |
| -------------------------- | -------------------------------- |
| `src/index.ts`             | Public exports                   |
| `src/WithAuth.tsx`         | Loading and Auth0 error boundary |
| `src/ProtectedRoute.tsx`   | Sign-in-required route           |
| `src/ConditionalRoute.tsx` | Condition-based redirect         |
| `src/__tests__/`           | One suite per component          |

Runtime dependency: `@motech-development/query-string-hook` (workspace).

## API reference

All components must render inside `Auth0Provider` (except `ConditionalRoute`) and a React Router router.

### `WithAuth`

| Prop       | Type                        | Notes                              |
| ---------- | --------------------------- | ---------------------------------- |
| `children` | `ReactNode`                 | Rendered once Auth0 has loaded     |
| `fallback` | `ReactNode`                 | Rendered while `isLoading` is true |
| `onError`  | `(message: string) => void` | Called with the error description  |

When Auth0 finishes loading, if the URL has both `error` and `error_description` query parameters, `onError(error_description)` is called once. The effect depends only on `isLoading`, so later URL changes do not re-trigger it.

### `ProtectedRoute`

Props: `{ children: ReactNode }` or `{ element: ReactElement }` (`TProtectedRouteProps`).

Renders its content when `isAuthenticated`. While loading it renders `null`. When loaded and signed out it renders `null` and calls `loginWithRedirect({ appState: { targetUrl: window.location.pathname } })`; rejections are swallowed. The app's `onRedirectCallback` must read `appState.targetUrl` to return the user to the page (query and hash are not preserved).

### `ConditionalRoute`

Props (`TConditionalRouteProps`): `condition: boolean`, `redirect: string`, plus `children` or `element`.

Renders its content when `condition` is true, otherwise `<Navigate to={redirect} />`.

```tsx
<Route
  path="/setup"
  element={
    <ConditionalRoute condition={!isSetUp} redirect="/">
      <Setup />
    </ConditionalRoute>
  }
/>
```

## Design notes

- Accepting either `children` or `element` lets the components wrap content directly or sit in a route's `element` prop.
- The package performs no token handling; tokens are fetched by consumers (for example through `@motech-development/appsync-apollo`).

## Testing

Vitest in jsdom with Testing Library and globals. `@auth0/auth0-react` is mocked with `vi.mock` and `useAuth0` return values are set per test. `vitest.config.ts` aliases `@motech-development/query-string-hook` to `../query-string-hook/lib/index.js`, so build it first with `yarn package` (or `yarn workspace @motech-development/query-string-hook build`).

Run one file: `yarn workspace @motech-development/auth vitest run src/__tests__/ProtectedRoute.tsx`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
