import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { gotoAuthenticatedPage } from './auth';
import focusWithKeyboard from './keyboard';
import { expect, test } from './test';

async function expectNoA11yViolations(
  page: Page,
  readyState: Locator,
): Promise<void> {
  await expect(readyState).toBeVisible();
  await readyState.evaluate(async (element) => {
    await Promise.allSettled(
      element.ownerDocument
        .getAnimations()
        .map((animation) => animation.finished),
    );
  });
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(violations).toEqual([]);
}

async function selectOption(
  page: Page,
  label: string,
  option: string,
): Promise<void> {
  await page.getByLabel(label).click();
  await page.getByRole('option', { exact: true, name: option }).click();
}

async function removeCompany(
  page: Page,
  baseURL: string | undefined,
  companyName: string,
): Promise<void> {
  await gotoAuthenticatedPage({
    baseURL,
    content: page.getByRole('heading', { name: 'My companies' }),
    page,
    path: '/my-companies',
  });
  const company = page.getByTestId(companyName);

  await expect(
    page.getByRole('status', { name: 'Loading companies' }),
  ).toHaveCount(0);

  if (!(await company.isVisible())) return;

  await company.click();
  await page.getByRole('link', { name: /Manage company details/ }).click();
  await page.getByRole('button', { name: 'Delete company' }).click();
  await page.getByLabel(`Type ${companyName} to confirm`).fill(companyName);
  await page
    .getByRole('button', { name: 'Permanently delete company' })
    .click();
  await expect(page.getByTestId(companyName)).toHaveCount(0);
}

test.describe('VAT registered Accounts', () => {
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
      page.getByRole('heading', { level: 1, name: 'Company details' }),
    ).toBeVisible();
    await expect(page.getByLabel('Company name')).toBeVisible();

    await page.getByRole('link', { name: /Manage settings/ }).click();
    await expect(
      page.getByRole('heading', { exact: true, name: 'Settings' }),
    ).toBeVisible();
    await expect(page.locator('input[readonly]').first()).toBeVisible();
    await expectNoA11yViolations(page, page.getByLabel('Registration number'));

    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', {
        level: 1,
        name: 'Company details',
      }),
      page,
      path: `/my-companies/update-details/${companyId}`,
    });

    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'My companies' }),
      page,
      path: '/my-companies',
    });
    await page.setViewportSize({ height: 844, width: 390 });
    const addCompany = page
      .getByRole('button', { name: 'Add a new company' })
      .first();

    await focusWithKeyboard(
      page,
      addCompany,
      'Add company was not reachable by keyboard',
    );
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

  test.describe
    .serial('original company and client-management journeys', () => {
    const suffix = Date.now().toString().slice(-8);
    const companyName = `Accounts web ${suffix}`;
    const clients = [
      {
        address: {
          line1: '246 Park View',
          line3: 'Whitley Bay',
          line5: 'NE26 3QX',
        },
        contact: {
          email: 'info@motechdevelopment.co.uk',
          telephone: '01914628347',
        },
        name: 'Motech Development',
      },
      {
        address: {
          line1: 'Unit 20',
          line2: '72 Wood Lane',
          line3: 'Kingston upon Thames',
          line4: 'Surrey',
          line5: 'KT2 9TS',
        },
        contact: {
          email: 'no-reply@inno-sols.com',
          telephone: '02083877937',
        },
        name: 'Innovative Solutions',
      },
      {
        address: {
          line1: '34 Dover Road',
          line3: 'Ledbury',
          line4: 'Hereford',
          line5: 'HR8 0QH',
        },
        contact: {
          email: 'contact@acme.com',
          telephone: '07736727672',
        },
        name: 'Acme Ltd',
      },
      { name: 'Inno Sols' },
    ] as const;

    async function openCompany(page: Page): Promise<void> {
      await page.getByTestId(companyName).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    }

    async function openCompanyDetails(page: Page): Promise<void> {
      await openCompany(page);
      await page.getByRole('link', { name: /Manage company details/ }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Company details' }),
      ).toBeVisible();
    }

    async function openSettings(page: Page): Promise<void> {
      await openCompany(page);
      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(
        page.getByRole('heading', { exact: true, name: 'Settings' }),
      ).toBeVisible();
    }

    async function openClients(page: Page): Promise<void> {
      await openCompany(page);
      await page.getByRole('link', { name: /Manage clients/ }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page).toHaveURL(/my-companies\/clients\/[0-9a-f-]+$/);
    }

    async function addCategory(
      page: Page,
      name: string,
      vatRate: string,
    ): Promise<void> {
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('New category name').fill(name);
      await page.getByLabel(`VAT rate for ${name}`).fill(vatRate);
    }

    test.afterAll(async ({ baseURL, browser }) => {
      const page = await browser.newPage({
        baseURL,
        storageState: test.info().project.use.storageState,
      });

      try {
        await removeCompany(page, baseURL, companyName).catch(() => undefined);
      } finally {
        await page.close();
      }
    });

    test('should create a company', async ({ page }) => {
      await expectNoA11yViolations(
        page,
        page.getByRole('button', { name: 'Add a new company' }).first(),
      );
      await page
        .getByRole('button', { name: 'Add a new company' })
        .first()
        .click();
      await expect(
        page.getByRole('heading', { name: 'Add company' }),
      ).toBeVisible();
      await expectNoA11yViolations(page, page.getByLabel('Company name'));

      await page.getByLabel('Company name').fill(companyName);
      await page.getByLabel('Company number').fill(suffix);
      await page.getByLabel('Account number').fill('62057264');
      await page.getByLabel('Sort code').fill('308639');
      await expect(page.getByLabel('Sort code')).toHaveValue('30-86-39');
      await page.getByLabel('Address line 1').fill('Unit 1');
      await page.getByLabel('Address line 2').fill('123 Cypress Street');
      await page.getByLabel('Town or city').fill('London');
      await page.getByLabel('Postcode').fill('sw21 1na');
      await page.getByLabel('Email address').fill('accounts-web@example.com');
      const telephone = page.getByLabel('Telephone number');

      await telephone.fill('02083895728');
      await telephone.press('Tab');
      await page.getByRole('button', { name: 'Continue to settings' }).click();

      await page.getByLabel('VAT registration').fill('216506516');
      await expect(page.getByLabel('VAT registration')).toHaveValue(
        'GB216506516',
      );
      await page.getByLabel('Standard').press('Space');
      await expect(page.getByLabel('Standard')).toBeChecked();
      await page.getByLabel('Day').fill('5');
      await selectOption(page, 'Month', 'April');
      await page.getByLabel('Opening balance').fill('1000');
      await page.getByLabel('VAT owed').fill('100');
      await page.getByLabel('VAT paid').fill('10');
      await page.getByRole('button', { name: 'Save company' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should update company details', async ({ page }) => {
      await openCompanyDetails(page);
      await expectNoA11yViolations(page, page.getByLabel('Company name'));

      await expect(page.getByLabel('Company name')).toHaveValue(companyName);
      await expect(page.getByLabel('Company number')).toHaveValue(suffix);
      await expect(page.getByLabel('Account number')).toHaveValue('62057264');
      await expect(page.getByLabel('Sort code')).toHaveValue('30-86-39');
      await page.getByLabel('Account number').fill('74782147');
      await page.getByLabel('Sort code').fill('347924');
      await page.getByLabel('Address line 1').fill('Motech Towers');
      await page.getByLabel('Address line 2').clear();
      await page.getByLabel('Email address').fill('update@example.com');
      await page.getByRole('button', { name: 'Save changes' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should update company settings', async ({ page }) => {
      await openSettings(page);
      await expectNoA11yViolations(
        page,
        page.getByLabel('Registration number'),
      );

      await addCategory(page, 'Accommodation', '20');
      await addCategory(page, 'Travel', '0');
      await addCategory(page, 'Sustenance', '20');

      await expect(page.getByLabel('Pay rate')).toHaveValue('20%');
      const payRate = page.getByLabel('Pay rate');

      await payRate.clear();
      await payRate.type('15.5');
      await payRate.press('Tab');
      await expect(payRate).toHaveValue('15.5%');
      await page.getByLabel('Registration number').fill('657497583');
      await page.getByLabel('Flat rate').press('Space');
      await expect(page.getByLabel('Flat rate')).toBeChecked();
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should remove expenses category', async ({ page }) => {
      await openSettings(page);
      await expect(page.getByLabel('Accommodation name')).toHaveValue(
        'Accommodation',
      );
      await expect(page.getByLabel('VAT rate for Travel')).toHaveValue('0%');
      await expect(page.getByLabel('Pay rate')).toHaveValue('15.5%');
      await expect(page.getByLabel('Flat rate')).toBeChecked();

      await page.getByRole('button', { name: 'Remove Accommodation' }).click();
      await page.getByRole('button', { name: 'Remove Travel' }).click();
      await page.getByRole('button', { name: 'Remove Sustenance' }).click();

      await page.getByRole('button', { name: 'Save settings' }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should re-add expense categories', async ({ page }) => {
      await openSettings(page);

      await addCategory(page, 'Expenses', '20');
      await addCategory(page, 'Travel', '0');

      await page.getByRole('button', { name: 'Save settings' }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should add client 1', async ({ page }) => {
      const client = clients[0];

      await openClients(page);
      await expectNoA11yViolations(
        page,
        page.getByRole('button', { name: 'Add a new client' }),
      );
      await page.setViewportSize({ height: 844, width: 390 });
      const addClient = page.getByRole('button', {
        name: 'Add a new client',
      });

      await focusWithKeyboard(
        page,
        addClient,
        'Add client was not reachable by keyboard',
      );
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('heading', { name: 'Add client' }),
      ).toBeVisible();
      await expectNoA11yViolations(page, page.getByLabel('Client name'));
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);

      await page.getByLabel('Client name').fill(client.name);
      await page.getByLabel('Address line 1').fill(client.address.line1);
      await page.getByLabel('Town or city').fill(client.address.line3);
      await page.getByLabel('Postcode').fill(client.address.line5);
      await page.getByLabel('Email address').fill(client.contact.email);
      await page.getByLabel('Telephone number').fill(client.contact.telephone);
      await page.getByRole('button', { name: 'Save client' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(client.name)).toBeVisible();
    });

    test('should add client 2', async ({ page }) => {
      const client = clients[1];

      await openClients(page);
      await page.getByRole('button', { name: 'Add a new client' }).click();
      await page.getByLabel('Client name').fill(client.name);
      await page.getByLabel('Address line 1').fill(client.address.line1);
      await page.getByLabel('Address line 2').fill(client.address.line2);
      await page.getByLabel('Town or city').fill(client.address.line3);
      await page.getByLabel('County').fill(client.address.line4);
      await page.getByLabel('Postcode').fill(client.address.line5);
      await page.getByLabel('Email address').fill(client.contact.email);
      await page.getByLabel('Telephone number').fill(client.contact.telephone);
      await page.getByRole('button', { name: 'Save client' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(client.name)).toBeVisible();
    });

    test('should add client 3', async ({ page }) => {
      const client = clients[2];

      await openClients(page);
      await page.getByRole('button', { name: 'Add a new client' }).click();
      await page.getByLabel('Client name').fill(client.name);
      await page.getByLabel('Address line 1').fill(client.address.line1);
      await page.getByLabel('Town or city').fill(client.address.line3);
      await page.getByLabel('County').fill(client.address.line4);
      await page.getByLabel('Postcode').fill(client.address.line5);
      await page.getByLabel('Email address').fill(client.contact.email);
      await page.getByLabel('Telephone number').fill(client.contact.telephone);
      await page.getByRole('button', { name: 'Save client' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(client.name)).toBeVisible();
    });

    test('should update client 2', async ({ page }) => {
      const client = clients[1];
      const updated = clients[3];

      await openClients(page);
      await page.getByTestId(client.name).click();

      await expect(page.getByLabel('Client name')).toHaveValue(client.name);
      await page.getByLabel('Client name').fill(updated.name);
      await expect(page.getByLabel('Address line 1')).toHaveValue(
        client.address.line1,
      );
      await expect(page.getByLabel('Address line 2')).toHaveValue(
        client.address.line2,
      );
      await expect(page.getByLabel('Town or city')).toHaveValue(
        client.address.line3,
      );
      await expect(page.getByLabel('County')).toHaveValue(client.address.line4);
      await expect(page.getByLabel('Postcode')).toHaveValue(
        client.address.line5,
      );
      await expect(page.getByLabel('Email address')).toHaveValue(
        client.contact.email,
      );
      await expect(page.getByLabel('Telephone number')).toHaveValue(
        client.contact.telephone,
      );
      await page.getByRole('button', { name: 'Save client' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(updated.name)).toBeVisible();
      await expect(page.getByTestId(client.name)).toHaveCount(0);
    });

    test('should delete client 3', async ({ page }) => {
      const client = clients[2];

      await openClients(page);
      await page.getByTestId(client.name).click();
      await page.getByRole('button', { name: 'Delete client' }).click();
      await page.getByLabel(`Type ${client.name} to confirm`).fill(client.name);
      await page
        .getByRole('button', { name: 'Permanently delete client' })
        .click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(client.name)).toHaveCount(0);
    });

    test('should remove company', async ({ page }) => {
      await openCompanyDetails(page);
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
        page.getByRole('heading', { name: 'My companies' }),
      ).toBeVisible();
      await expect(page.getByTestId(companyName)).toHaveCount(0);
    });
  });

  test.describe.serial('original non-VAT company-management journeys', () => {
    const suffix = Date.now().toString().slice(-8);
    const companyName = `Accounts non-VAT ${suffix}`;

    async function openSettings(page: Page): Promise<void> {
      await page.getByTestId(companyName).click();
      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(
        page.getByRole('heading', { exact: true, name: 'Settings' }),
      ).toBeVisible();
    }

    test.afterAll(async ({ baseURL, browser }) => {
      const page = await browser.newPage({
        baseURL,
        storageState: test.info().project.use.storageState,
      });

      try {
        await removeCompany(page, baseURL, companyName).catch(() => undefined);
      } finally {
        await page.close();
      }
    });

    test('should create a non-VAT company with the established defaults', async ({
      page,
    }) => {
      await page
        .getByRole('button', { name: 'Add a new company' })
        .first()
        .click();
      await page.getByLabel('Company name').fill(companyName);
      await page.getByLabel('Company number').fill(suffix);
      await page.getByLabel('Account number').fill('62057264');
      await page.getByLabel('Sort code').fill('308639');
      await page.getByLabel('Address line 1').fill('Unit 2');
      await page.getByLabel('Town or city').fill('London');
      await page.getByLabel('Postcode').fill('SW21 1NA');
      await page.getByLabel('Email address').fill('non-vat@example.com');
      await page.getByLabel('Telephone number').fill('02083895728');
      await page.getByRole('button', { name: 'Continue to settings' }).click();

      await page.getByLabel('None').press('Space');
      await expect(page.getByLabel('VAT registration')).toHaveValue('');
      await expect(page.getByLabel('Charge rate')).toHaveValue('20%');
      await expect(page.getByLabel('Pay rate')).toHaveValue('20%');
      await page.getByRole('button', { name: 'Save company' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should preserve and update non-VAT settings', async ({ page }) => {
      await openSettings(page);
      await expect(page.getByLabel('None')).toBeChecked();
      await expect(page.getByLabel('Registration number')).toHaveValue('');
      await expect(page.getByLabel('Charge rate')).toHaveValue('20%');
      await expect(page.getByLabel('Pay rate')).toHaveValue('20%');

      await page.getByLabel('Day').fill('1');
      await selectOption(page, 'Month', 'January');
      await page.getByRole('button', { name: 'Save settings' }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();

      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(page.getByLabel('Day')).toHaveValue('1');
      await expect(page.getByLabel('Month')).toHaveText('January');
    });

    test('should remove the non-VAT company', async ({ baseURL, page }) => {
      await gotoAuthenticatedPage({
        baseURL,
        content: page.getByRole('heading', { name: 'My companies' }),
        page,
        path: '/my-companies',
      });
      await removeCompany(page, baseURL, companyName);
    });
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
    await page.getByRole('radio', { name: 'Sale' }).check();

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
