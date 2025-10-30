import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { DateTime } from 'luxon';
import { expect, test } from './fixtures';

test.describe('VAT registered', () => {
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

    test('should create a company', async ({
      a11yWithLogs,
      companies,
      page,
    }) => {
      const company = companies[0];

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page.getByRole('link', { name: 'Add a new company' }).click();

      await expect(
        page.getByRole('heading', { name: 'Add a new company' }),
      ).toBeVisible();

      const violations2 = await a11yWithLogs();
      expect(violations2).toHaveLength(0);

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
      await page
        .getByLabel('Address line 2')
        .fill(company.company.address.line2);
      await page.getByLabel('Town*').fill(company.company.address.line3);
      await page.getByLabel('Postcode*').fill(company.company.address.line5);
      await page
        .getByLabel('Email address*')
        .fill(company.company.contact.email);
      await page
        .getByLabel('Telephone number*')
        .fill(company.company.contact.telephone);

      await page.getByRole('button', { name: 'Settings' }).click();

      await page
        .getByLabel('VAT registration number')
        .fill(company.vat.registration);
      await page.getByLabel('Standard').check();

      await page.getByLabel('Day').selectOption(company.yearEnd.day);
      await page.getByLabel('Month').selectOption(company.yearEnd.month);

      await page.getByLabel('Opening balance').fill(company.balance.balance);
      await page.getByLabel('VAT owed').fill(company.balance.vat.owed);
      await page.getByLabel('VAT paid').fill(company.balance.vat.paid);

      await page.getByRole('button', { name: 'Save' }).click();

      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();
    });
  });

  test.describe('Update company', () => {
    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/dashboard\/[0-9a-f-]+$/);
    });

    test('should update company details', async ({
      a11yWithLogs,
      companies,
      format,
      page,
    }) => {
      const company = companies[0];
      const updated = companies[2].company;

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page.getByTestId(company.company.name).click();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      await page.getByRole('link', { name: 'Manage company details' }).click();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();

      const violations2 = await a11yWithLogs();
      expect(violations2).toHaveLength(0);

      await expect(page.getByLabel('Name*')).toHaveValue(company.company.name);
      await expect(page.getByLabel('Company number*')).toHaveValue(
        company.company.companyNumber,
      );
      await expect(page.getByLabel('Account number*')).toHaveValue(
        company.company.bank.accountNumber,
      );
      await expect(page.getByLabel('Sort code*')).toHaveValue(
        format('sort code', company.company.bank.sortCode),
      );
      await expect(page.getByLabel('Address line 1*')).toHaveValue(
        company.company.address.line1,
      );
      await expect(page.getByLabel('Address line 2')).toHaveValue(
        company.company.address.line2,
      );
      await expect(page.getByLabel('Town*')).toHaveValue(
        company.company.address.line3,
      );
      await expect(page.getByLabel('Postcode*')).toHaveValue(
        company.company.address.line5,
      );
      await expect(page.getByLabel('Email address*')).toHaveValue(
        company.company.contact.email,
      );
      await expect(page.getByLabel('Telephone number*')).toHaveValue(
        company.company.contact.telephone,
      );

      await page.getByLabel('Account number*').fill(updated.bank.accountNumber);
      await page.getByLabel('Sort code*').fill(updated.bank.sortCode);
      await page.getByLabel('Address line 1*').fill(updated.address.line1);
      await page.getByLabel('Address line 2').clear();
      await page.getByLabel('Email address*').fill(updated.contact.email);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: company.company.name }),
      ).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[0];

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

    test('should update company settings', async ({
      a11yWithLogs,
      companies,
      format,
      page,
      settings,
    }) => {
      const company = companies[0];
      const setting = settings[0];

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      // Add first category
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(5).fill(setting.categories[0].name);

      // Add second category
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(6).fill(setting.categories[1].name);
      await page
        .getByLabel('VAT rate')
        .nth(6)
        .fill(setting.categories[1].vatRate);

      // Add third category
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(7).fill(setting.categories[2].name);
      await page
        .getByLabel('VAT rate')
        .nth(7)
        .fill(setting.categories[2].vatRate);

      // Update VAT to pay
      await expect(page.getByLabel('VAT to pay')).toHaveValue(
        format('percentage', '20'),
      );
      await page.getByLabel('VAT to pay').fill(setting.vat.pay);

      // Update VAT registration number
      await expect(page.getByLabel('VAT registration number')).toHaveValue(
        format('VAT registration', company.vat.registration),
      );
      await page
        .getByLabel('VAT registration number')
        .fill(setting.vat.registration);

      // Change to flat rate
      await expect(page.getByLabel('Standard')).toBeChecked();
      await page.getByLabel('Flat rate').check();

      // Verify year end dates
      await expect(page.getByLabel('Day')).toHaveValue(company.yearEnd.day);
      await expect(page.getByLabel('Month')).toHaveValue(company.yearEnd.month);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Dashboard')).toBeVisible();
    });

    test('should remove expenses category', async ({
      format,
      page,
      settings,
    }) => {
      const setting = settings[0];

      // Verify categories exist
      await expect(page.getByLabel('Name').nth(5)).toHaveValue(
        setting.categories[0].name,
      );
      await expect(page.getByLabel('VAT rate').nth(5)).toHaveValue(
        format('percentage', setting.categories[0].vatRate),
      );

      await expect(page.getByLabel('Name').nth(6)).toHaveValue(
        setting.categories[1].name,
      );
      await expect(page.getByLabel('VAT rate').nth(6)).toHaveValue(
        format('percentage', setting.categories[1].vatRate),
      );

      await expect(page.getByLabel('Name').nth(7)).toHaveValue(
        setting.categories[2].name,
      );
      await expect(page.getByLabel('VAT rate').nth(7)).toHaveValue(
        format('percentage', setting.categories[2].vatRate),
      );

      // Verify VAT settings
      await expect(page.getByLabel('VAT to charge')).toHaveValue(
        format('percentage', setting.vat.charge),
      );
      await expect(page.getByLabel('VAT to pay')).toHaveValue(
        format('percentage', setting.vat.pay),
      );
      await expect(page.getByLabel('VAT registration number')).toHaveValue(
        format('VAT registration', setting.vat.registration),
      );
      await expect(page.getByLabel('Flat rate')).toBeChecked();

      // Remove all categories
      await page.getByRole('button', { name: 'Remove' }).nth(0).click();
      await page.getByRole('button', { name: 'Remove' }).nth(0).click();
      await page.getByRole('button', { name: 'Remove' }).nth(0).click();

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Dashboard')).toBeVisible();
    });

    test('should re-add expense categories', async ({ page, settings }) => {
      const setting = settings[0];

      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(5).fill('Expenses');

      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('Name').nth(6).fill('Travel');

      await page
        .getByLabel('VAT rate')
        .nth(6)
        .fill(setting.categories[1].vatRate);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Dashboard')).toBeVisible();
    });
  });

  test.describe('Clients', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[0];

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

    test('should add client 1', async ({ a11yWithLogs, clients, page }) => {
      const client = clients[0];

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page.getByRole('link', { name: 'Add a new client' }).click();

      const violations2 = await a11yWithLogs();
      expect(violations2).toHaveLength(0);

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
  });

  test.describe('Accounts', () => {
    test.beforeAll(async () => {
      const eicarPath = join(
        __dirname,
        'fixtures',
        'upload',
        'eicar.txt',
      );
      const eicarContent =
        'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

      await writeFile(eicarPath, eicarContent);
    });

    test.afterAll(async () => {
      const eicarPath = join(
        __dirname,
        'fixtures',
        'upload',
        'eicar.txt',
      );

      try {
        await unlink(eicarPath);
      } catch {
        // File may already be deleted by AV or not exist
      }
    });

    test.beforeEach(async ({ companies, page }) => {
      const company = companies[0];

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

    test('should add a confirmed sale', async ({
      a11yWithLogs,
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[0];

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      const violations2 = await a11yWithLogs();
      expect(violations2).toHaveLength(0);

      await page.getByLabel('Sale').check();

      // Upload invoice file first
      const fileInput = page.getByLabel('Select file to upload');
      await fileInput.setInputFiles('e2e/fixtures/upload/invoice.pdf');
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);

      await page.getByLabel('Supplier').selectOption(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should add a confirmed sale refund', async ({
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[8];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Sale').check();
      await page.getByLabel('Supplier').selectOption(transaction.supplier);
      await page.getByLabel('Description').fill(transaction.description);
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Yes').check();
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should update a refund', async ({ accounts, format, page }) => {
      const transaction = accounts[8];

      await page.getByTestId(`View ${transaction.supplier}`).nth(2).click();

      await expect(
        page.getByRole('heading', { name: 'View transaction' }),
      ).toBeVisible();

      await expect(page.getByLabel('Sale')).toBeChecked();
      await expect(page.getByLabel('Supplier')).toHaveValue(
        transaction.supplier,
      );
      await expect(page.getByLabel('Description')).toHaveValue(
        transaction.description,
      );
      await expect(page.getByLabel('Confirmed')).toBeChecked();
      await expect(page.getByLabel('Yes')).toBeChecked();

      await page.getByLabel('Description').fill('Updated refund description');

      await page.getByRole('button', { name: 'Save' }).click();

      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should delete a refund', async ({ accounts, page }) => {
      const transaction = accounts[8];

      await page.getByTestId(`Delete ${transaction.supplier}`).nth(2).click();

      await page
        .getByLabel(`Please type ${transaction.supplier} to confirm`)
        .fill(transaction.supplier);
      await page.getByRole('button', { name: 'Delete' }).last().click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
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

      // Upload invoice file
      const fileInput = page.getByLabel('Select file to upload');
      await fileInput.setInputFiles('e2e/fixtures/upload/invoice.pdf');
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);

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

      // Upload invoice file
      const fileInput = page.getByLabel('Select file to upload');
      await fileInput.setInputFiles('e2e/fixtures/upload/invoice.pdf');
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
      );

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();
    });

    test('should show correct balance details', async ({ page }) => {
      await expect(page.getByText('Balance: £2790.40')).toBeVisible();
      await expect(page.getByText('VAT owed: £410.00')).toBeVisible();
      await expect(page.getByText('VAT paid: £26.27')).toBeVisible();
    });

    test('should update a transaction', async ({
      a11yWithLogs,
      accounts,
      format,
      page,
    }) => {
      const transaction = accounts[6];

      await page.getByTestId(`View ${transaction.supplier}`).nth(1).click();

      await expect(
        page.getByRole('heading', { name: 'View transaction' }),
      ).toBeVisible();

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await expect(page.getByLabel('Sale')).toBeChecked();
      await expect(page.getByLabel('Supplier')).toHaveValue(
        transaction.supplier,
      );
      await expect(page.getByLabel('Description')).toHaveValue(
        transaction.description,
      );
      await expect(page.getByLabel('Confirmed')).toBeChecked();

      // Clear and re-fill amount field
      await page.getByLabel('Amount').fill(transaction.amount);

      await expect(page.getByLabel('VAT')).toHaveValue(
        format('currency', transaction.vat),
        { timeout: 10000 },
      );

      // Delete existing file
      await page.getByRole('button', { name: 'Delete file' }).click();

      // Upload new invoice file
      const fileInput = page.getByLabel('Select file to upload');
      await fileInput.setInputFiles('e2e/fixtures/upload/invoice.pdf');
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);

      await page.getByRole('button', { name: 'Save' }).click();

      // Check updated balance
      await expect(page.getByText('Balance: £2790.40')).toBeVisible();
      await expect(page.getByText('VAT owed: £410.00')).toBeVisible();
    });

    test('should delete a confirmed transaction', async ({
      a11yWithLogs,
      accounts,
      page,
    }) => {
      const transaction = accounts[0];

      await page.getByTestId(`Delete ${transaction.supplier}`).nth(1).click();

      const violations = await a11yWithLogs();
      expect(violations).toHaveLength(0);

      await page
        .getByLabel(`Please type ${transaction.supplier} to confirm`)
        .fill(transaction.supplier);
      await page.getByRole('button', { name: 'Delete' }).last().click();

      // Check that the delete modal is no longer visible
      await expect(page.getByRole('dialog')).not.toBeVisible();

      await expect(page.getByText('Balance: £790.40')).toBeVisible();
      await expect(page.getByText('VAT owed: £100.00')).toBeVisible();
    });

    test('should make a VAT payment', async ({ accounts, format, page }) => {
      const transaction = accounts[7];

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

    test('should make a VAT refund', async ({ accounts, format, page }) => {
      const transaction = accounts[10];

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

    test('should show correct balance details after VAT is paid', async ({
      page,
    }) => {
      await expect(page.getByText('Balance: £767.90')).toBeVisible();
      await expect(page.getByText('VAT owed: £0.00')).toBeVisible();
    });

    test('should download attachment', async ({ accounts, page }) => {
      const transaction = accounts[1];

      await page.getByTestId(`View ${transaction.supplier}`).click();

      await expect(
        page.getByRole('heading', { name: 'View transaction' }),
      ).toBeVisible();

      await page.getByRole('button', { name: 'View file' }).click();

      await page.getByLabel('Download').click();

      // Check that the PDF viewer is visible
      await expect(page.locator('.react-pdf__Document')).toBeVisible();

      await expect(
        page.getByRole('alert').filter({
          hasText: 'The download has started',
        }),
      ).toBeVisible();
    });

    test('should reject infected file upload', async ({ accounts, page }) => {
      test.setTimeout(300000);

      const transaction = accounts[2];

      await page
        .getByRole('link', { name: 'Record a new transaction' })
        .click();

      await page.getByLabel('Purchase').check();
      await page.getByLabel('Supplier').fill(transaction.supplier);
      await page.getByLabel('Description').fill('EICAR test upload');
      await page.getByLabel('Confirmed').check();
      await page.getByLabel('Category').selectOption(transaction.category);
      await page.getByLabel('Amount').fill(transaction.amount);

      const fileInput = page.getByLabel('Select file to upload');
      await fileInput.setInputFiles('e2e/fixtures/upload/eicar.txt');
      await expect(page.getByLabel('Select file to upload')).toHaveCount(0);

      await page.getByRole('button', { name: 'Save' }).click();

      await expect(
        page.getByRole('heading', { name: 'Accounts' }).nth(1),
      ).toBeVisible();

      await expect(async () => {
        await page
          .getByRole('button', { name: /Notifications \([0-9]+ unread\)/ })
          .click();

        await expect(
          page
            .getByText(
              'A file you have uploaded is infected with a virus and it has been removed',
            )
            .first(),
        ).toBeVisible();
      }).toPass({
        timeout: 240000,
      });
    });
  });

  test.describe('Exports', () => {
    test.beforeEach(async ({ companies, page }) => {
      const company = companies[0];

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

    test.afterEach(async ({ page }) => {
      await expect(page).toHaveURL(/my-companies\/reports\/[0-9a-f-]+$/);
    });

    test('should generate and download report', async ({ page }) => {
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
  });

  test.describe('Notifications', () => {
    test('should display a notification', async ({ page }) => {
      await page
        .getByRole('button', { name: /Notifications \([0-3] unread\)/ })
        .click();

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
      const company = companies[0];

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
