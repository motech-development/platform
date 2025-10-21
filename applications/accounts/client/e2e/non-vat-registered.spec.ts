import { DateTime } from 'luxon';
import { expect, test } from './fixtures';

test.describe('Non-VAT registered', () => {
  const timeout = 20000;

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-companies');

    await expect(
      page.getByRole('heading', { name: 'My companies' }),
    ).toBeVisible();
  });

  test.describe('Register company', () => {
    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/dashboard\/[0-9a-f-]+$/);
    });

    test('should create a company', async ({ companies, page }) => {
      const company = companies[1];

      await page.getByRole('link', { name: 'Add a new company' }).click();

      await page.getByLabel('Name*').fill(company.company.name);
      await page
        .getByLabel('Company number*')
        .fill(company.company.companyNumber);
      await page
        .getByLabel('Account number*')
        .fill(company.company.bank.accountNumber);
      await page.getByLabel('Sort code*').fill(company.company.bank.sortCode);
      await page
        .getByLabel('Address line 1*')
        .fill(company.company.address.line1);
      await page.getByLabel('Town*').fill(company.company.address.line3);
      await page.getByLabel('County').fill(company.company.address.line4 ?? '');
      await page.getByLabel('Postcode*').fill(company.company.address.line5);
      await page
        .getByLabel('Email address*')
        .fill(company.company.contact.email);
      await page
        .getByLabel('Telephone number*')
        .fill(company.company.contact.telephone);

      await page.getByRole('button', { name: 'Settings' }).click();

      await page.getByLabel('None').check();

      await page.getByLabel('Day').selectOption(company.yearEnd.day);
      await page.getByLabel('Month').selectOption(company.yearEnd.month);

      await page.getByLabel('VAT to charge').fill(company.vat.charge);
      await page.getByLabel('VAT to pay').fill(company.vat.pay);

      await page.getByRole('button', { name: 'Save' }).click();

      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[1];

      await page.getByTestId(company.company.name).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      await page.getByRole('link', { name: 'Manage settings' }).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', {
          exact: true,
          name: 'Settings',
        }),
      ).toBeVisible();
    });

    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/dashboard\/[0-9a-f-]+$/);
    });

    test('should have correct default settings', async ({
      companies,
      format,
      page,
      settings,
    }) => {
      const company = companies[1];
      const setting = settings[1];

      await expect(page.getByLabel('VAT to charge')).toHaveValue(
        format('percentage', setting.vat.charge),
      );
      await expect(page.getByLabel('VAT to pay')).toHaveValue(
        format('percentage', setting.vat.pay),
      );
      await expect(page.getByLabel('VAT registration number')).toHaveValue(
        company.vat.registration,
      );
      await expect(page.getByLabel('None')).toBeChecked();

      await expect(page.getByLabel('Day')).toHaveValue(company.yearEnd.day);
      await page.getByLabel('Day').selectOption(setting.yearEnd.day);

      await expect(page.getByLabel('Month')).toHaveValue(company.yearEnd.month);
      await page.getByLabel('Month').selectOption(setting.yearEnd.month);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Dashboard')).toBeVisible();
    });

    test('should update company settings', async ({ page, settings }) => {
      const setting = settings[1];

      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(5).fill(setting.categories[0].name);

      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(6).fill(setting.categories[1].name);

      await page
        .getByLabel('VAT rate')
        .nth(6)
        .fill(setting.categories[1].vatRate);

      await expect(page.getByLabel('Day')).toHaveValue(setting.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveValue(setting.yearEnd.month);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Dashboard')).toBeVisible();
    });
  });

  test.describe('Clients', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[1];

      await page.getByTestId(company.company.name).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      await page.getByRole('link', { name: 'Manage clients' }).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
      await expect(page).toHaveURL(/my-companies\/clients\/[0-9a-f-]+$/);
    });

    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/clients\/[0-9a-f-]+$/);
    });

    test('should add client 1', async ({ clients, page }) => {
      const client = clients[0];

      await page.getByRole('link', { name: 'Add a new client' }).click();

      await page.getByLabel('Name*').fill(client.name);
      await page.getByLabel('Address line 1*').fill(client.address.line1);
      await page.getByLabel('Town*').fill(client.address.line3);
      await page.getByLabel('Postcode*').fill(client.address.line5);
      await page.getByLabel('Email address*').fill(client.contact.email);
      await page.getByLabel('Telephone number*').fill(client.contact.telephone);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
    });

    test('should add client 2', async ({ clients, page }) => {
      const client = clients[1];

      await page.getByRole('link', { name: 'Add a new client' }).click();

      await page.getByLabel('Name*').fill(client.name);
      await page.getByLabel('Address line 1*').fill(client.address.line1);
      await page.getByLabel('Address line 2').fill(client.address.line2);
      await page.getByLabel('Town*').fill(client.address.line3);
      await page.getByLabel('County').fill(client.address.line4);
      await page.getByLabel('Postcode*').fill(client.address.line5);
      await page.getByLabel('Email address*').fill(client.contact.email);
      await page.getByLabel('Telephone number*').fill(client.contact.telephone);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
    });

    test('should add client 3', async ({ clients, page }) => {
      const client = clients[2];

      await page.getByRole('link', { name: 'Add a new client' }).click();

      await page.getByLabel('Name*').fill(client.name);
      await page.getByLabel('Address line 1*').fill(client.address.line1);
      await page.getByLabel('Town*').fill(client.address.line3);
      await page.getByLabel('County').fill(client.address.line4 ?? '');
      await page.getByLabel('Postcode*').fill(client.address.line5);
      await page.getByLabel('Email address*').fill(client.contact.email);
      await page.getByLabel('Telephone number*').fill(client.contact.telephone);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
    });

    test('should update client 2', async ({ clients, page }) => {
      const client = clients[1];
      const updated = clients[3];

      await page
        .getByRole('link', { name: 'Manage client details' })
        .nth(1)
        .click();

      await expect(page.getByLabel('Name*')).toHaveValue(client.name);
      await page.getByLabel('Name*').fill(updated.name);

      await expect(page.getByLabel('Address line 1*')).toHaveValue(
        client.address.line1,
      );
      await expect(page.getByLabel('Address line 2')).toHaveValue(
        client.address.line2,
      );
      await expect(page.getByLabel('Town*')).toHaveValue(client.address.line3);
      await expect(page.getByLabel('County')).toHaveValue(
        client.address.line4 ?? '',
      );
      await expect(page.getByLabel('Postcode*')).toHaveValue(
        client.address.line5,
      );
      await expect(page.getByLabel('Email address*')).toHaveValue(
        client.contact.email,
      );
      await expect(page.getByLabel('Telephone number*')).toHaveValue(
        client.contact.telephone,
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
    });

    test('should delete client 3', async ({ clients, page }) => {
      const client = clients[2];

      await page
        .getByRole('link', { name: 'Manage client details' })
        .first()
        .click();

      await page.getByRole('button', { name: `Delete ${client.name}` }).click();
      await page
        .getByLabel(`Please type ${client.name} to confirm`)
        .fill(client.name);
      await page
        .getByRole('button', {
          exact: true,
          name: 'Delete',
        })
        .click();

      await expect(
        page.getByRole('heading', { name: 'Clients' }),
      ).toBeVisible();
    });
  });

  test.describe('Accounts', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[1];

      await page.getByTestId(company.company.name).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      await page.getByRole('link', { name: 'Manage accounts' }).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
      await expect(page).toHaveURL(/my-companies\/accounts\/[0-9a-f-]+$/);
    });

    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(
        /my-companies\/accounts\/[0-9a-f-]+(?:\/.*)?$/,
      );
    });

    test('should add a confirmed sale', async ({ accounts, format, page }) => {
      const transaction = accounts[0];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Sale').check();
      await page.getByLabel('Supplier').selectOption(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(format('currency', '0'));

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should add a confirmed purchase', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[1];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();
      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should add a confirmed purchase refund', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[9];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();
      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Yes').check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should add a confirmed zero VAT rate purchase', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[2];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();
      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(format('currency', '0'));

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should show correct balance details', async ({ page }) => {
      await expect(page.getByText('Balance: £1810.40')).toBeVisible();
      await expect(page.getByText('VAT owed: £0.00')).toBeVisible();
      await expect(page.getByText('VAT paid: £12.94')).toBeVisible();
    });

    test('should delete a confirmed transaction', async ({
      a11yWithLogs,
      accounts,
      page,
    }) => {
      const transaction = accounts[2];

      await page.getByTestId(`Delete ${transaction.supplier}`).click();

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page
        .getByLabel(`Please type ${transaction.supplier} to confirm`)
        .fill(transaction.supplier);
      await page
        .getByRole('button', {
          exact: true,
          name: 'Delete',
        })
        .last()
        .click();

      await expect(page.getByText('Balance: £1922.40')).toBeVisible();
    });

    test('should add a pending sale', async ({ accounts, format, page }) => {
      const transaction = accounts[3];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Sale').check();
      await page.getByLabel('Supplier').selectOption(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Pending').check();
      await page.getByLabel('Yes').nth(1).check();
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(format('currency', '0'));

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Pending transactions' }),
      ).toBeVisible();
    });

    test('should add a pending purchase', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[4];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();
      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Pending').check();
      await page.getByLabel('No').nth(1).check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Pending transactions' }),
      ).toBeVisible();
    });

    test('should add a pending zero VAT rate purchase', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[5];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();

      await page.getByTestId('date-picker').click();
      const day = DateTime.now().plus({ day: 1 }).day.toString();
      await page.getByTestId(`calendar-day-${day}`).click();

      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Pending').check();
      await page.getByLabel('No').nth(1).check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(format('currency', '0'));

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Pending transactions' }),
      ).toBeVisible();
    });

    test('should delete a pending transaction', async ({ accounts, page }) => {
      const transaction = accounts[5];

      await page
        .getByRole('link', { name: 'View pending transactions' })
        .click();
      await expect(
        page.getByRole('heading', { name: 'Pending transactions' }),
      ).toBeVisible();

      await page.getByTestId(`Delete ${transaction.supplier}`).click();
      await page
        .getByLabel(`Please type ${transaction.supplier} to confirm`)
        .fill(transaction.supplier);
      await page
        .getByRole('button', {
          exact: true,
          name: 'Delete',
        })
        .last()
        .click();

      await expect(
        page.getByTestId(`Delete ${transaction.supplier}`),
      ).toHaveCount(0);
    });

    test('should have published the scheduled transaction', async ({
      page,
    }) => {
      test.setTimeout(630000);

      await expect(async () => {
        await page.reload();

        await expect(page.getByText('Balance: £3922.40')).toBeVisible();
        await expect(page.getByText('VAT owed: £0.00')).toBeVisible();
        await expect(page.getByText('VAT paid: £12.94')).toBeVisible();
      }).toPass({
        timeout: 600000,
      });
    });
  });

  test.describe('Exports', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[1];

      await page.getByTestId(company.company.name).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      await page.getByRole('link', { name: 'Manage reports' }).click();
      await page.getByTestId('connected-content').waitFor();
      await expect(
        page.getByRole('heading', { name: 'Reports' }),
      ).toBeVisible();
      await expect(page).toHaveURL(/my-companies\/reports\/[0-9a-f-]+$/);
    });

    test('should download a report path check', async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/reports\/[0-9a-f-]+$/);
    });

    test('should generate a report', async ({ page }) => {
      await page.getByRole('link', { name: 'Create new report' }).click();
      await page.getByTestId('connected-content').waitFor();

      const financialYear = DateTime.now().year.toString();
      await page.getByLabel('Financial year').selectOption(financialYear);
      await page.getByLabel('Confirmed').check();

      await page.getByRole('button', { name: 'Create report' }).click();
      await page.getByTestId('connected-content').waitFor();

      await page.waitForSelector('button:has-text("Download")', { timeout });
      await page.getByRole('button', { name: 'Download' }).click();
      await expect(
        page.getByRole('alert').filter({
          hasText: 'The download has started',
        }),
      ).toBeVisible();
    });

    test('should download a report', async ({ page }) => {
      await page.getByRole('button', { name: 'Download' }).click();
      await expect(
        page.getByRole('alert').filter({
          hasText: 'The download has started',
        }),
      ).toBeVisible();
    });
  });

  test.describe('Notifications', () => {
    test('should display a notification', async ({ page }) => {
      await page
        .getByRole('button', { name: /Notifications \([0-3] unread\)/ })
        .click();

      await expect(
        page.getByText('A scheduled transaction has been published').first(),
      ).toBeVisible();
      await expect(
        page.getByText('Your report is ready to download').first(),
      ).toBeVisible();

      await page
        .getByRole('button', { name: /Notifications \([0-3] unread\)/ })
        .click();
      await expect(
        page.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible();
    });
  });

  test.describe('Delete company', () => {
    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL('/my-companies');
    });

    test('should remove company', async ({ companies, page }) => {
      const company = companies[1];

      await page.getByTestId(company.company.name).click();
      await page.getByRole('link', { name: 'Manage company details' }).click();

      await page
        .getByRole('button', { name: `Delete ${company.company.name}` })
        .click();
      await page
        .getByLabel(`Please type ${company.company.name} to confirm`)
        .fill(company.company.name);
      await page
        .getByRole('button', {
          exact: true,
          name: 'Delete',
        })
        .click();

      await expect(
        page.getByRole('heading', { name: 'My companies' }),
      ).toBeVisible();
    });
  });
});
