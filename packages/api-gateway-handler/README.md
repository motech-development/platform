[npm]: https://img.shields.io/npm/v/@motech-development/api-gateway-handler
[npm-url]: https://www.npmjs.com/package/@motech-development/api-gateway-handler
[size]: https://packagephobia.now.sh/badge?p=@motech-development/api-gateway-handler
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/api-gateway-handler

[![npm][npm]][npm-url]
[![size][size]][size-url]

# API Gateway handler

> Helpers for API Gateway Lambda handlers

Wraps an API Gateway proxy handler so thrown errors become HTTP responses, with helpers for parameter checks and JSON responses. Used by `@accounts/notifications` and `@accounts/storage`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/api-gateway-handler
```

## Usage

```ts
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';

export const handler = apiGatewayHandler(async (event) => {
  const id = paramCheck(event.pathParameters?.id, 'No id set', 400);

  return response({ id }, 200);
});
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/api-gateway-handler test-ci
```

## Scripts

Run as `yarn workspace @motech-development/api-gateway-handler <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
