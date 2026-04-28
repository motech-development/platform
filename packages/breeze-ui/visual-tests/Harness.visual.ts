import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test.describe('visual parity harness', () => {
  test('loads a Storybook story and compares its screenshot', async ({
    page,
  }) => {
    await expectVisualParity(page, {
      screenshotName: 'button-basic.png',
      storyId: 'button--basic-button',
    });
  });
});
