# Breeze UI Visual Parity Harness

This package owns Storybook-backed Playwright visual parity tests for Breeze UI migration slices. The harness compares current Storybook output against committed screenshots before styled-components implementations are replaced.

## Commands

- `yarn workspace @motech-development/breeze-ui test:visual` runs visual parity tests against Storybook.
- `yarn workspace @motech-development/breeze-ui test:visual:update` updates screenshot baselines after an intentional baseline capture or accepted visual change.
- `STORYBOOK_URL=http://127.0.0.1:6006 yarn workspace @motech-development/breeze-ui test:visual` reuses an already running Storybook instance.

## Writing A Visual Test

Place visual tests in `packages/breeze-ui/visual-tests` with the suffix `.visual.ts`. Use `expectVisualParity` from `visualHarness.ts` so every screenshot uses the default `maxDiffPixelRatio` of `0.001`. A test may pass a lower `maxDiffPixelRatio` when a slice needs a stricter threshold.

```ts
import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test('button default state', async ({ page }) => {
  await expectVisualParity(page, {
    screenshotName: 'button-default.png',
    storyId: 'button--basic-button',
  });
});
```

Use `state: 'hover'` or `state: 'focus'` with `stateTarget` to capture explicit interaction states. Use `viewport: 'xs' | 'sm' | 'md' | 'lg'` for responsive captures. These widths mirror the existing Breeze UI breakpoint contract: `xs` below `576px`, `sm` at `576px`, `md` at `768px`, and `lg` at `992px`.

## Stateful Components

Use `stateAwareSetup` for portals, positioning, timers, transitions, and animations. The helper can install Playwright's clock before the story loads, seed known body markup, set scroll position, set body overflow, and disable transitions/animations before screenshot comparison. Use the `setup` callback for component-specific open states, such as showing a tooltip before capture.

## Masonry Layout Assertions

Use `expectMasonryLayout` with stable story markup to verify Masonry column count, item order, and gutter spacing before calling `expectVisualParity`. Masonry stories used for baselines must use deterministic item heights.

## Baseline Review

Baselines are committed under `visual-tests/__screenshots__`. Review updates by running `test:visual`, inspecting Playwright's HTML report when a screenshot differs, and only accepting `test:visual:update` output when the diff is intentional and matches the migration slice acceptance criteria.
