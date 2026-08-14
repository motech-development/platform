import { gotoAuthenticatedPage } from './auth';
import dismissNotifications from './notifications';
import { expect, test } from './test';

test.describe('Non-VAT registered', () => {
  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test.beforeEach(async ({ baseURL, page }) => {
    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'My companies' }),
      page,
      path: '/my-companies',
    });
  });

  test.describe('Notifications', () => {
    test('should display a notification', async ({ page }) => {
      const notifications = page.getByRole('button', {
        name: /Notifications \([0-5] unread\)/,
      });

      await notifications.click();
      await expect(
        page.getByText('A scheduled transaction has been published').first(),
      ).toBeVisible();
      await expect(
        page.getByText('Your report is ready to download').first(),
      ).toBeVisible();
      await dismissNotifications(page, notifications);
    });
  });
});
