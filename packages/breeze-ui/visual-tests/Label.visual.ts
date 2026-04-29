import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test.describe('Label visual parity', () => {
  test('captures rest and focused transition endpoints', async ({ page }) => {
    await expectVisualParity(page, {
      screenshotName: 'label-transition-endpoints.png',
      stateAwareSetup: {
        disableAnimations: true,
      },
      storyId: 'label--transition-states',
    });
  });
});
