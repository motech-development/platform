import { expect, test } from './test';

test.describe('Non-VAT registered', () => {
  const companyName = 'Accounts web NoVAT co. Ltd';
  const companyNumber = '34170621';

  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test.beforeEach(async ({ gotoAuthenticatedPage, page }) => {
    await gotoAuthenticatedPage({
      content: page.getByRole('heading', { name: 'My companies' }),
      path: '/my-companies',
    });
  });

  test.describe('Register company', () => {
    test('should create a company', async ({ page }) => {
      await page
        .getByRole('button', { name: 'Add a new company' })
        .first()
        .click();

      await page.getByLabel('Company name').fill(companyName);
      await page.getByLabel('Company number').fill(companyNumber);
      await page.getByLabel('Account number').fill('62057264');
      await page.getByLabel('Sort code').fill('308639');
      await page.getByLabel('Address line 1').fill('30 Imber Lane');
      await page.getByLabel('Town or city').fill('Esher');
      await page.getByLabel('County').fill('Surrey');
      await page.getByLabel('Postcode').fill('KT10 8YF');
      await page.getByLabel('Email address').fill('no-vat@example.com');
      await page.getByLabel('Telephone number').fill('07726478934');
      await page.getByRole('button', { name: 'Continue to settings' }).click();

      await page.getByLabel('None').press('Space');
      await page.getByLabel('Charge rate').fill('0');
      await page.getByLabel('Pay rate').fill('0');
      await page.getByLabel('Day').fill('5');
      await page.getByLabel('Month').click();
      await page.getByRole('option', { exact: true, name: 'April' }).click();
      await page.getByRole('button', { name: 'Save company' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId(companyName).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(
        page.getByRole('heading', { exact: true, name: 'Settings' }),
      ).toBeVisible();
    });

    test('should have correct default settings', async ({ page }) => {
      await expect(page.getByLabel('Charge rate')).toHaveValue('0%');
      await expect(page.getByLabel('Pay rate')).toHaveValue('0%');
      await expect(page.getByLabel('Registration number')).toHaveValue('');
      await expect(page.getByLabel('None')).toBeChecked();
      await expect(page.getByLabel('Day')).toHaveValue('5');
      await expect(page.getByLabel('Month')).toHaveText('April');

      await page.getByLabel('Month').click();
      await page.getByRole('option', { exact: true, name: 'January' }).click();
      await page.getByLabel('Day').fill('1');
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should update company settings', async ({ page }) => {
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('New category name').fill('Accommodation');
      await page.getByLabel('VAT rate for Accommodation').fill('20');
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('New category name').fill('Travel');
      await page.getByLabel('VAT rate for Travel').fill('0');
      await expect(page.getByLabel('Day')).toHaveValue('1');
      await expect(page.getByLabel('Month')).toHaveText('January');
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });
  });

  test.describe('Notifications', () => {
    test('should display a notification', async ({
      dismissNotifications,
      page,
    }) => {
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
      await dismissNotifications(notifications);
    });
  });

  test.describe('Delete company', () => {
    test('should remove company', async ({ page }) => {
      await page.getByTestId(companyName).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
      await page.getByRole('link', { name: /Manage company details/ }).click();
      await page.getByRole('button', { name: 'Delete company' }).click();
      await page.getByLabel(`Type ${companyName} to confirm`).fill(companyName);
      await page
        .getByRole('button', { name: 'Permanently delete company' })
        .click();

      await expect(
        page.getByRole('heading', { name: 'My companies' }),
      ).toBeVisible();
      await expect(page.getByTestId(companyName)).toHaveCount(0);
    });
  });
});
