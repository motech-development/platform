[npm]: https://img.shields.io/npm/v/@motech-development/breeze-ui
[npm-url]: https://www.npmjs.com/package/@motech-development/breeze-ui
[size]: https://packagephobia.now.sh/badge?p=@motech-development/breeze-ui
[size-url]: https://packagephobia.now.sh/result?p=@motech-development/breeze-ui

[![npm][npm]][npm-url]
[![size][size]][size-url]

# Breeze UI

> Accessible, domain-neutral UI primitives and patterns for Motech Development applications

React 19 components built on React Aria and shipped with compiled Tailwind CSS. No workspace consumes this version yet: `@accounts/client` and `@id/client` pin the published 2.x release from npm. See [docs/architecture.md](docs/architecture.md) for how it works, [CONTRIBUTING.md](CONTRIBUTING.md) for component conventions and [docs/adr](docs/adr) for design decisions.

## Installation

```bash
yarn add @motech-development/breeze-ui
```

Peer dependencies: `react` and `react-dom` 19. `pdfjs-dist` is needed only for `DocumentViewer`.

## Usage

```tsx
import { BreezeProvider, Button } from '@motech-development/breeze-ui';
import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';

createRoot(root).render(
  <BreezeProvider locale="en-GB">
    <Button onAction={() => saveChanges()}>Save changes</Button>
  </BreezeProvider>,
);
```

## Getting started

From the repository root:

```bash
nvm use
yarn install
yarn workspace @motech-development/breeze-ui storybook
yarn workspace @motech-development/breeze-ui test
```

Storybook tests (`test-ci`) also need Playwright's Chromium (`yarn workspace @motech-development/breeze-ui playwright install --with-deps chromium`, as CI does).

## Scripts

Run as `yarn workspace @motech-development/breeze-ui <script>`.

| Script            | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `storybook`       | Storybook dev server on port 6006                               |
| `build-storybook` | Static Storybook build                                          |
| `deploy`          | Alias for `build-storybook`                                     |
| `build`           | Library build to `lib/` with size and locale guards, plus types |
| `package`         | Alias for `build`, used by the root `yarn package`              |
| `test`            | Unit tests, single run (not watch)                              |
| `test-ci`         | Unit and Storybook browser tests with coverage                  |
| `lint`            | ESLint, including the local logical-properties rule             |
| `typecheck`       | `tsc --noEmit`                                                  |
| `formatting`      | Prettier check                                                  |
