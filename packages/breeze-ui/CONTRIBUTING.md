# Contributing to Breeze UI

## Component structure

Components live in `src/primitives/Name/` or `src/patterns/Name/`, with the implementation, `.mdx`, `.stories.tsx` and `.test.tsx` files in the same directory. Use `src/primitives/Button` as the reference implementation, and export public values and types from `src/index.ts`.

Documentation pages follow the shape of the MUI component docs: a one-line description, then a short section per option or behaviour with a demo, then `<ArgTypes />` under an `API` heading. Keep implementation detail, rationale and coverage caveats in this file instead.

## Styling

Each component defines a single recipe object containing its `base`, `compound`, `size`, `state` and `variant` groups. Keep keys alphabetical, as required by the repository's `sort-keys` rule, and assemble the class list explicitly in the component; key order does not determine which styles apply.

Class names must be complete literals. Select one by typed key and join the results, and never build a utility name by interpolation. Treatment unions are flat and belong to the component that uses them, and `ControlSize` is the shared `sm | md | lg` contract. Do not reintroduce `tailwind-variants`, `tailwind-merge` or a parallel recipe abstraction.

### Logical properties

Use logical properties for sizing and spacing. The local `breeze/logical-properties` ESLint rule rejects physical spacing, positions, dimensions, edges and alignment in class literals, including responsive and state variants and arbitrary physical property syntax. Use `ms`/`me`, `ps`/`pe`, `start`/`end`, and the spacing-backed `min-block-*`, `min-inline-*`, `block-size-*` and `inline-size-full` utilities. Tailwind v4's `px` and `py` are already logical and are allowed.

## Component API

Props are enumerated explicitly. There is no native-event, styling or slot passthrough, which is what prevents a string label from injecting styled markup. Callbacks report semantic values rather than DOM events. Components read the Breeze context they require and provide their own loading skeleton.

## Tokens

Tokens are prefixed inside the Tailwind namespace, so `--color-breeze-brand` generates `bg-breeze-brand`. The same pattern covers fonts, text sizes, spacing, radii and other measures. Tokens are internal: the package ships compiled CSS, and applications must not depend on them, override them or treat them as a theming API.

### Type scale

| Size | Role                                       |
| ---- | ------------------------------------------ |
| 11px | Badges and compact metadata                |
| 12px | Field labels and secondary metadata        |
| 13px | Buttons, fields, body text and collections |
| 14px | Supporting prose and control content       |
| 15px | Card, dialog and state-panel titles        |
| 17px | Section headings                           |
| 20px | Larger headings                            |
| 22px | Page headings                              |
| 24px | Prominent content                          |
| 26px | Numeric emphasis                           |

Only Button and the provider ship today. The palette and scale cover the components planned for later waves; further additions should be driven by a component that uses them.

### Control sizes

`sm`, `md` and `lg` map to minimum block sizes of 34, 38 and 52px, with a 44px floor applied on coarse pointers. Breakpoint thresholds are deliberately static.

### Shadows

`--breeze-shadow-panel` and `--breeze-shadow-overlay` are declared on the document element, outside `@theme`, and the `shadow-breeze-panel` and `shadow-breeze-overlay` utilities reference them with `var()`. Tailwind compiles `@theme` shadow values into the generated utilities rather than emitting a variable reference, as it does for colours, font sizes, spacing and radii, so declaring shadows on the document element keeps dark-scheme overrides reactive.

### Colour schemes

Colour-scheme selection applies at the document level through `data-theme`, while painting is scoped to the Breeze root. The brand and danger fills hold the same value in both schemes to preserve contrast for white-label text; the neutral ramp and the brand and danger text tokens change.

## Tests and coverage

Run the checks in proportion to the change, then the full package suite:

```sh
yarn typecheck
yarn formatting
yarn lint
yarn test
yarn test-ci
```

Every Storybook story runs axe in Chromium, and violations fail the build. Unit tests run in jsdom against the public component API, and Chromatic reports visual changes. Coverage thresholds are 80% for branches, functions, lines and statements.

Test the behaviour Breeze owns at its public boundaries; do not re-test the React Aria keyboard engine. Breeze owns labels, styling, loading presentation and any hand-built interaction, while React Aria supplies press, focus and pending behaviour.

Browser coverage is Chromium only. Firefox and WebKit runs, right-to-left tests, screen-reader certification, an external accessibility audit and a VPAT are out of scope, and text direction is inferred from the locale at runtime.
