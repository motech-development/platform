# Accounts Client Consumer Visual Guards

Accounts Client Playwright screenshot assertions are consumer visual guards for real app compositions affected by Breeze UI migration slices. They supplement Breeze UI visual parity coverage and must not be treated as Breeze UI component parity approval.

The checkpoints live inside existing e2e flows. Do not add standalone visual-only journeys for this guard layer.

## Commands

- `yarn workspace @accounts/client e2e:visual` runs the Accounts Client e2e suite with the embedded consumer visual guards.
- `yarn workspace @accounts/client e2e:visual:update` updates the committed Playwright screenshot baselines after an accepted consumer composition change.

## Guard Rules

- Keep checkpoints bounded to stable screens or dialogs already reached by existing e2e behavior.
- Capture real app composition regions, not isolated Breeze UI components.
- Avoid screenshots that depend on changing dates, animation frames, notification polling, random data, or unresolved network loading.
- Use the shared `consumerVisualGuard` fixture so screenshots use the common deterministic options and `maxDiffPixelRatio` threshold.
