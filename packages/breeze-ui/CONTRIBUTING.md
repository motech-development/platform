# Contributing to Breeze UI

## Component structure

Components live in `src/primitives/Name/` or `src/patterns/Name/`, with the implementation, `.mdx`, `.stories.tsx` and `.test.tsx` files in the same directory. Use `src/primitives/Button` as the reference implementation, and export public values and types from `src/index.ts`.

Internal infrastructure shared by several components lives in lowercase directories at the `src/` root and is not exported as a component: `src/collections/` (collection popover, item descriptors and their rendering), `src/fields/` (field styles and supporting content), `src/selection-controls/` (the pressed-state control behind `Chip`, `Toggle` and `ToggleGroup`), `src/buttons/` (the treatments, states and loading status shared by `Button` and `IconButton`), `src/layout/` (layout accessibility and the shared layout types) and `src/overlays/` (overlay stacking and portals). Only types are public from these directories, through `src/index.ts`: `ItemDescriptor` and `ItemDescriptorBadge` from `src/collections/`, and `LayoutAlign`, `LayoutElement` and `LayoutGap` from `src/layout/`.

Documentation pages follow the shape of the MUI component docs: a one-line description, then a short section per option or behaviour with a demo, then `<ArgTypes />` under an `API` heading. Keep implementation detail, rationale and coverage caveats in this file instead.

## Styling

Each component defines a single recipe object containing its `base`, `compound`, `size`, `state` and `variant` groups. Keep keys alphabetical, as required by the repository's `sort-keys` rule, and assemble the class list explicitly in the component; key order does not determine which styles apply.

Class names must be complete literals with the `breeze:` prefix, including before state variants. Story layouts use `.storybook/preview.css`; story and test sources are excluded from the published utility scan. Tailwind accepts any string, so `src/styles/styles.test.ts` runs the production library build from `vite.config.ts` in memory, without the size and locale guard that `yarn build` enforces, and checks the emitted `styles.css`. It fails when a `breeze:` class in shipped source is missing from that stylesheet, for example because the utility does not exist or its file is outside the `@source` globs in `styles.css`, and when shipped source or `src/styles/*.css` references a `--breeze-*` custom property that the stylesheet does not declare and no component sets. Add any new source directory to those globs. Select one by typed key and join the results, and never build a utility name by interpolation. Treatment unions are flat and belong to the component that uses them, and `ControlSize` is the shared `sm | md | lg` contract. Do not reintroduce `tailwind-variants`, `tailwind-merge` or a parallel recipe abstraction.

### Logical properties

Use logical properties for sizing and spacing. The local `breeze/logical-properties` ESLint rule checks every string that contains a `breeze:` class and rejects physical spacing, positions, dimensions, edges, radii and alignment, including responsive and state variants, value-less utilities such as `border-b`, and arbitrary physical property syntax. Use Tailwind's logical utilities: `ms`/`me`, `mbs`/`mbe`, `ps`/`pe`, `pbs`/`pbe`, `start`/`end`, `inset-bs`/`inset-be`, `border-s`/`border-e`/`border-bs`/`border-be`, `rounded-s`/`rounded-e`/`rounded-ss`/`rounded-se`/`rounded-es`/`rounded-ee`, `text-start`/`text-end`, and the `inline-*`, `block-*`, `min-inline-*`, `max-inline-*`, `min-block-*` and `max-block-*` sizes. `px`, `py`, `mx`, `my`, `border-x` and `border-y` are already logical and are allowed. Breeze defines no `--spacing` multiplier, so bare numeric values such as `inset-0` generate nothing; use a Breeze spacing token, an arbitrary value or one of the zero utilities in `tokens.css`, such as `min-inline-0`.

## Component API

Props are enumerated explicitly. There is no native-event, styling or slot passthrough, which is what prevents a string label from injecting styled markup. Callbacks report semantic values rather than DOM events. Components read the Breeze context they require and provide any loading skeleton they own.

Loading belongs on a component only when it owns the shape of a potentially unavailable value that it replaces. `Button` owns the action label's control footprint and skeleton, `Badge` owns the short status or count footprint, and `Typography` owns text and formatted currency or date output. `TypographyProps` is the reference discriminated union: currency and date branches forbid `children` and unrelated formatting fields, the text branch forbids `value` and formatting fields, and content may be omitted only when `loading` is `true`.

Containers and components that render arbitrary child compositions must forbid `loading` and assert its absence with `expectTypeOf`; their descendants define their own loading state. Typography's text branch is different: its ReactNode children are the text presentation it owns, so it can replace that value with its own skeleton. `IconTile` follows the absence rule because its icon is selected synchronously by name, so it has no unavailable value to replace. Judge future components by what they own rather than by a fixed list: a component such as `AttachmentRow` qualifies only if it owns the shape of the unavailable value it replaces.

## Tokens

Tokens are prefixed inside the Tailwind namespace. Tailwind also applies the `breeze:` utility prefix, so `--color-breeze-brand` generates `breeze:bg-breeze-brand` and is published as `--breeze-color-breeze-brand`. Use that published variable name for document overrides and authored CSS. The same pattern covers fonts, text sizes, spacing, radii and other measures. Tokens are internal: the package ships compiled CSS, and applications must not depend on them, override them or treat them as a theming API.

### Type scale

| Size | Role                                                    |
| ---- | ------------------------------------------------------- |
| 11px | Badges and compact metadata                             |
| 12px | Field labels and secondary metadata                     |
| 13px | Buttons, fields, body text, collections and card titles |
| 15px | State-panel and form-section titles                     |
| 17px | Section headings and dialog titles                      |
| 20px | Large numeric entry                                     |
| 22px | Page headings                                           |
| 26px | Numeric emphasis                                        |

Add a token together with the shipped component that uses it, and remove a token when its last use goes.

### Control sizes

`sm`, `md` and `lg` map to minimum block sizes of 34, 38 and 52px, with a 44px floor applied on coarse pointers. `Button` and `IconButton` use 32 and 36px for `sm` and `md`, matching the design's button heights. Breakpoint thresholds are deliberately static.

### Shadows

`--breeze-shadow-panel` and `--breeze-shadow-overlay` are declared on the document element, outside `@theme`, and the `shadow-breeze-panel` and `shadow-breeze-overlay` utilities reference them with `var()`. Tailwind compiles `@theme` shadow values into the generated utilities rather than emitting a variable reference, as it does for colours, font sizes, spacing and radii, so declaring shadows on the document element keeps dark-scheme overrides reactive.

### Colour schemes

Colour-scheme selection applies at the document level through `data-theme`, while painting is scoped to the Breeze root. The dark palette is written twice, once for the system preference and once for an explicit `data-theme="dark"`, because CSS cannot share one declaration block between the two selectors; `src/styles/tokens.test.ts` fails if the copies differ. The brand fill holds the same value in both schemes to preserve contrast for its white label. The dark danger fill lightens to match the design, so its label switches from white to near-black to keep AA contrast. The neutral ramp and the brand and danger text tokens also change.

## Distribution build and size

`vite.config.ts` is the package's only Vite config. The library build bundles React Aria and React Aria Components together, with the upstream `@react-aria/optimize-locales-plugin` keeping English translation modules in the production bundle. Its locale optimization and Vite's built-in `esmExternalRequirePlugin` apply only to library builds; the latter keeps React external while converting the bundled `use-sync-external-store` shim's CommonJS `require('react')` into an ESM import. `BreezeProvider.locale` accepts any BCP 47 tag and controls language, direction and locale-aware formatting; built-in React Aria interaction labels are available in English only. Breeze-owned messages can still be overridden through `messages` where the component supports them.

`react-aria` and `react-aria-components` stay in `dependencies` even though the library build bundles them, so consumers install copies that are never imported at runtime. Moving them to `devDependencies` makes `import/no-extraneous-dependencies` reject every `src/` import of them, and the only way around that would be allowing development dependencies throughout `src/`, which would stop the rule catching genuinely undeclared imports. A larger consumer install is the smaller cost. No emitted declaration references either package, so the move becomes safe if the lint configuration can scope an exception to these two packages.

The one-time comparison used Vite 8.1.5, React Aria 3.50.0, React Aria Components 1.19.0 and `@react-aria/optimize-locales-plugin` 2.0.2. Both production builds used the same Breeze entry points, bundled both React Aria packages and kept the other externals unchanged; the baseline omitted the locale optimizer, and the publishing build used `locales: ['en']`. Raw sizes are emitted JavaScript bytes. Gzip sizes use Node's `gzipSync` at level 9 on each emitted JavaScript file, summed across files; CSS, source maps and fonts are excluded.

| Production JavaScript scope                    |       Raw |           Gzip-9 |
| ---------------------------------------------- | --------: | ---------------: |
| Same bundled build without locale optimization | 641,187 B |        161,374 B |
| English-only build used for publishing         | 532,843 B |        135,413 B |
| Saving                                         | 108,344 B | 25,961 B (16.1%) |

The previous externalized library output was 175,660 B raw and 39,986 B gzip-9 for `index.js`; it left React Aria external and is not comparable to the bundled measurements above. The locale optimization saves 25,961 B gzip-9 (16.1%) from the comparable bundle, which justifies shipping the English-only built-in interaction labels.

The library build enforces both results through the `breeze-library-output-guard` plugin in `vite.config.ts`, so the locale step cannot regress silently. `yarn build` fails when the emitted library JavaScript exceeds 140 KiB (143,360 B) gzip-9, when a source map lists a non-English React Aria locale module, or when it lists no English locale module, which means the audit pattern no longer matches React Aria's layout. To ship additional built-in translations, change the optimizer's `locales: ['en']` option and the guard's English-only check together.

As measured on 2026-10-02, the publishing build emitted 537,199 B raw and 136,753 B (133.55 KiB) gzip-9 of library JavaScript, measured with React Aria 3.50.0 and React Aria Components 1.19.0 bundled.

The optional PDF peer remains dynamically loaded only when an open PDF is rendered and is not included in the library JavaScript measurements. With `pdfjs-dist` 6.3.289, its installed production files measure:

| Optional PDF.js file                           |         Raw |    Gzip-9 |
| ---------------------------------------------- | ----------: | --------: |
| `build/pdf.mjs`                                |   860,384 B | 176,323 B |
| `build/pdf.worker.mjs` (the URL-loaded worker) | 2,228,489 B | 473,507 B |
| Engine total                                   | 3,088,873 B | 649,830 B |

The library and the PDF.js engine are separate payloads: 133.55 KiB gzip-9 of library JavaScript and 634.60 KiB gzip-9 for the engine (both measured on 2026-10-02, and they will drift — the build guard enforces the library budget, so re-measure rather than trusting these figures), loaded only when a PDF is opened.

## Tests and coverage

Run the checks in proportion to the change, then the full package suite:

```sh
yarn typecheck
yarn formatting
yarn lint
yarn test
yarn test-ci
```

Every Storybook story runs axe in Chromium, and violations fail the build. Unit tests run in jsdom against the public component API, and Chromatic reports visual changes. `test/setup.ts` renders every unit test under React `StrictMode`, so effects mount, clean up and mount again; components must tolerate that. Coverage thresholds are 80% for branches, functions, lines and statements.

Test the behaviour Breeze owns at its public boundaries; do not re-test the React Aria keyboard engine. Breeze owns labels, styling, loading presentation and any hand-built interaction, while React Aria supplies press, focus and pending behaviour.

Browser coverage is Chromium only. Firefox and WebKit runs, right-to-left tests, screen-reader certification, an external accessibility audit and a VPAT are out of scope, and text direction is inferred from the locale at runtime.
