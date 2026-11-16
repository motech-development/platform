[npm]: https://img.shields.io/npm/v/@motech-development/query-string-hook
[npm-url]: https://www.npmjs.com/package/@motech-development/query-string-hook
[size]: https://packagephobia.now.sh/badge?p=@motech-development/query-string-hook
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/query-string-hook

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Query string hook

> A hook to access query strings

React hooks for reading the current React Router query string and for parsing or building query strings with `qs`. Used by `@motech-development/auth`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/query-string-hook
```

Peer dependencies: `react`, `react-dom` and `react-router-dom`.

## Usage

```tsx
import { useQueryString } from '@motech-development/query-string-hook';

function Search() {
  const term = useQueryString().get('term');

  return <p>{term}</p>;
}
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/query-string-hook test-ci
```

## Scripts

Run as `yarn workspace @motech-development/query-string-hook <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
