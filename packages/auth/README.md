[npm]: https://img.shields.io/npm/v/@motech-development/auth
[npm-url]: https://www.npmjs.com/package/@motech-development/auth
[size]: https://packagephobia.now.sh/badge?p=@motech-development/auth
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/auth

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Auth

> Auth0 route helpers for React Router

Three components that gate React Router routes on Auth0 state: a loading/error boundary, a sign-in-required route and a condition-based redirect. Used by `@accounts/client`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/auth
```

Peer dependencies: `@auth0/auth0-react`, `react`, `react-dom` and `react-router-dom`. Render inside `Auth0Provider` and a router.

## Usage

```tsx
import { ProtectedRoute, WithAuth } from '@motech-development/auth';

<WithAuth fallback={<Loader />} onError={(message) => notify(message)}>
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
  </Routes>
</WithAuth>;
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn package
yarn workspace @motech-development/auth test-ci
```

## Scripts

Run as `yarn workspace @motech-development/auth <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
