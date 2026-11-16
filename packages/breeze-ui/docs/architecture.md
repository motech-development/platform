# Breeze UI architecture

## Purpose

Breeze UI is the Motech Development design system: accessible, domain-neutral React 19 components built on React Aria Components, published to npm with compiled CSS. This workspace holds the v4 source. No workspace consumes it yet: `@accounts/client` and `@id/client` pin the published `2.4.0` release from npm, not this workspace (see [ADR 0005](adr/0005-breeze-ui-v4-clean-break.md)). See the [repository architecture](../../../docs/architecture.md) for where the clients sit.

This document is the map. Detail lives elsewhere and is linked rather than repeated:

| Topic                                                             | Where                                            |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| Consumer guides (installation, usage, locale, appearance, motion) | Storybook pages in [`src/docs/`](../src/docs)    |
| Per-component usage and props                                     | Each component's `.mdx` and stories in Storybook |
| Component structure, styling recipes, tokens, build size, tests   | [CONTRIBUTING.md](../CONTRIBUTING.md)            |
| Design decisions                                                  | [docs/adr](adr)                                  |

## Layout

| Path                                                                                                         | Contents                                                                               |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `src/index.ts`                                                                                               | The only public entry point; every exported value and type is listed here              |
| `src/primitives/<Name>/`                                                                                     | Primitive components: implementation, `.mdx`, `.stories.tsx`, `.test.tsx` side by side |
| `src/patterns/<Name>/`                                                                                       | Higher-level compositions, same file layout                                            |
| `src/provider/`                                                                                              | `BreezeProvider`, `BreezeContext`, English messages (`en-GB.ts`)                       |
| `src/motion/`                                                                                                | View Transitions helpers                                                               |
| `src/buttons/`, `src/collections/`, `src/fields/`, `src/layout/`, `src/overlays/`, `src/selection-controls/` | Internal shared infrastructure (see CONTRIBUTING.md)                                   |
| `src/styles/`                                                                                                | Tailwind entry (`styles.css`), `tokens.css`, `reset.css` and supporting CSS            |
| `src/docs/`                                                                                                  | Storybook guide pages (`01-Overview` to `04-Motion`)                                   |
| `lint/logical-properties.mjs`                                                                                | Local ESLint rule rejecting physical spacing/position utilities                        |
| `test/`                                                                                                      | Vitest setup and `renderBreeze` helper                                                 |
| `.storybook/`                                                                                                | Storybook config, preview and component manifest preset                                |

## Public API

Package exports: `.` (`lib/index.js` and types), `./styles.css` (required) and `./reset.css` (optional, import before `styles.css`). Peer dependencies are `react` and `react-dom` 19, plus optional `pdfjs-dist` for `DocumentViewer` PDFs. Per-component props are documented in Storybook from the TypeScript types; the inventory below is the overview.

### Provider

`BreezeProvider` is required around all Breeze components; components call `useBreezeContext`, which throws outside it. Props (`BreezeProviderProps`):

| Prop                                | Notes                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `locale` (required)                 | BCP 47 tag; drives `I18nProvider`, `lang` and `dir` on the root. Built-in React Aria labels are English only |
| `messages`                          | Partial override of the Breeze-owned English messages in `en-GB.ts`                                          |
| `appearance` + `onAppearanceChange` | Controlled `'automatic' \| 'dark' \| 'light'`                                                                |
| `defaultAppearance`                 | Uncontrolled initial appearance (default `'automatic'`)                                                      |
| `portalContainer`                   | Overlay host container (default `document.body`)                                                             |
| `timeZone`                          | IANA zone; an unknown name throws `RangeError`                                                               |
| `toastLimit`                        | Visible toasts (default 3); extra messages queue FIFO                                                        |
| `router`                            | `BreezeRouter` with `navigate(href, { transitionTypes })` for app-routed links                               |

It renders a `[data-breeze-root]` element that scopes all painting, resolves `automatic` from `prefers-color-scheme`, writes `data-theme` and `color-scheme` on the document element (restoring the previous values on unmount), and hosts the overlay and toast providers.

### Primitives

| Component           | Summary                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `Badge`             | Compact, non-interactive status content                                                                 |
| `Button`            | Labelled action in three boxed treatments and three sizes, or a quiet text action                       |
| `Calendar`          | Single-date calendar selection with ISO values                                                          |
| `Card`              | Surface or raised content card                                                                          |
| `Checkbox`          | Boolean selection                                                                                       |
| `Chip`              | Compact filter with a pressed state                                                                     |
| `ComboBox`          | Suggestion entry with item or text changes                                                              |
| `Container`         | Responsive, token-constrained content container                                                         |
| `DatePicker`        | Single-date field with ISO values and a calendar popover                                                |
| `Dialog`            | Labelled dialog with a trigger and close action                                                         |
| `Drawer`            | Labelled drawer with a trigger and close action                                                         |
| `Grid`              | Constrained responsive grid                                                                             |
| `Icon`              | The single dependency boundary for icon artwork (`lucide-react`)                                        |
| `IconButton`        | Icon-only action in `Button`'s treatments and sizes                                                     |
| `IconTile`          | Compact icon decoration for rows and content states                                                     |
| `Inline`            | Horizontal layout                                                                                       |
| `Link`              | Navigation preserving native anchor behaviour; uses the provider `router` when set                      |
| `Menu`              | Compact menu for secondary actions                                                                      |
| `NumberField`       | Numeric entry                                                                                           |
| `Popover`           | Labelled popover with a trigger and close action                                                        |
| `RowList`           | Data-backed collection with sections and explicit pagination                                            |
| `Select`            | Fixed-choice selection                                                                                  |
| `Separator`         | Semantic divider                                                                                        |
| `Skeleton`          | Indeterminate content placeholder                                                                       |
| `SkipLink`          | Localised link that moves focus to the main content                                                     |
| `Stack`             | Vertical layout                                                                                         |
| `TextField`         | Text entry                                                                                              |
| `Toast`, `useToast` | Transient confirmation status; `useToast()` returns an enqueue function and throws outside the provider |
| `Toggle`            | On/off choice with a pressed state                                                                      |
| `ToggleGroup`       | Single selection from connected options                                                                 |
| `Typography`        | Semantic text, including formatted currency and date output                                             |
| `VisuallyHidden`    | Accessible content with no visual footprint                                                             |

### Patterns

| Component           | Summary                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `AppearanceControl` | Three-option appearance control backed by `BreezeProvider`       |
| `ApplicationShell`  | Responsive application shell with navigation and action slots    |
| `AttachmentRow`     | Attached file with a type thumbnail, state and actions           |
| `DocumentViewer`    | Non-modal full-screen attachment preview with lazy PDF rendering |
| `FileDropZone`      | File picker and drop target with validation feedback             |
| `FormActions`       | Consistently spaced row of form actions                          |
| `FormSection`       | Field group with an accessible title and optional description    |
| `PageHeader`        | Responsive page title and action row                             |
| `StatePanel`        | Empty or error state with an optional recovery action            |
| `StatStrip`         | Labelled strip of currency figures with an owned loading shape   |

### Motion

`startViewTransition(update, types)` runs an application DOM commit inside a View Transition and resolves when the update callback is done; `useViewTransitionParticipant(options)` opts an element into a transition. See `src/docs/04-Motion.mdx`.

### Shared types

`ItemDescriptor`, `ItemDescriptorBadge` (collections), `LayoutAlign`, `LayoutElement`, `LayoutGap` (layout), `ControlSize` (`sm | md | lg`), `Appearance`, `ResolvedAppearance`, `BreezeRouter`, `RouterNavigationOptions`, and each component's `Props` and variant types.

## Design notes

- **Closed API.** No `className`, `style`, slot or event passthrough; callbacks report semantic values. React Aria is an internal detail and is never re-exported ([ADR 0002](adr/0002-react-aria-interaction-foundation.md)).
- **Compiled styles.** Tailwind 4 runs only at build time. Every class uses the `breeze:` prefix, utilities are nested under `:where([data-breeze-root])` so they cannot leak to consumer markup, and tokens are internal, not a theming API ([ADR 0003](adr/0003-publish-compiled-breeze-styles.md)). New source directories must be added to the `@source` globs in `src/styles/styles.css`.
- **Optional PDF.js.** `DocumentViewer` loads `pdfjs-dist` lazily only for PDFs; the worker URL is left for the consumer's bundler ([ADR 0004](adr/0004-optional-pdfjs-renderer.md)).
- **Logical properties.** The local `breeze/logical-properties` lint rule enforces logical spacing and sizing utilities.

## Build

`yarn build` runs `vite build` in library mode (ES only, source maps) then emits declarations with `tsconfig.build.json`. Entries are `index`, `reset` and `styles`, written to `lib/index.js`, `lib/reset.css` and `lib/styles.css`. `vite.config.ts` plugins:

| Plugin                                | Role                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `@tailwindcss/vite`                   | Compiles the stylesheets                                                                          |
| `@react-aria/optimize-locales-plugin` | Keeps only English React Aria locale modules (library build only)                                 |
| `esmExternalRequirePlugin`            | Keeps `react` external while converting bundled CommonJS `require('react')`                       |
| `breeze-preserve-pdf-worker-url`      | Leaves the PDF.js worker as a portable `new URL(..., import.meta.url)`                            |
| `breeze-library-output-guard`         | Fails the build over 140 KiB gzip-9 of JavaScript, on non-English locales, or a broken worker URL |
| `breeze-distribution-assets`          | Copies font and bundled-dependency licences into `lib/`                                           |

`react-aria` and `react-aria-components` are bundled; other dependencies and peers stay external. CONTRIBUTING.md explains why the bundled packages stay in `dependencies` and records the size measurements.

## Testing

`vitest.config.ts` defines two projects:

| Project     | Runs                                                                        | Environment                       |
| ----------- | --------------------------------------------------------------------------- | --------------------------------- |
| `unit`      | `src/**/*.test.{ts,tsx}` with `test/setup.ts` (React `StrictMode`, cleanup) | jsdom                             |
| `storybook` | Every story as a test via `@storybook/addon-vitest`, with axe checks        | Chromium via Playwright, headless |

`yarn test` runs only `unit` (single run, not watch). `test-ci` runs both with coverage (80% thresholds on branches, functions, lines and statements). Use `test/render.tsx` (`renderBreeze`) to render under a provider. `src/styles/styles.test.ts` builds the library in memory and checks every `breeze:` class and `--breeze-*` variable is present; `src/styles/tokens.test.ts` checks the two dark-palette copies match. Chromatic reports visual changes.

Run one file: `yarn workspace @motech-development/breeze-ui vitest run --project unit src/primitives/Button/Button.test.tsx`.

## Making changes

- Follow CONTRIBUTING.md for structure; `src/primitives/Button` is the reference implementation. Export new public values and types from `src/index.ts`.
- Add a token only with the component that uses it, and keep both dark-palette copies in `tokens.css` identical.
- Changing supported locales means changing the optimizer's `locales` option and the guard's English-only check together.
- Consumers will not see changes until they move off the pinned 2.x release.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`. The `deploy` script builds static Storybook for hosting.
