# Tailwind Migration Strategy

Breeze UI will migrate from styled-components to Tailwind through component-level migration slices accumulated into one final migration pull request while preserving the public compatibility surface. Tailwind styles will be compiled into a package-owned stylesheet with preflight disabled, and migrated components must pass a local Storybook-driven Playwright visual parity gate before their styled-components implementation is removed.

## Consequences

- Consuming applications continue importing Breeze UI components without Tailwind configuration or manual stylesheet imports.
- Styled-components and Tailwind temporarily coexist inside Breeze UI during migration work, but the completed migration lands as one pull request after every visual component, including the Base Styles contract, has migrated.
- `styled(Component)` remains supported through `className` forwarding on exported visual components, but generated styled-components class names are not part of the compatibility contract.
- Existing Breeze UI values are encoded as Breeze design tokens instead of being replaced by Tailwind defaults.
- The first migration slice is the button and link primitive cluster: `BaseButton`, `Button`, `LinkButton`, `BaseLink`, `Link`, and `ButtonLink`.
