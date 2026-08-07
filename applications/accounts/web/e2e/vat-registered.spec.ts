import { expect, test } from './test';

test.describe('VAT registered Accounts', () => {
  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-companies');
    await expect(
      page.getByRole('heading', { name: 'My companies' }),
    ).toBeVisible();
  });

  test('should add a confirmed sale', async ({ page }) => {
    const description = `Confirmed invoice ${Date.now()}`;

    await page.getByTestId('VAT registered co.').click();
    await expect(
      page.getByRole('heading', { name: 'VAT registered co.' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Manage accounts' }).click();
    await expect(
      page.getByRole('heading', { name: 'Accounts' }).last(),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Record transaction' }).click();
    await page.getByLabel('Sale').check();

    await page
      .getByLabel('Select file to upload')
      .setInputFiles('e2e/fixtures/upload/invoice.pdf');
    await expect(page.getByRole('status')).toContainText(
      'PDF attached: invoice.pdf',
    );

    await page.getByRole('button', { name: /Supplier/ }).click();
    await page.getByRole('option', { name: 'Motech Development' }).click();
    await page.getByLabel('Description').fill(description);
    await page.getByRole('radio', { name: 'Confirmed' }).check();
    await page.getByLabel('Amount').fill('2000');
    await expect(page.getByLabel('VAT', { exact: true })).toHaveValue(
      '£310.00',
    );

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Confirmed sale recorded')).toBeVisible();
    await expect(
      page.getByRole('row', { name: new RegExp(description) }),
    ).toBeVisible();
  });
});
