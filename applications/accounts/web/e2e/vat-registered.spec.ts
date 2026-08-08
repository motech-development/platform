import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { gotoAuthenticatedPage } from './auth';
import { expect, test } from './test';

async function focusWithKeyboard(page: Page, target: Locator): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await page.keyboard.press('Tab');
  const firstFocusedElement = await page.evaluateHandle(
    () => document.activeElement,
  );

  async function advanceUntilTarget(): Promise<void> {
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return;
    }

    await page.keyboard.press('Tab');

    if (
      await firstFocusedElement.evaluate(
        (firstElement) => firstElement === document.activeElement,
      )
    ) {
      throw new Error('Add company was not reachable by keyboard');
    }

    await advanceUntilTarget();
  }

  try {
    await advanceUntilTarget();
  } finally {
    await firstFocusedElement.dispose();
  }
}

test.describe('VAT registered Accounts', () => {
  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test.beforeEach(async ({ baseURL, page }) => {
    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'Your companies' }),
      page,
      path: '/my-companies',
    });
  });

  test('supports company management routes at desktop and compact sizes', async ({
    baseURL,
    page,
  }) => {
    const companyNames = await page
      .locator('[data-testid]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('data-testid') ?? ''),
      );

    expect(companyNames).toEqual(
      [...companyNames].sort((left, right) =>
        left.localeCompare(right, 'en-GB', { sensitivity: 'base' }),
      ),
    );

    await page.getByTestId('VAT registered co.').click();
    const companyId = new URL(page.url()).pathname.split('/').at(-1);

    if (!companyId) {
      throw new Error('Company route did not expose its identifier');
    }

    await page.getByRole('link', { name: /Manage company details/ }).click();
    await expect(
      page.getByRole('heading', { name: 'Company details' }),
    ).toBeVisible();
    await expect(page.getByLabel('Company name')).toBeVisible();

    await page.getByRole('link', { name: /Manage settings/ }).click();
    await expect(
      page.getByRole('heading', { exact: true, name: 'Settings' }),
    ).toBeVisible();
    await expect(page.locator('input[readonly]').first()).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(violations).toEqual([]);

    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'Company details' }),
      page,
      path: `/my-companies/update-details/${companyId}`,
    });

    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'Your companies' }),
      page,
      path: '/my-companies',
    });
    await page.setViewportSize({ height: 844, width: 390 });
    const addCompany = page
      .getByRole('button', { name: 'Add a new company' })
      .first();

    await focusWithKeyboard(page, addCompany);
    await expect(addCompany).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Step 1 of 2')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    await page.getByLabel('Company name').fill('Unsaved company');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('heading', { name: 'Discard this company?' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect(page).toHaveURL(/\/my-companies$/);
  });

  test('creates, updates, configures, and exactly deletes a company', async ({
    page,
  }) => {
    const suffix = Date.now().toString();
    const companyName = `Accounts web ${suffix}`;

    await page
      .getByRole('button', { name: 'Add a new company' })
      .first()
      .click();
    await page.getByLabel('Company name').fill(companyName);
    await page.getByLabel('Company number').fill(suffix.slice(-8));
    await page.getByLabel('Account number').fill('12345678');
    await page.getByLabel('Sort code').fill('308639');
    await expect(page.getByLabel('Sort code')).toHaveValue('30-86-39');
    await page.getByLabel('Address line 1').fill('1 Example Street');
    await page.getByLabel('Town or city').fill('London');
    await page.getByLabel('Postcode').fill('sw1a 1aa');
    await page.getByLabel('Email address').fill('accounts-web@example.com');
    const telephone = page.getByLabel('Telephone number');

    await telephone.fill('020 7946 0958');
    await telephone.press('Tab');
    await page.getByRole('button', { name: 'Continue to settings' }).click();
    await page.getByLabel('Standard').press('Space');
    await expect(page.getByLabel('Standard')).toBeChecked();
    await page.getByRole('button', { name: 'Save company' }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: companyName }),
    ).toBeVisible();
    await page.getByRole('link', { name: /Manage company details/ }).click();
    await page.getByLabel('Email address').fill('updated@example.com');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: companyName }),
    ).toBeVisible();

    await page.getByRole('link', { name: /Manage settings/ }).click();
    await page.getByRole('button', { name: 'Add a new category' }).click();
    await page.getByLabel('New category name').fill('Travel');
    await expect(page.getByLabel('VAT rate for Travel')).toHaveValue('20%');
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: companyName }),
    ).toBeVisible();

    await page.getByRole('link', { name: /Manage company details/ }).click();
    await page.getByRole('button', { name: 'Delete company' }).click();
    const confirmation = page.getByLabel(`Type ${companyName} to confirm`);
    const deleteCompany = page.getByRole('button', {
      name: 'Permanently delete company',
    });

    await confirmation.fill(companyName.toLowerCase());
    await expect(deleteCompany).toBeDisabled();
    await confirmation.fill(companyName);
    await deleteCompany.click();
    await expect(
      page.getByRole('heading', { name: 'Your companies' }),
    ).toBeVisible();
    await expect(page.getByTestId(companyName)).toHaveCount(0);
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
