import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test.describe('Loader visual parity', () => {
  test('samples the default animation at a fixed timestamp', async ({
    page,
  }) => {
    await expectVisualParity(page, {
      screenshotName: 'loader-default-fixed-timestamp.png',
      stateAwareSetup: {
        animationTimestamp: 750,
      },
      storyId: 'loader--basic-loader',
      target: '[data-testid="loader-baseline"]',
    });
  });
});
