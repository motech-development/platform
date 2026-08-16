import { expect, expectFinancialSummary, getFormInput, test } from './test';

test.describe('Non-VAT registered', () => {
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

  test.afterAll(async ({ baseURL, cleanupCompany, companies }, testInfo) => {
    if (!companyCleanupRequired) return;

    await cleanupCompany({
      baseURL,
      companyName: companies[1].company.name,
      storageState: testInfo.project.use.storageState,
    });
  });

  test.describe('Register company', () => {
    test.beforeAll(async ({ baseURL, cleanupCompany, companies }, testInfo) => {
      await cleanupCompany({
        baseURL,
        companyName: companies[1].company.name,
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
    test.beforeEach(async ({ companies, openCompanySettings }) => {
      await openCompanySettings(companies[1].company.name);
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
      companies,
      format,
      page,
      settings,
    }) => {
      const companyName = companies[1].company.name;
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
      companies,
      openCompanyClients,
      page,
    }) => {
      const client = clients[0];
      const companyName = companies[1].company.name;

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
      companies,
      openCompanyClients,
      page,
    }) => {
      const client = clients[1];
      const companyName = companies[1].company.name;

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
      companies,
      openCompanyClients,
      page,
    }) => {
      const client = clients[2];
      const companyName = companies[1].company.name;

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
      companies,
      openCompanyClients,
      page,
    }) => {
      const client = clients[1];
      const companyName = companies[1].company.name;
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
      companies,
      openCompanyClients,
      page,
    }) => {
      const client = clients[2];
      const companyName = companies[1].company.name;

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

  test.describe('Accounts', () => {
    test('should add a confirmed sale', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({ expectedVat: '0', transaction: accounts[0] });
    });

    test('should add a confirmed purchase', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({ transaction: accounts[1] });
    });

    test('should add a confirmed purchase refund', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({ refund: true, transaction: accounts[9] });
    });

    test('should add a confirmed purchase refund for updates', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({ refund: true, transaction: accounts[11] });
    });

    test('should update a confirmed purchase refund', async ({
      accounts,
      openAccountsRoute,
      page,
    }) => {
      const transaction = accounts[11];
      const updatedDescription = `${transaction.description} updated`;

      await openAccountsRoute('not-registered');
      await page
        .getByRole('row')
        .filter({ hasText: transaction.description })
        .first()
        .click();
      await expect(page.getByLabel('Purchase')).toBeChecked();
      await expect(
        page.getByRole('radiogroup', { name: 'Refund' }).getByLabel('Yes'),
      ).toBeChecked();
      await expect(getFormInput(page, 'Supplier')).toHaveValue(
        transaction.supplier,
      );
      await expect(getFormInput(page, 'Description')).toHaveValue(
        transaction.description,
      );
      const description = getFormInput(page, 'Description');

      await description.fill(updatedDescription);
      await description.press('Escape');
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Edit transaction' }),
      ).toHaveCount(0);
      await expect(
        page.getByText(updatedDescription, { exact: true }),
      ).toBeVisible();
    });

    test('should delete a confirmed purchase refund', async ({
      accounts,
      openAccountsRoute,
      page,
    }) => {
      const transaction = accounts[11];
      const updatedDescription = `${transaction.description} updated`;

      await openAccountsRoute('not-registered');
      await page
        .getByRole('row')
        .filter({ hasText: updatedDescription })
        .first()
        .click();
      await page.getByRole('button', { name: 'Delete Transaction' }).click();
      await page
        .getByLabel(`Type ${updatedDescription} to confirm`)
        .fill(updatedDescription);
      await page
        .getByRole('button', { name: 'Permanently delete Transaction' })
        .click();
      await expect(page.getByText(updatedDescription)).toHaveCount(0);
    });

    test('should add a confirmed zero VAT rate purchase', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({ transaction: accounts[2] });
    });

    test('should show correct balance details', async ({
      openAccountsRoute,
      page,
    }) => {
      await openAccountsRoute('not-registered');
      await expectFinancialSummary(page, {
        balance: '£1,810.40',
        owed: '£0.00',
        paid: '£12.94',
      });
    });

    test('should delete a confirmed transaction', async ({
      accounts,
      expectNoA11yViolations,
      openAccountsRoute,
      page,
    }) => {
      const transaction = accounts[2];

      await openAccountsRoute('not-registered');
      await page
        .getByRole('row')
        .filter({ hasText: transaction.description })
        .first()
        .click();
      await page.getByRole('button', { name: 'Delete Transaction' }).click();
      await expectNoA11yViolations(
        page.getByRole('heading', {
          name: `Delete ${transaction.description}?`,
        }),
      );
      await page
        .getByLabel(`Type ${transaction.description} to confirm`)
        .fill(transaction.description);
      await page
        .getByRole('button', { name: 'Permanently delete Transaction' })
        .click();
      await expectFinancialSummary(page, { balance: '£1,922.40' });
    });

    test('should add a pending sale', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({
        expectedVat: '0',
        scheduled: true,
        status: 'pending',
        transaction: accounts[3],
      });
    });

    test('should add a pending purchase', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({
        status: 'pending',
        transaction: accounts[4],
      });
    });

    test('should add a pending zero VAT rate purchase', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute('not-registered');
      await recordTransaction({
        date: 'tomorrow',
        status: 'pending',
        transaction: accounts[5],
      });
    });

    test('should schedule a purchase refund', async ({
      accounts,
      openAccountsRoute,
      page,
      recordTransaction,
    }) => {
      const transaction = accounts[12];

      await openAccountsRoute('not-registered');
      await recordTransaction({
        refund: true,
        scheduled: true,
        status: 'pending',
        transaction,
      });
      await expect(
        page.getByText(transaction.description, { exact: true }),
      ).toBeVisible();
    });

    test('should delete a pending transaction', async ({
      accounts,
      openAccountsRoute,
      page,
    }) => {
      const transaction = accounts[5];

      await openAccountsRoute('not-registered');
      await page
        .getByRole('link', { name: 'View Pending Transactions' })
        .click();
      await page
        .getByRole('row')
        .filter({ hasText: transaction.description })
        .first()
        .click();
      await page.getByRole('button', { name: 'Delete Transaction' }).click();
      await page
        .getByLabel(`Type ${transaction.description} to confirm`)
        .fill(transaction.description);
      await page
        .getByRole('button', { name: 'Permanently delete Transaction' })
        .click();
      await expect(page.getByText(transaction.description)).toHaveCount(0);
    });

    test('should have published the scheduled transaction', async ({
      openAccountsRoute,
      page,
    }) => {
      test.setTimeout(630000);
      await openAccountsRoute('not-registered');

      await expect(async () => {
        await page.reload();
        await expectFinancialSummary(page, {
          balance: '£3,946.40',
          owed: '£0.00',
          paid: '£8.94',
        });
      }).toPass({ timeout: 600000 });
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
    test('should remove company', async ({
      companies,
      openCompanyDetails,
      page,
    }) => {
      const companyName = companies[1].company.name;

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
