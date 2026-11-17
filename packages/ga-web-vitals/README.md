[npm]: https://img.shields.io/npm/v/@motech-development/ga-web-vitals
[npm-url]: https://www.npmjs.com/package/@motech-development/ga-web-vitals
[size]: https://packagephobia.now.sh/badge?p=@motech-development/ga-web-vitals
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/ga-web-vitals

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Google Analytics Web Vitals

> Google Analytics Web Vitals reporter

A single function that sends a Web Vitals metric to Google Analytics as a `Web Vitals` event through the global `ga` function. It targets Universal Analytics (`analytics.js`), which no longer processes data. Used by `@accounts/client` and `@id/client`. See [docs/architecture.md](docs/architecture.md) for how it works.

## Installation

```bash
yarn add @motech-development/ga-web-vitals
```

## Usage

Install `web-vitals` and load the Google Analytics `analytics.js` snippet so `ga` is defined, then:

```ts
import reporter from '@motech-development/ga-web-vitals';
import { onCLS, onINP, onLCP } from 'web-vitals';

onCLS(reporter);
onINP(reporter);
onLCP(reporter);
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/ga-web-vitals test-ci
```

## Scripts

Run as `yarn workspace @motech-development/ga-web-vitals <script>`.

| Script       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| `build`      | Clean `lib/` and build ES output and type declarations |
| `package`    | Alias for `build`, used by the root `yarn package`     |
| `test`       | Vitest in watch mode                                   |
| `test-ci`    | Single Vitest run with coverage                        |
| `lint`       | ESLint                                                 |
| `typecheck`  | `tsc --noEmit`                                         |
| `formatting` | Prettier check                                         |
