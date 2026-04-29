import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test.describe('Modal visual parity', () => {
  test('captures portal output with known document state', async ({ page }) => {
    await expectVisualParity(page, {
      screenshotName: 'modal-open-portal.png',
      stateAwareSetup: {
        bodyMarkup:
          '<main data-testid="modal-page-content" style="height: 1400px;">Known modal page content</main>',
        overflow: 'hidden',
        scroll: {
          x: 0,
          y: 120,
        },
      },
      storyId: 'modal--basic-modal',
      target: 'body',
    });
  });
});
