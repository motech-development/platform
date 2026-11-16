[npm]: https://img.shields.io/npm/v/@motech-development/appsync-apollo
[npm-url]: https://www.npmjs.com/package/@motech-development/appsync-apollo
[size]: https://packagephobia.now.sh/badge?p=@motech-development/appsync-apollo
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/appsync-apollo

[![npm][npm]][npm-url]
[![size][size]][size-url]

# AppSync Apollo

> React Apollo client configured for AppSync

An `Apollo` provider component that builds an Apollo client authenticated against AWS AppSync with an OpenID Connect token, including subscriptions. Used by `@accounts/client`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/appsync-apollo
```

Peer dependencies: `@apollo/client`, `graphql`, `react` and `react-dom`. The app must define `REACT_APP_APPSYNC_URL` and `REACT_APP_AWS_REGION` at build time.

## Usage

```tsx
import { Apollo } from '@motech-development/appsync-apollo';

<Apollo
  error={<p>AppSync is not configured</p>}
  fallback={<p>Loading…</p>}
  getTokenSilently={getAccessTokenSilently}
  isAuthenticated={isAuthenticated}
  isLoading={isLoading}
  unauthorised={<p>Please sign in</p>}
>
  <App />
</Apollo>;
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/appsync-apollo test-ci
```

## Scripts

Run as `yarn workspace @motech-development/appsync-apollo <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
