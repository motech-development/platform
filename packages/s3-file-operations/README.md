[npm]: https://img.shields.io/npm/v/@motech-development/s3-file-operations
[npm-url]: https://www.npmjs.com/package/@motech-development/s3-file-operations
[size]: https://packagephobia.now.sh/badge?p=@motech-development/s3-file-operations
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/s3-file-operations

[![npm][npm]][npm-url]
[![size][size]][size-url]

# S3 file operations

> A wrapper utility to manage file operations on AWS S3

S3 helpers plus a DynamoDB-tracked "staged file" lifecycle for moving uploads safely between buckets. Used by `@accounts/reports`, `@accounts/storage` and `@core/anti-virus`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/s3-file-operations
```

```ts
import { createSignedUrl } from '@motech-development/s3-file-operations';

const url = await createSignedUrl('getObject', bucket, key, 300);
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/s3-file-operations test-ci
```

## Scripts

| Script                                                             | Purpose                  |
| ------------------------------------------------------------------ | ------------------------ |
| `yarn workspace @motech-development/s3-file-operations build`      | Build to `lib/`          |
| `yarn workspace @motech-development/s3-file-operations test`       | Vitest in watch mode     |
| `yarn workspace @motech-development/s3-file-operations test-ci`    | Single run with coverage |
| `yarn workspace @motech-development/s3-file-operations lint`       | ESLint                   |
| `yarn workspace @motech-development/s3-file-operations typecheck`  | TypeScript check         |
| `yarn workspace @motech-development/s3-file-operations formatting` | Prettier check           |
