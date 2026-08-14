import companyFixtures from '@accounts/client/e2e/fixtures/data/company.json' with { type: 'json' };
import { expect, test } from './test';

test.describe('Non-VAT registered', () => {
  const companyFixture = companyFixtures[1];
  const companyName = companyFixture.company.name;
  let companyCleanupRequired = false;

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

  test.afterAll(async ({ baseURL, cleanupCompany }, testInfo) => {
    if (!companyCleanupRequired) return;

    await cleanupCompany({
      baseURL,
      companyName,
      storageState: testInfo.project.use.storageState,
    });
  });

  test.describe('Register company', () => {
    test.beforeAll(async ({ baseURL, cleanupCompany }, testInfo) => {
      await cleanupCompany({
        baseURL,
        companyName,
        storageState: testInfo.project.use.storageState,
      });
    });

    test('should create a company', async ({
      companies,
      page,
      selectMonth,
    }) => {
      const company = companies[1];

      companyCleanupRequired = true;
      await page
        .getByRole('button', { name: 'Add a new company' })
        .first()
        .click();

      await page.getByLabel('Company name').fill(company.company.name);
      await page
        .getByLabel('Company number')
        .fill(company.company.companyNumber);
      await page
        .getByLabel('Account number')
        .fill(company.company.bank.accountNumber);
      await page.getByLabel('Sort code').fill(company.company.bank.sortCode);
      await page
        .getByLabel('Address line 1')
        .fill(company.company.address.line1);
      await page.getByLabel('Town or city').fill(company.company.address.line3);
      await page.getByLabel('County').fill(company.company.address.line4 ?? '');
      await page.getByLabel('Postcode').fill(company.company.address.line5);
      await page
        .getByLabel('Email address')
        .fill(company.company.contact.email);
      await page
        .getByLabel('Telephone number')
        .fill(company.company.contact.telephone);
      await page.getByRole('button', { name: 'Continue to settings' }).click();

      await page.getByLabel('None').press('Space');
      await page.getByLabel('Day').fill(company.yearEnd.day);
      await selectMonth(company.yearEnd.month);
      await page.getByLabel('Charge rate').fill(company.vat.charge);
      await page.getByLabel('Pay rate').fill(company.vat.pay);
      await page.getByRole('button', { name: 'Save company' }).click();

      await expect(
        page.getByRole('heading', {
          level: 1,
          name: company.company.name,
        }),
      ).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test.beforeEach(async ({ openCompanySettings }) => {
      await openCompanySettings(companyName);
    });

    test('should have correct default settings', async ({
      companies,
      format,
      page,
      selectMonth,
      settings,
    }) => {
      const company = companies[1];
      const setting = settings[1];

      await expect(page.getByLabel('Charge rate')).toHaveValue(
        format('percentage', setting.vat.charge),
      );
      await expect(page.getByLabel('Pay rate')).toHaveValue(
        format('percentage', setting.vat.pay),
      );
      await expect(page.getByLabel('Registration number')).toHaveValue(
        company.vat.registration,
      );
      await expect(page.getByLabel('None')).toBeChecked();
      await expect(page.getByLabel('Day')).toHaveValue(company.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveText(
        format('month', company.yearEnd.month),
      );

      await page.getByLabel('Day').fill(setting.yearEnd.day);
      await selectMonth(setting.yearEnd.month);
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expect(
        page.getByRole('heading', {
          level: 1,
          name: company.company.name,
        }),
      ).toBeVisible();
    });

    test('should update company settings', async ({
      addCompanyCategory,
      format,
      page,
      settings,
    }) => {
      const setting = settings[1];

      await addCompanyCategory(
        setting.categories[0].name,
        setting.categories[0].vatRate,
      );
      await addCompanyCategory(
        setting.categories[1].name,
        setting.categories[1].vatRate,
      );
      await expect(page.getByLabel('Day')).toHaveValue(setting.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveText(
        format('month', setting.yearEnd.month),
      );
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();

      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(page.getByLabel('Day')).toHaveValue(setting.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveText(
        format('month', setting.yearEnd.month),
      );
    });
  });

  test.describe('Clients', () => {
    test('should add client 1', async ({
      clients,
      openCompanyClients,
      page,
    }) => {
      const client = clients[0];

      await openCompanyClients(companyName);
      await page.getByRole('button', { name: 'Add a new client' }).click();
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

    test('should add client 2', async ({
      clients,
      openCompanyClients,
      page,
    }) => {
      const client = clients[1];

      await openCompanyClients(companyName);
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

    test('should add client 3', async ({
      clients,
      openCompanyClients,
      page,
    }) => {
      const client = clients[2];

      await openCompanyClients(companyName);
      await page.getByRole('button', { name: 'Add a new client' }).click();
      await page.getByLabel('Client name').fill(client.name);
      await page.getByLabel('Address line 1').fill(client.address.line1);
      await page.getByLabel('Town or city').fill(client.address.line3);
      await page.getByLabel('County').fill(client.address.line4 ?? '');
      await page.getByLabel('Postcode').fill(client.address.line5);
      await page.getByLabel('Email address').fill(client.contact.email);
      await page.getByLabel('Telephone number').fill(client.contact.telephone);
      await page.getByRole('button', { name: 'Save client' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page.getByTestId(client.name)).toBeVisible();
    });

    test('should update client 2', async ({
      clients,
      openCompanyClients,
      page,
    }) => {
      const client = clients[1];
      const updated = clients[3];

      await openCompanyClients(companyName);
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
      await expect(page.getByLabel('County')).toHaveValue(
        client.address.line4 ?? '',
      );
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

    test('should delete client 3', async ({
      clients,
      openCompanyClients,
      page,
    }) => {
      const client = clients[2];

      await openCompanyClients(companyName);
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
    test('should remove company', async ({ openCompanyDetails, page }) => {
      await openCompanyDetails(companyName);
      await page.getByRole('button', { name: 'Delete company' }).click();
      await page.getByLabel(`Type ${companyName} to confirm`).fill(companyName);
      await page
        .getByRole('button', { name: 'Permanently delete company' })
        .click();

      companyCleanupRequired = false;
      await expect(
        page.getByRole('heading', { name: 'My companies' }),
      ).toBeVisible();
      await expect(page.getByTestId(companyName)).toHaveCount(0);
    });
  });
});
