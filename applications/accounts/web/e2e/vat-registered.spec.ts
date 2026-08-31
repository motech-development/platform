import {
  expect,
  expectCompanyDashboard,
  expectFinancialSummary,
  getFormInput,
  test,
  waitForFiniteAnimations,
} from './test';

test.describe('VAT registered', () => {
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
      companyName: companies[0].company.name,
      storageState: testInfo.project.use.storageState,
    });
  });

  test.describe('Register company', () => {
    test.beforeAll(async ({ baseURL, cleanupCompany, companies }, testInfo) => {
      await cleanupCompany({
        baseURL,
        companyName: companies[0].company.name,
        storageState: testInfo.project.use.storageState,
      });
    });

    test('should create a company', async ({
      companies,
      expectNoA11yViolations,
      format,
      page,
      selectMonth,
    }) => {
      const company = companies[0];

      companyCleanupRequired = true;
      await expectNoA11yViolations(
        page.getByRole('button', { name: 'Add a new company' }).first(),
      );
      await page
        .getByRole('button', { name: 'Add a new company' })
        .first()
        .click();
      await expect(
        page.getByRole('heading', { name: 'Add company' }),
      ).toBeVisible();
      await expectNoA11yViolations(page.getByLabel('Company name'));

      await page.getByLabel('Company name').fill(company.company.name);
      await page
        .getByLabel('Company number')
        .fill(company.company.companyNumber);
      await page
        .getByLabel('Account number')
        .fill(company.company.bank.accountNumber);
      await page.getByLabel('Sort code').fill(company.company.bank.sortCode);
      await expect(page.getByLabel('Sort code')).toHaveValue(
        format('sort code', company.company.bank.sortCode),
      );
      await page
        .getByLabel('Address line 1')
        .fill(company.company.address.line1);
      await page
        .getByLabel('Address line 2')
        .fill(company.company.address.line2);
      await page.getByLabel('Town or city').fill(company.company.address.line3);
      await page.getByLabel('Postcode').fill(company.company.address.line5);
      await page
        .getByLabel('Email address')
        .fill(company.company.contact.email);
      const telephone = page.getByLabel('Telephone number');

      await telephone.fill(company.company.contact.telephone);
      await telephone.press('Tab');
      await page.getByRole('button', { name: 'Continue to settings' }).click();

      await page.getByLabel('VAT registration').fill(company.vat.registration);
      await expect(page.getByLabel('VAT registration')).toHaveValue(
        format('VAT registration', company.vat.registration),
      );
      await page.getByLabel('Standard').press('Space');
      await expect(page.getByLabel('Standard')).toBeChecked();
      await page.getByLabel('Day').fill(company.yearEnd.day);
      await selectMonth(company.yearEnd.month);
      await page.getByLabel('Opening balance').fill(company.balance.balance);
      await page.getByLabel('VAT owed').fill(company.balance.vat.owed);
      await page.getByLabel('VAT paid').fill(company.balance.vat.paid);
      await page.getByRole('button', { name: 'Save company' }).click();

      await expectCompanyDashboard(page, company.company.name);
      await expect(
        page.getByRole('alertdialog', { name: 'Company added' }),
      ).toContainText(`${company.company.name} is ready to use.`);
    });
  });

  test('supports company management routes at desktop and compact sizes', async ({
    companies,
    expectNoA11yViolations,
    focusWithKeyboard,
    gotoAuthenticatedPage,
    page,
  }) => {
    const companyName = companies[0].company.name;
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

    await page.getByTestId(companyName).click();
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
    await expectNoA11yViolations(page.getByLabel('Registration number'));

    await gotoAuthenticatedPage({
      content: page.getByRole('heading', {
        level: 1,
        name: 'Company details',
      }),
      path: `/my-companies/update-details/${companyId}`,
    });

    await gotoAuthenticatedPage({
      content: page.getByRole('heading', { name: 'My companies' }),
      path: '/my-companies',
    });
    await page.setViewportSize({ height: 844, width: 390 });
    const addCompany = page
      .getByRole('button', { name: 'Add a new company' })
      .first();

    await focusWithKeyboard(
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

    await page.getByLabel('Company name').fill(companyName);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('heading', { name: 'Discard this company?' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Discard changes' }).click();
    await expect(page).toHaveURL(/\/my-companies$/);
  });

  test.describe('Update company', () => {
    test('should update company details', async ({
      companies,
      expectNoA11yViolations,
      format,
      openCompanyDetails,
      page,
    }) => {
      const company = companies[0];
      const updated = companies[2].company;

      await openCompanyDetails(company.company.name);
      await expectNoA11yViolations(page.getByLabel('Company name'));

      await expect(page.getByLabel('Company name')).toHaveValue(
        company.company.name,
      );
      await expect(page.getByLabel('Company number')).toHaveValue(
        company.company.companyNumber,
      );
      await expect(page.getByLabel('Account number')).toHaveValue(
        company.company.bank.accountNumber,
      );
      await expect(page.getByLabel('Sort code')).toHaveValue(
        format('sort code', company.company.bank.sortCode),
      );
      await expect(page.getByLabel('Address line 1')).toHaveValue(
        company.company.address.line1,
      );
      await expect(page.getByLabel('Address line 2')).toHaveValue(
        company.company.address.line2,
      );
      await expect(page.getByLabel('Town or city')).toHaveValue(
        company.company.address.line3,
      );
      await expect(page.getByLabel('Postcode')).toHaveValue(
        company.company.address.line5,
      );
      await expect(page.getByLabel('Email address')).toHaveValue(
        company.company.contact.email,
      );
      await expect(page.getByLabel('Telephone number')).toHaveValue(
        company.company.contact.telephone,
      );

      await page.getByLabel('Account number').fill(updated.bank.accountNumber);
      await page.getByLabel('Sort code').fill(updated.bank.sortCode);
      await page.getByLabel('Address line 1').fill(updated.address.line1);
      await page.getByLabel('Address line 2').clear();
      await page.getByLabel('Email address').fill(updated.contact.email);
      await page.getByRole('button', { name: 'Save changes' }).click();

      await expectCompanyDashboard(page, company.company.name);
    });
  });

  test.describe('Settings', () => {
    test('should update company settings', async ({
      addCompanyCategory,
      companies,
      expectNoA11yViolations,
      format,
      openCompanySettings,
      page,
      settings,
    }) => {
      const company = companies[0];
      const setting = settings[0];

      await openCompanySettings(company.company.name);
      await expectNoA11yViolations(page.getByLabel('Registration number'));

      await addCompanyCategory(
        setting.categories[0].name,
        setting.categories[0].vatRate,
      );
      await addCompanyCategory(
        setting.categories[1].name,
        setting.categories[1].vatRate,
      );
      await addCompanyCategory(
        setting.categories[2].name,
        setting.categories[2].vatRate,
      );

      await expect(page.getByLabel('Pay rate')).toHaveValue(
        format('percentage', '20'),
      );
      const payRate = page.getByLabel('Pay rate');

      await payRate.clear();
      await payRate.type(setting.vat.pay);
      await payRate.press('Tab');
      await expect(payRate).toHaveValue(format('percentage', setting.vat.pay));
      await expect(page.getByLabel('Registration number')).toHaveValue(
        format('VAT registration', company.vat.registration),
      );
      await page
        .getByLabel('Registration number')
        .fill(setting.vat.registration);
      await page.getByLabel('Flat rate').press('Space');
      await expect(page.getByLabel('Flat rate')).toBeChecked();
      await expect(page.getByLabel('Day')).toHaveValue(company.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveText(
        format('month', company.yearEnd.month),
      );
      await page.getByRole('button', { name: 'Save settings' }).click();

      await expectCompanyDashboard(page, company.company.name);
    });

    test('should remove expenses category', async ({
      companies,
      format,
      openCompanySettings,
      page,
      settings,
    }) => {
      const companyName = companies[0].company.name;
      const setting = settings[0];

      await openCompanySettings(companyName);
      await expect(page.getByLabel('Accommodation name')).toHaveValue(
        setting.categories[0].name,
      );
      await expect(page.getByLabel('VAT rate for Accommodation')).toHaveValue(
        format('percentage', setting.categories[0].vatRate),
      );
      await expect(page.getByLabel('Travel name')).toHaveValue(
        setting.categories[1].name,
      );
      await expect(page.getByLabel('VAT rate for Travel')).toHaveValue(
        format('percentage', setting.categories[1].vatRate),
      );
      await expect(page.getByLabel('Sustenance name')).toHaveValue(
        setting.categories[2].name,
      );
      await expect(page.getByLabel('VAT rate for Sustenance')).toHaveValue(
        format('percentage', setting.categories[2].vatRate),
      );
      await expect(page.getByLabel('Charge rate')).toHaveValue(
        format('percentage', setting.vat.charge),
      );
      await expect(page.getByLabel('Pay rate')).toHaveValue(
        format('percentage', setting.vat.pay),
      );
      await expect(page.getByLabel('Registration number')).toHaveValue(
        format('VAT registration', setting.vat.registration),
      );
      await expect(page.getByLabel('Flat rate')).toBeChecked();

      await page.getByRole('button', { name: 'Remove Accommodation' }).click();
      await page.getByRole('button', { name: 'Remove Travel' }).click();
      await page.getByRole('button', { name: 'Remove Sustenance' }).click();

      await page.getByRole('button', { name: 'Save settings' }).click();
      await expectCompanyDashboard(page, companyName);
    });

    test('should re-add expense categories', async ({
      addCompanyCategory,
      companies,
      openCompanySettings,
      page,
      settings,
    }) => {
      const companyName = companies[0].company.name;
      const setting = settings[0];

      await openCompanySettings(companyName);

      await addCompanyCategory('Expenses', setting.categories[0].vatRate);
      await addCompanyCategory(
        setting.categories[1].name,
        setting.categories[1].vatRate,
      );

      await page.getByRole('button', { name: 'Save settings' }).click();
      await expectCompanyDashboard(page, companyName);
    });
  });

  test.describe('Clients', () => {
    test('should add client 1', async ({
      clients,
      companies,
      expectNoA11yViolations,
      focusWithKeyboard,
      openCompanyClients,
      page,
    }) => {
      const client = clients[0];
      const companyName = companies[0].company.name;

      await openCompanyClients(companyName);
      await expectNoA11yViolations(
        page.getByRole('button', { name: 'Add a new client' }),
      );
      await page.setViewportSize({ height: 844, width: 390 });
      const addClient = page.getByRole('button', {
        name: 'Add a new client',
      });

      await focusWithKeyboard(
        addClient,
        'Add client was not reachable by keyboard',
      );
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('heading', { name: 'Add client' }),
      ).toBeVisible();
      await expectNoA11yViolations(page.getByLabel('Client name'));
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
  });

  test.describe('Accounts', () => {
    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(
        /my-companies\/accounts\/[0-9a-f-]+(?:\/.*)?$/,
      );
    });

    test('should add a confirmed sale', async ({
      accounts,
      invoice,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({
        attachment: invoice,
        attachmentTiming: 'after-type',
        checkA11y: true,
        transaction: accounts[0],
      });
    });

    test('should add a confirmed sale refund', async ({
      accounts,
      eicar,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({
        attachment: await eicar(),
        refund: true,
        transaction: accounts[8],
      });
    });

    test('should add a confirmed purchase', async ({
      accounts,
      invoice,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({
        attachment: invoice,
        transaction: accounts[1],
      });
    });

    test('should add a confirmed zero VAT rate purchase', async ({
      accounts,
      invoice,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({
        attachment: invoice,
        transaction: accounts[2],
      });
    });

    test('should show correct balance details', async ({
      openAccountsRoute,
      page,
    }) => {
      await openAccountsRoute();
      await expectFinancialSummary(page, {
        balance: '£2,290.40',
        owed: '£332.50',
        paid: '£26.27',
      });
    });

    test('should update a transaction', async ({
      accounts,
      expectNoA11yViolations,
      format,
      invoice,
      openAccountsRoute,
      page,
    }) => {
      const originalTransaction = accounts[0];
      const transaction = accounts[6];

      await openAccountsRoute();
      await page
        .getByRole('row')
        .filter({ hasText: originalTransaction.description })
        .filter({
          hasText: format('ledger currency', originalTransaction.amount),
        })
        .click();
      const drawer = page.getByRole('dialog', { name: 'Edit transaction' });

      await expect(drawer).toBeVisible();
      await expect(drawer.locator('form')).toBeVisible();
      await waitForFiniteAnimations(drawer.locator('..'));
      await expectNoA11yViolations(
        page.getByRole('heading', { name: 'Edit transaction' }),
      );
      await expect(
        page
          .getByRole('radiogroup', { name: 'Transaction type' })
          .getByLabel('Sale'),
      ).toBeChecked();
      await expect(
        page.getByRole('button', { name: transaction.supplier }),
      ).toBeVisible();
      await expect(getFormInput(page, 'Description')).toHaveValue(
        transaction.description,
      );
      await expect(page.locator('form').getByLabel('Confirmed')).toBeChecked();
      await expect(
        page.getByRole('radiogroup', { name: 'Refund' }).getByLabel('No'),
      ).toBeChecked();
      await getFormInput(page, 'Amount').fill(transaction.amount);
      await expect(page.getByLabel('VAT', { exact: true })).toHaveValue(
        format('currency', transaction.vat),
      );
      await page.getByRole('button', { name: 'Delete file' }).click();
      await page.getByLabel('Select file to upload').setInputFiles(invoice);
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);
      await page.getByRole('button', { name: 'Save transaction' }).click();
      await expect(
        page.getByRole('heading', { name: 'Edit transaction' }),
      ).toHaveCount(0);
      await expectFinancialSummary(page, {
        balance: '£2,790.40',
        owed: '£410.00',
      });
    });

    test('should delete a confirmed transaction', async ({
      accounts,
      expectNoA11yViolations,
      format,
      openAccountsRoute,
      page,
    }) => {
      const transaction = accounts[0];
      const updatedTransaction = accounts[6];

      await openAccountsRoute();
      await page
        .getByRole('row')
        .filter({ hasText: transaction.description })
        .filter({
          hasText: format('ledger currency', updatedTransaction.amount),
        })
        .click();
      await page.getByRole('button', { name: 'Delete transaction' }).click();
      await expectNoA11yViolations(
        page.getByRole('heading', {
          name: `Delete ${transaction.supplier}?`,
        }),
      );
      await page
        .getByLabel(`Type ${transaction.supplier} to confirm`)
        .fill(transaction.supplier);
      await page
        .getByRole('button', { name: 'Permanently delete transaction' })
        .click();
      await expectFinancialSummary(page, {
        balance: '£290.40',
        owed: '£22.50',
      });
    });

    test('should make a VAT payment', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({ transaction: accounts[7] });
    });

    test('should make a VAT refund', async ({
      accounts,
      openAccountsRoute,
      recordTransaction,
    }) => {
      await openAccountsRoute();
      await recordTransaction({ refund: true, transaction: accounts[10] });
    });

    test('should show correct balance details after VAT is paid', async ({
      openAccountsRoute,
      page,
    }) => {
      await openAccountsRoute();
      await expectFinancialSummary(page, {
        balance: '£267.90',
        owed: '£0.00',
      });
    });

    test('should download attachment', async ({
      accounts,
      openAccountsRoute,
      page,
    }) => {
      await openAccountsRoute();
      await page
        .getByRole('row')
        .filter({ hasText: accounts[1].description })
        .first()
        .click();
      await page.getByRole('button', { name: 'View file' }).click();
      const preview = page.getByRole('region', { name: 'PDF preview' });

      await expect(preview).toBeVisible();
      await expect(preview.locator('.react-pdf__Document')).toBeVisible();
      const download = page.waitForEvent('download');
      const attachment = page.getByRole('dialog').filter({ has: preview });

      await attachment.getByRole('button', { name: 'Download file' }).click();
      await download;
      await expect(
        page.getByRole('alert').filter({
          hasText: 'The download has started',
        }),
      ).toBeVisible();
    });
  });

  test.describe('Virus scanning', () => {
    test('should display a notification', async ({
      dismissNotifications,
      expectNoA11yViolations,
      page,
    }) => {
      test.setTimeout(930000);

      const unreadNotifications = page.getByRole('button', {
        name: /Notifications \([1-5] unread\)/,
      });
      const notifications = page.getByRole('button', {
        name: /Notifications \([0-5] unread\)/,
      });

      await unreadNotifications.waitFor({
        state: 'visible',
        timeout: 900000,
      });
      await unreadNotifications.click();

      const virusNotification = page
        .getByText(
          'A file you have uploaded is infected with a virus and it has been removed',
        )
        .first();

      await virusNotification.waitFor({
        state: 'visible',
        timeout: 900000,
      });
      await expectNoA11yViolations(virusNotification);
      await dismissNotifications(notifications);
    });

    test('should remove virus from transaction', async ({
      accounts,
      companies,
      format,
      page,
    }) => {
      const companyName = companies[0].company.name;
      const transaction = accounts[8];

      await page.getByTestId(companyName).click();
      await page.getByRole('link', { name: 'Manage accounts' }).click();
      await page
        .getByRole('row')
        .filter({ hasText: transaction.description })
        .filter({ hasText: format('currency', transaction.amount) })
        .getByText(transaction.description, { exact: true })
        .click();

      await expect(
        page.getByRole('heading', { name: 'Edit transaction' }),
      ).toBeVisible();
      await expect(page.getByLabel('Select file to upload')).toBeVisible();
      await expect(page.getByText('PDF, JPG, PNG or GIF')).toBeVisible();
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
      const companyName = companies[0].company.name;

      await openCompanyDetails(companyName);
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
      companyCleanupRequired = false;
    });
  });
});
