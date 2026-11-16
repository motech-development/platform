[npm]: https://img.shields.io/npm/v/@motech-development/axios-hooks
[npm-url]: https://www.npmjs.com/package/@motech-development/axios-hooks
[size]: https://packagephobia.now.sh/badge?p=@motech-development/axios-hooks
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/axios-hooks

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Axios hooks

> Fetch-backed hooks for React

React hooks for GET, POST and PUT requests with loading, data and error state. Despite the name, requests use `fetch`; there is no Axios dependency. Used by `@accounts/client` and `@id/client`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/axios-hooks
```

Peer dependency: `react`.

## Usage

```tsx
import { useGet, usePost } from '@motech-development/axios-hooks';

const { data, error, loading } = useGet<User>('/api/user');
const [save, { loading: saving }] = usePost<User, UserInput>();

await save('/api/user', { name: 'Ada' });
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/axios-hooks test-ci
```

## Scripts

Run as `yarn workspace @motech-development/axios-hooks <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
