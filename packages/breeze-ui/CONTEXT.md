# Breeze UI Context

Breeze UI is the shared component library used by Motech Development client applications. This context defines the language for component compatibility and styling ownership.

## Language

**Self-contained Component**:
A Breeze UI component that carries its required styling through the package without requiring consuming applications to configure Tailwind or import additional stylesheets.
_Avoid_: App-owned Tailwind component, consumer-styled component

**Styled Extension**:
Consumer or internal code that applies additional styles by wrapping a Breeze UI component with `styled(...)`.
_Avoid_: Generated class-name dependency, styled-components internals

**Visual Component**:
An exported Breeze UI component whose rendered DOM participates in the visible interface.
_Avoid_: Hook, provider, utility

**Visual Parity Gate**:
A local Storybook-driven Playwright screenshot comparison that proves a migrated component matches its styled-components baseline across required states.
_Avoid_: Manual eyeballing, Chromatic-only approval

**Visual Baseline**:
A committed screenshot artifact generated from the styled-components implementation for a visual parity gate.
_Avoid_: Local-only screenshot, ad hoc reference image

**Layout-aware Visual Gate**:
A visual parity gate that combines deterministic screenshots with DOM layout assertions for components whose correctness depends on responsive distribution or measurement.
_Avoid_: Randomized story comparison, screenshot-only layout proof

**State-aware Visual Gate**:
A visual parity gate that controls timing, portal targets, positioning, or animation state before comparing a component.
_Avoid_: Arbitrary animation frame, uncontrolled portal screenshot

**Migration Slice**:
One Breeze UI visual component or tightly coupled component cluster migrated from styled-components to Tailwind and verified independently.
_Avoid_: Big-bang migration, package-wide rewrite

**Package-owned Stylesheet**:
A Breeze UI generated CSS asset imported by the package itself so consuming applications receive component styles without manual CSS imports.
_Avoid_: Consumer stylesheet import, app-owned Tailwind build

**Base Styles Contract**:
The global reset and document-level styling exported by Breeze UI through `BaseStyles`.
_Avoid_: Tailwind preflight, implicit app reset

**Breeze Design Token**:
A named styling value in Tailwind configuration that preserves an existing Breeze UI visual value.
_Avoid_: Tailwind default replacement, redesign token

**Compatibility Surface**:
The public props, exported names, visible behavior, accessibility semantics, stable selectors, and styled extension targets that consuming applications may rely on.
_Avoid_: Internal DOM freeze, generated class-name contract

**Final Migration Pull Request**:
The single pull request that contains all verified Breeze UI migration slices once the styled-components to Tailwind migration is complete.
_Avoid_: Per-slice pull request, partial migration release, migration flag

**Consumer Build Gate**:
A verification step proving each Breeze UI consuming application still builds after a migration slice.
_Avoid_: Per-slice manual smoke test, app-level migration approval

**Consumer Visual Guard**:
A selective Playwright screenshot checkpoint in a consuming application that verifies a migrated Breeze UI slice still composes correctly in real app screens.
_Avoid_: Component parity source of truth, broad app screenshot suite

**Button Migration Slice**:
The first migration slice covering Breeze UI button, link, and button-like primitives.
_Avoid_: Low-risk pilot component, isolated demo migration

**Migration Foundation Slice**:
The first PRD subtask that establishes Tailwind, package stylesheet, design token, class composition, visual parity, baseline, and consumer build infrastructure for the full migration.
_Avoid_: Ad hoc component migration, component-only first task

## Relationships

- A **Self-contained Component** belongs to Breeze UI and is imported by consuming applications through the public package API.
- A **Self-contained Component** receives Tailwind styling through the **Package-owned Stylesheet**.
- A **Breeze Design Token** mirrors current Breeze UI colors, spacing, typography, dimensions, and interaction values.
- A **Styled Extension** depends on Breeze UI components accepting and forwarding `className`.
- Every **Visual Component** supports **Styled Extension** through `className` forwarding to its outermost meaningful DOM element.
- A **Compatibility Surface** can remain stable even when internal DOM changes.
- A migrated **Visual Component** passes the **Visual Parity Gate** before its styled-components implementation is removed.
- A **Visual Parity Gate** compares migrated components against committed **Visual Baselines**.
- Masonry uses a **Layout-aware Visual Gate** with deterministic item heights, responsive screenshots, and assertions for column count, child order, gutter spacing, and column widths.
- Components with portals, positioning, timers, transitions, or animations use a **State-aware Visual Gate**.
- Breeze UI migrates through **Migration Slices** that are accumulated into the **Final Migration Pull Request**.
- Styled-components and Tailwind temporarily coexist inside the package until the **Final Migration Pull Request** completes the migration.
- Each **Migration Slice** passes the **Consumer Build Gate** for Accounts Client and ID Client.
- Accounts Client may add **Consumer Visual Guards** in existing Playwright flows for real app compositions affected by a migration slice.
- A **Consumer Visual Guard** supplements but does not replace the Breeze UI **Visual Parity Gate**.
- The **Migration Foundation Slice** precedes component migration slices.
- The **Button Migration Slice** includes `BaseButton`, `Button`, `LinkButton`, `BaseLink`, `Link`, and `ButtonLink`.
- The **Button Migration Slice** validates variants, sizes, loading, disabled, hover, block layout, link styling, and styled extension compatibility before other visual components migrate.
- The **Button Migration Slice** can prove the **Migration Foundation Slice** where a concrete visual component is required.
- The **Package-owned Stylesheet** does not include Tailwind preflight; global reset behavior remains part of the **Base Styles Contract**.
- The **Base Styles Contract** migrates only after component-level **Migration Slices** are stable.

## Example Dialogue

> **Dev:** "Can Accounts import a migrated **Self-contained Component** without adding Tailwind config?"
> **Domain expert:** "Yes — Breeze UI owns the styling setup for its **Self-contained Components**."
> **Dev:** "Can a **Styled Extension** still wrap a migrated Button?"
> **Domain expert:** "Yes — wrapping the public component should still work, but generated styled-components class names are not part of the contract."
> **Dev:** "Should a newly migrated **Visual Component** accept a `className` even if it did not before?"
> **Domain expert:** "Yes — `className` forwarding is the compatibility mechanism for **Styled Extensions**."
> **Dev:** "Is Chromatic enough evidence for a migrated Button?"
> **Domain expert:** "No — Button needs a local **Visual Parity Gate** first; Chromatic can support review in CI."
> **Dev:** "Can visual baselines live only on one developer machine?"
> **Domain expert:** "No — commit **Visual Baselines** so migration slices are repeatable locally and in CI."
> **Dev:** "Can Masonry use random story heights in its parity gate?"
> **Domain expert:** "No — Masonry needs a deterministic **Layout-aware Visual Gate**."
> **Dev:** "Can Loader screenshots compare an arbitrary animation frame?"
> **Domain expert:** "No — animation states need a deterministic **State-aware Visual Gate**."
> **Dev:** "Should each verified **Migration Slice** become its own pull request?"
> **Domain expert:** "No — accumulate verified **Migration Slices** into the **Final Migration Pull Request**."
> **Dev:** "Does Accounts need to import `@motech-development/breeze-ui/styles.css`?"
> **Domain expert:** "No — Breeze UI owns its **Package-owned Stylesheet** and wires it through the package."
> **Dev:** "Can Tailwind preflight replace the current reset during component migration?"
> **Domain expert:** "No — preserve the **Base Styles Contract** and keep preflight disabled."
> **Dev:** "Does `BaseStyles` stay on styled-components permanently?"
> **Domain expert:** "No — migrate the **Base Styles Contract** after the visual components so global reset changes do not hide component drift."
> **Dev:** "Can we replace the primary blue with Tailwind's nearest default blue?"
> **Domain expert:** "No — define a **Breeze Design Token** for the current value so migration preserves the UI exactly."
> **Dev:** "Can a migrated component change its internal wrappers?"
> **Domain expert:** "Yes, if the **Compatibility Surface** and visual output remain stable."
> **Dev:** "Should migrated components be hidden behind a feature flag?"
> **Domain expert:** "No — preserve the **Compatibility Surface** in the **Final Migration Pull Request**."
> **Dev:** "Does each slice need a manual smoke test in every consuming app?"
> **Domain expert:** "No — use the **Consumer Build Gate** for consuming applications."
> **Dev:** "Can Accounts Playwright screenshots prove Button parity by themselves?"
> **Domain expert:** "No — use them as **Consumer Visual Guards** while Breeze UI owns the component **Visual Parity Gate**."
> **Dev:** "Which component should prove the migration approach first?"
> **Domain expert:** "Use the **Button Migration Slice** because it exercises the most important styling and extension contracts early."
> **Dev:** "What should the first PRD subtask establish?"
> **Domain expert:** "Start with the **Migration Foundation Slice** so every component slice uses the same Tailwind and visual parity infrastructure."

## Flagged Ambiguities

- "self-contained" was used to mean both API compatibility and styling ownership; resolved: it means Breeze UI owns component styling without consuming application Tailwind setup or extra stylesheet imports.
- "non-breaking" was used to include both public API compatibility and styled-components implementation details; resolved: **Styled Extension** remains supported, but generated styled-components class names and internals do not.
- "pixel perfect" was used to imply both visual and DOM identity; resolved: visual output and the **Compatibility Surface** are stable, but internal DOM is not frozen.
- "migration slice" was used to imply independently released pull requests; resolved: **Migration Slices** are planning and verification chunks accumulated into one **Final Migration Pull Request**.
