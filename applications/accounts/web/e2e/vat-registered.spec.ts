import clients from './fixtures/data/client.json' with { type: 'json' };
import { expect, test } from './test';

test.describe('VAT registered Accounts', () => {
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

  test('supports company management routes at desktop and compact sizes', async ({
    expectNoA11yViolations,
    focusWithKeyboard,
    gotoAuthenticatedPage,
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

    test.afterAll(async ({ baseURL, browser }) => {
      const page = await browser.newPage({
        baseURL,
        storageState: test.info().project.use.storageState,
      });

      try {
        await page.goto('/my-companies');
        await expect(
          page.getByRole('heading', { name: 'My companies' }),
        ).toBeVisible();
        const company = page.getByTestId(companyName);

        await expect(
          page.getByRole('status', { name: 'Loading companies' }),
        ).toHaveCount(0);

        if (await company.isVisible()) {
          await company.click();
          await page
            .getByRole('link', { name: /Manage company details/ })
            .click();
          await page.getByRole('button', { name: 'Delete company' }).click();
          await page
            .getByLabel(`Type ${companyName} to confirm`)
            .fill(companyName);
          await page
            .getByRole('button', { name: 'Permanently delete company' })
            .click();
          await expect(page.getByTestId(companyName)).toHaveCount(0);
        }
      } catch {
        // The final journey performs the same cleanup during a successful run.
      } finally {
        await page.close();
      }
    });

    test('should create a company', async ({
      expectNoA11yViolations,
      page,
    }) => {
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
      await page.getByLabel('Month').click();
      await page.getByRole('option', { exact: true, name: 'April' }).click();
      await page.getByLabel('Opening balance').fill('1000');
      await page.getByLabel('VAT owed').fill('100');
      await page.getByLabel('VAT paid').fill('10');
      await page.getByRole('button', { name: 'Save company' }).click();

      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should update company details', async ({
      expectNoA11yViolations,
      openCompanyDetails,
      page,
    }) => {
      await openCompanyDetails(companyName);
      await expectNoA11yViolations(page.getByLabel('Company name'));

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

    test('should update company settings', async ({
      addCompanyCategory,
      expectNoA11yViolations,
      openCompanySettings,
      page,
    }) => {
      await openCompanySettings(companyName);
      await expectNoA11yViolations(page.getByLabel('Registration number'));

      await addCompanyCategory('Accommodation', '20');
      await addCompanyCategory('Travel', '0');
      await addCompanyCategory('Sustenance', '20');

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

    test('should remove expenses category', async ({
      openCompanySettings,
      page,
    }) => {
      await openCompanySettings(companyName);
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

    test('should re-add expense categories', async ({
      addCompanyCategory,
      openCompanySettings,
      page,
    }) => {
      await openCompanySettings(companyName);

      await addCompanyCategory('Expenses', '20');
      await addCompanyCategory('Travel', '0');

      await page.getByRole('button', { name: 'Save settings' }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });

    test('should add client 1', async ({
      expectNoA11yViolations,
      focusWithKeyboard,
      openCompanyClients,
      page,
    }) => {
      const client = clients[0];

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

    test('should add client 2', async ({ openCompanyClients, page }) => {
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

    test('should add client 3', async ({ openCompanyClients, page }) => {
      const client = clients[2];

      await openCompanyClients(companyName);
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

    test('should update client 2', async ({ openCompanyClients, page }) => {
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

    test('should delete client 3', async ({ openCompanyClients, page }) => {
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

    test('should remove company', async ({ openCompanyDetails, page }) => {
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

  test.describe.serial('Virus scanning', () => {
    test('should add a confirmed sale with an infected attachment', async ({
      eicar,
      page,
    }) => {
      const eicarPath = await eicar();

      await page.getByTestId('VAT registered co.').click();
      await page.getByRole('link', { name: 'Manage accounts' }).click();
      await page.getByRole('link', { name: 'Record transaction' }).click();
      await page.getByRole('radio', { name: 'Sale' }).check();
      await page.getByLabel('Select file to upload').setInputFiles(eicarPath);
      await expect(page.getByRole('status')).toContainText(
        'PDF attached: eicar.pdf',
      );
      await page.getByRole('button', { name: /Supplier/ }).click();
      await page.getByRole('option', { name: 'Motech Development' }).click();
      await page.getByLabel('Description').fill('Virus notification journey');
      await page.getByRole('radio', { name: 'Confirmed' }).check();
      const amount = page.getByLabel('Amount');

      await amount.fill('1');
      await amount.press('Tab');
      const save = page.getByRole('button', { name: 'Save' });

      await expect(save).toBeEnabled();
      await save.click();
      await expect(page.getByText('Confirmed sale recorded')).toBeVisible();
    });

    test('should display the virus notification', async ({
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

    test('should remove the virus from the transaction', async ({ page }) => {
      await page.getByTestId('VAT registered co.').click();
      await page.getByRole('link', { name: 'Manage accounts' }).click();
      await page
        .getByText('Virus notification journey', { exact: true })
        .click();

      await expect(
        page.getByRole('heading', { name: 'Virus notification journey' }),
      ).toBeVisible();
      await expect(
        page.getByText('This confirmed sale has no source PDF.'),
      ).toBeVisible();
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
