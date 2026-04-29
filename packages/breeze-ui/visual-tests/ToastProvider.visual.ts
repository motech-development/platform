import { test } from '@playwright/test';
import { expectVisualParity } from './visualHarness';

test.describe('ToastProvider visual parity', () => {
  test('captures portal output with known document state', async ({ page }) => {
    await expectVisualParity(page, {
      screenshotName: 'toast-provider-visible.png',
      stateAwareSetup: {
        bodyMarkup:
          '<main data-testid="toast-page-content" style="height: 1400px;">Known toast page content</main>',
        clockTime: new Date('2024-01-01T00:00:00.000Z'),
        overflow: 'auto',
        scroll: {
          x: 0,
          y: 120,
        },
      },
      storyId: 'toastprovider--visible-toast',
      target: 'body',
    });
  });
});
