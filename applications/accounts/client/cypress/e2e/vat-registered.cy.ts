import { DateTime } from 'luxon';
import type { TAccounts } from '../fixtures/models/account';
import type { TClients } from '../fixtures/models/client';
import type { TCompanies } from '../fixtures/models/company';
import type { TSettings } from '../fixtures/models/setting';

const overrides = {
  retries: 10,
};

describe('VAT registered', () => {
  let baseUrl: string;
  let timeout: number;

  beforeEach(() => {
    cy.getBaseUrl().then((value) => {
      baseUrl = value;
    });

    timeout = 20000;
  });

  describe('Register company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/dashboard/`);
    });

    it('should create a company', overrides, () => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const data = res[0];

        cy.a11yWithLogs();

        cy.findByRole('link', {
          name: 'Add a new company',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Add a new company',
        }).should('be.visible');

        cy.a11yWithLogs();

        cy.findByLabelText('Name*').should('be.visible').focus();

        cy.findByLabelText('Name*').type(data.company.name);

        cy.findByLabelText('Company number*').should('be.visible').focus();

        cy.findByLabelText('Company number*').type(data.company.companyNumber);

        cy.findByLabelText('Account number*').should('be.visible').focus();

        cy.findByLabelText('Account number*').type(
          data.company.bank.accountNumber,
        );

        cy.findByLabelText('Sort code*').should('be.visible').focus();

        cy.findByLabelText('Sort code*').type(data.company.bank.sortCode);

        cy.findByLabelText('Address line 1*').should('be.visible').focus();

        cy.findByLabelText('Address line 1*').type(data.company.address.line1);

        cy.findByLabelText('Address line 2').should('be.visible').focus();

        cy.findByLabelText('Address line 2').type(data.company.address.line2);

        cy.findByLabelText('Town*').should('be.visible').focus();

        cy.findByLabelText('Town*').type(data.company.address.line3);

        cy.findByLabelText('Postcode*').should('be.visible').focus();

        cy.findByLabelText('Postcode*').type(data.company.address.line5);

        cy.findByLabelText('Email address*').should('be.visible').focus();

        cy.findByLabelText('Email address*').type(data.company.contact.email);

        cy.findByLabelText('Telephone number*').should('be.visible').focus();

        cy.findByLabelText('Telephone number*').type(
          data.company.contact.telephone,
        );

        cy.findByRole('button', {
          name: 'Settings',
        }).safeClick();

        cy.findByLabelText('VAT registration number')
          .should('be.visible')
          .focus();

        cy.findByLabelText('VAT registration number').type(
          data.vat.registration,
        );

        cy.findByLabelText('Standard').check();

        cy.findByLabelText('Day').should('be.visible').focus();

        cy.findByLabelText('Day').select(data.yearEnd.day);

        cy.findByLabelText('Month').should('be.visible').focus();

        cy.findByLabelText('Month').select(data.yearEnd.month);

        cy.findByLabelText('Opening balance').should('be.visible').focus();

        cy.findByLabelText('Opening balance').clear();

        cy.findByLabelText('Opening balance').type(data.balance.balance);

        cy.findByLabelText('VAT owed').should('be.visible').focus();

        cy.findByLabelText('VAT owed').clear();

        cy.findByLabelText('VAT owed').type(data.balance.vat.owed);

        cy.findByLabelText('VAT paid').should('be.visible').focus();

        cy.findByLabelText('VAT paid').clear();

        cy.findByLabelText('VAT paid').type(data.balance.vat.paid);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: data.company.name,
        }).should('be.visible');
      });
    });
  });

  describe('Update company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/dashboard/`);
    });

    it('should update company details', () => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];
        const updated = res[2].company;

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.a11yWithLogs();

        cy.findByRole('link', {
          name: 'Manage company details',
        }).safeClick();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.a11yWithLogs();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .should('have.value', company.name);

        cy.findByLabelText('Company number*')
          .should('be.visible')
          .should('have.value', company.companyNumber);

        cy.findByLabelText('Account number*')
          .should('be.visible')
          .should('have.value', company.bank.accountNumber)
          .focus();

        cy.findByLabelText('Account number*').clear();

        cy.findByLabelText('Account number*').type(updated.bank.accountNumber);

        cy.format('sort code', company.bank.sortCode).then((value) => {
          cy.findByLabelText('Sort code*')
            .should('be.visible')
            .should('have.value', value)
            .focus();

          cy.findByLabelText('Sort code*').clear();

          cy.findByLabelText('Sort code*').type(updated.bank.sortCode);
        });

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .should('have.value', company.address.line1)
          .focus();

        cy.findByLabelText('Address line 1*').clear();

        cy.findByLabelText('Address line 1*').type(updated.address.line1);

        cy.findByLabelText('Address line 2')
          .should('be.visible')
          .should('have.value', company.address.line2);

        cy.findByLabelText('Address line 2').focus();

        cy.findByLabelText('Address line 2').clear();

        cy.findByLabelText('Town*')
          .should('be.visible')
          .should('have.value', company.address.line3);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .should('have.value', company.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .should('have.value', company.contact.email)
          .focus();

        cy.findByLabelText('Email address*').clear();

        cy.findByLabelText('Email address*').type(updated.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .should('have.value', company.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');
      });
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.findByRole('link', {
          name: 'Manage settings',
        }).safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: 'Settings',
        }).should('be.visible');
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/dashboard/`);
    });

    it('should update company settings', () => {
      cy.fixture<TSettings>('data/setting.json').then((res) => {
        cy.fixture<TCompanies>('data/company.json').then((companies) => {
          const settings = res[0];
          const company = companies[0];

          cy.a11yWithLogs();

          cy.findByRole('button', {
            name: 'Add a new category',
          }).click();

          cy.findAllByLabelText('Name').eq(5).should('be.visible').focus();

          cy.findAllByLabelText('Name').eq(5).type(settings.categories[0].name);

          cy.findByRole('button', {
            name: 'Add a new category',
          }).click();

          cy.findAllByLabelText('Name').eq(6).should('be.visible').focus();

          cy.findAllByLabelText('Name').eq(6).type(settings.categories[1].name);

          cy.findAllByLabelText('VAT rate').eq(6).should('be.visible').focus();

          cy.findAllByLabelText('VAT rate').eq(6).clear();

          cy.findAllByLabelText('VAT rate')
            .eq(6)
            .type(settings.categories[1].vatRate);

          cy.findByRole('button', {
            name: 'Add a new category',
          }).click();

          cy.findAllByLabelText('Name').eq(7).should('be.visible').focus();

          cy.findAllByLabelText('Name').eq(7).type(settings.categories[2].name);

          cy.findAllByLabelText('VAT rate').eq(7).should('be.visible').focus();

          cy.findAllByLabelText('VAT rate').eq(7).clear();

          cy.findAllByLabelText('VAT rate')
            .eq(7)
            .type(settings.categories[2].vatRate);

          cy.format('percentage', '20').then((value) => {
            cy.findByLabelText('VAT to pay')
              .should('be.visible')
              .should('have.value', value)
              .focus();

            cy.findByLabelText('VAT to pay').clear();

            cy.findByLabelText('VAT to pay').type(settings.vat.pay);
          });

          cy.format('VAT registration', company.vat.registration).then(
            (value) => {
              cy.findByLabelText('VAT registration number')
                .should('be.visible')
                .should('have.value', value);
            },
          );

          cy.findByLabelText('VAT registration number')
            .should('be.visible')
            .focus();

          cy.findByLabelText('VAT registration number').clear();

          cy.findByLabelText('VAT registration number').type(
            settings.vat.registration,
          );

          cy.findByLabelText('Standard').should('be.checked');

          cy.findByLabelText('Flat rate').check();

          cy.findByLabelText('Day')
            .should('be.visible')
            .should('have.value', company.yearEnd.day);

          cy.findByLabelText('Month')
            .should('be.visible')
            .should('have.value', company.yearEnd.month);

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.findByText('Dashboard').should('be.visible');
        });
      });
    });

    it('should remove expenses category', () => {
      cy.fixture<TSettings>('data/setting.json').then((res) => {
        const settings = res[0];

        cy.findAllByLabelText('Name')
          .eq(5)
          .should('be.visible')
          .should('have.value', settings.categories[0].name);

        cy.format('percentage', settings.categories[0].vatRate).then(
          (value) => {
            cy.findAllByLabelText('VAT rate')
              .eq(5)
              .should('be.visible')
              .should('have.value', value);
          },
        );

        cy.findAllByLabelText('Name')
          .eq(6)
          .should('be.visible')
          .should('have.value', settings.categories[1].name);

        cy.format('percentage', settings.categories[1].vatRate).then(
          (value) => {
            cy.findAllByLabelText('VAT rate')
              .eq(6)
              .should('be.visible')
              .should('have.value', value);
          },
        );

        cy.findAllByLabelText('Name')
          .eq(7)
          .should('be.visible')
          .should('have.value', settings.categories[2].name);

        cy.format('percentage', settings.categories[2].vatRate).then(
          (value) => {
            cy.findAllByLabelText('VAT rate')
              .eq(7)
              .should('be.visible')
              .should('have.value', value);
          },
        );

        cy.format('percentage', settings.vat.charge).then((value) => {
          cy.findByLabelText('VAT to charge')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.format('percentage', settings.vat.pay).then((value) => {
          cy.findByLabelText('VAT to pay')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.format('VAT registration', settings.vat.registration).then(
          (value) => {
            cy.findByLabelText('VAT registration number')
              .should('be.visible')
              .should('have.value', value);
          },
        );

        cy.findByLabelText('Flat rate').should('be.checked');

        cy.findAllByRole('button', {
          name: 'Remove',
        })
          .eq(0)
          .click();

        cy.findAllByRole('button', {
          name: 'Remove',
        })
          .eq(0)
          .click();

        cy.findAllByRole('button', {
          name: 'Remove',
        })
          .eq(0)
          .click();

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByText('Dashboard').should('be.visible');
      });
    });

    it('should re-add expense categories', () => {
      cy.fixture<TSettings>('data/setting.json').then((res) => {
        const settings = res[0];

        cy.findByRole('button', {
          name: 'Add a new category',
        }).click();

        cy.findAllByLabelText('Name').eq(5).should('be.visible').focus();

        cy.findAllByLabelText('Name').eq(5).type(settings.categories[0].name);

        cy.findByRole('button', {
          name: 'Add a new category',
        }).click();

        cy.findAllByLabelText('Name').eq(6).should('be.visible').focus();

        cy.findAllByLabelText('Name').eq(6).type(settings.categories[1].name);

        cy.findAllByLabelText('VAT rate').eq(6).should('be.visible').focus();

        cy.findAllByLabelText('VAT rate').eq(6).clear();

        cy.findAllByLabelText('VAT rate')
          .eq(6)
          .type(settings.categories[1].vatRate);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByText('Dashboard').should('be.visible');
      });
    });
  });

  describe('Clients', () => {
    beforeEach(() => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.findByRole('link', {
          name: 'Manage clients',
        }).safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');

        cy.url({
          timeout,
        }).should('include', `${baseUrl}/my-companies/clients/`);
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/clients/`);
    });

    it('should add client 1', overrides, () => {
      cy.fixture<TClients>('data/client.json').then((res) => {
        const client = res[0];

        cy.a11yWithLogs();

        cy.findByRole('link', {
          name: 'Add a new client',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Add a new client',
        }).should('be.visible');

        cy.a11yWithLogs();

        cy.findByLabelText('Name*').should('be.visible').focus();

        cy.findByLabelText('Name*').type(client.name);

        cy.findByLabelText('Address line 1*').should('be.visible').focus();

        cy.findByLabelText('Address line 1*').type(client.address.line1);

        cy.findByLabelText('Town*').should('be.visible').focus();

        cy.findByLabelText('Town*').type(client.address.line3);

        cy.findByLabelText('Postcode*').should('be.visible').focus();

        cy.findByLabelText('Postcode*').type(client.address.line5);

        cy.findByLabelText('Email address*').should('be.visible').focus();

        cy.findByLabelText('Email address*').type(client.contact.email);

        cy.findByLabelText('Telephone number*').should('be.visible').focus();

        cy.findByLabelText('Telephone number*').type(client.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });
  });

  describe('Accounts', () => {
    beforeEach(() => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.findByRole('link', {
          name: 'Manage accounts',
        }).safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findAllByRole('heading', {
          name: 'Accounts',
        })
          .eq(1)
          .should('be.visible');

        cy.url({
          timeout,
        }).should('include', `${baseUrl}/my-companies/accounts/`);
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/accounts/`);
    });

    it('should add a confirmed sale', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        cy.fixture<Blob>('upload/invoice.pdf').then((file) => {
          const transaction = res[0];

          cy.a11yWithLogs();

          cy.findByRole('link', {
            name: 'Record a new transaction',
          }).safeClick();

          cy.findByRole('heading', {
            name: 'Record transaction',
          }).should('be.visible');

          cy.a11yWithLogs();

          cy.findByLabelText('Sale').check();

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

          cy.findByLabelText('Supplier').should('be.visible').focus();

          cy.findByLabelText('Supplier').select(transaction.supplier);

          cy.findByLabelText('Description').should('be.visible').focus();

          cy.findByLabelText('Description').type(transaction.description);

          cy.findByLabelText('Confirmed').check();

          cy.findByLabelText('Amount').should('be.visible').focus();

          cy.findByLabelText('Amount').type(transaction.amount);

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.waitForToast();

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.findAllByRole('heading', {
            name: 'Accounts',
          })
            .eq(1)
            .should('be.visible');
        });
      });
    });

    it('should add a confirmed sale refund', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        const transaction = res[8];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Record transaction',
        }).should('be.visible');

        cy.findByLabelText('Sale').check();

        cy.findByLabelText('Supplier').should('be.visible').focus();

        cy.findByLabelText('Supplier').select(transaction.supplier);

        cy.findByLabelText('Description').should('be.visible').focus();

        cy.findByLabelText('Description').type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Yes').check();

        cy.findByLabelText('Amount').should('be.visible').focus();

        cy.findByLabelText('Amount').type(transaction.amount);

        cy.format('currency', transaction.vat).then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findAllByRole('heading', {
          name: 'Accounts',
        })
          .eq(1)
          .should('be.visible');
      });
    });

    it('should add a confirmed purchase', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        cy.fixture<Blob>('upload/invoice.pdf').then((file) => {
          const transaction = res[1];

          cy.findByRole('link', {
            name: 'Record a new transaction',
          }).safeClick();

          cy.findByLabelText('Purchase').check();

          cy.findByLabelText('Supplier').should('be.visible').focus();

          cy.findByLabelText('Supplier').type(transaction.supplier);

          cy.findByLabelText('Description').should('be.visible').focus();

          cy.findByLabelText('Description').type(transaction.description);

          cy.findByLabelText('Confirmed').check();

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

          cy.findByLabelText('Category').should('be.visible').focus();

          cy.findByLabelText('Category').select(transaction.category);

          cy.findByLabelText('Amount').should('be.visible').focus();

          cy.findByLabelText('Amount').type(transaction.amount);

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.waitForToast();

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.findAllByRole('heading', {
            name: 'Accounts',
          })
            .eq(1)
            .should('be.visible');
        });
      });
    });

    it('should add a confirmed zero VAT rate purchase', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        cy.fixture<Blob>('upload/invoice.pdf').then((file) => {
          const transaction = res[2];

          cy.findByRole('link', {
            name: 'Record a new transaction',
          }).safeClick();

          cy.findByLabelText('Purchase').check();

          cy.findByLabelText('Supplier').should('be.visible').focus();

          cy.findByLabelText('Supplier').type(transaction.supplier);

          cy.findByLabelText('Description').should('be.visible').focus();

          cy.findByLabelText('Description').type(transaction.description);

          cy.findByLabelText('Confirmed').check();

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

          cy.findByLabelText('Category').should('be.visible').focus();

          cy.findByLabelText('Category').select(transaction.category);

          cy.findByLabelText('Amount').should('be.visible').focus();

          cy.findByLabelText('Amount').type(transaction.amount);

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.waitForToast();

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.findAllByRole('heading', {
            name: 'Accounts',
          })
            .eq(1)
            .should('be.visible');
        });
      });
    });

    it('should show correct balance details', () => {
      cy.contains('Balance: £2290.40').should('be.visible');

      cy.contains('VAT owed: £332.50').should('be.visible');

      cy.contains('VAT paid: £26.27').should('be.visible');
    });

    it('should update a transaction', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        cy.fixture<Blob>('upload/invoice.pdf').then((file) => {
          const transaction = res[6];

          cy.findAllByTestId(`View ${transaction.supplier}`).eq(1).safeClick();

          cy.findByRole('heading', {
            name: 'View transaction',
          }).should('be.visible');

          cy.a11yWithLogs();

          cy.findByLabelText('Sale').should('have.prop', 'checked');

          cy.findByLabelText('Supplier')
            .should('be.visible')
            .should('have.value', transaction.supplier);

          cy.findByLabelText('Description')
            .should('be.visible')
            .should('have.value', transaction.description);

          cy.findByLabelText('Confirmed').should('have.prop', 'checked');

          cy.findByLabelText('Amount').should('be.visible').focus();

          cy.findByLabelText('Amount').clear();

          cy.findByLabelText('Amount').type(transaction.amount);

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.findByRole('button', {
            name: 'Delete file',
          }).safeClick();

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

          cy.waitForToast(40000);

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.contains('Balance: £2790.40').should('be.visible');

          cy.contains('VAT owed: £410.00').should('be.visible');
        });
      });
    });

    it('should delete a confirmed transaction', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        const transaction = res[0];

        cy.findAllByTestId(`Delete ${transaction.supplier}`).eq(1).click();

        cy.a11yWithLogs();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus();

        cy.findByLabelText(
          `Please type ${transaction.supplier} to confirm`,
        ).type(transaction.supplier);

        cy.findAllByRole('button', {
          name: 'Delete',
        })
          .last()
          .safeClick();

        cy.contains('Balance: £290.40').should('be.visible');

        cy.contains('VAT owed: £22.50').should('be.visible');
      });
    });

    it('should make a VAT payment', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        const transaction = res[7];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier').should('be.visible').focus();

        cy.findByLabelText('Supplier').type(transaction.supplier);

        cy.findByLabelText('Description').should('be.visible').focus();

        cy.findByLabelText('Description').type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Category').should('be.visible').focus();

        cy.findByLabelText('Category').select(transaction.category);

        cy.findByLabelText('Amount').should('be.visible').focus();

        cy.findByLabelText('Amount').type(transaction.amount);

        cy.format('currency', transaction.vat).then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findAllByRole('heading', {
          name: 'Accounts',
        })
          .eq(1)
          .should('be.visible');
      });
    });

    it('should make a VAT refund', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        const transaction = res[10];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier').should('be.visible').focus();

        cy.findByLabelText('Supplier').type(transaction.supplier);

        cy.findByLabelText('Description').should('be.visible').focus();

        cy.findByLabelText('Description').type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Yes').check();

        cy.findByLabelText('Category').should('be.visible').focus();

        cy.findByLabelText('Category').select(transaction.category);

        cy.findByLabelText('Amount').should('be.visible').focus();

        cy.findByLabelText('Amount').type(transaction.amount);

        cy.format('currency', transaction.vat).then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findAllByRole('heading', {
          name: 'Accounts',
        })
          .eq(1)
          .should('be.visible');
      });
    });

    it('should show correct balance details after VAT is paid', () => {
      cy.contains('Balance: £267.90').should('be.visible');

      cy.contains('VAT owed: £0.00').should('be.visible');
    });

    it('should download attachment', () => {
      cy.fixture<TAccounts>('data/account.json').then((res) => {
        const transaction = res[1];

        cy.findByTestId(`View ${transaction.supplier}`).safeClick();

        cy.findByRole('heading', {
          name: 'View transaction',
        }).should('be.visible');

        cy.findByRole('button', {
          name: 'View file',
        }).click();

        cy.findByLabelText('Download').click();

        cy.get('div:contains("The download has started")').should('be.visible');
      });
    });
  });

  describe('Exports', () => {
    beforeEach(() => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: company.name,
        }).should('be.visible');

        cy.findByRole('link', {
          name: 'Manage reports',
        }).safeClick();

        cy.findByTestId('connected-content').waitForElement();

        cy.findByRole('heading', {
          name: 'Reports',
        }).should('be.visible');

        cy.url({
          timeout,
        }).should('include', `${baseUrl}/my-companies/reports/`);
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/reports/`);
    });

    it('should generate and download report', () => {
      cy.findByRole('link', {
        name: 'Create new report',
      }).safeClick();

      cy.findByTestId('connected-content').waitForElement();

      const now = DateTime.now();
      const { year } = now;
      const financialYear = (
        now > DateTime.local(year, 4, 5) ? year : year - 1
      ).toString();

      cy.findByLabelText('Financial year').should('be.visible').focus();

      cy.findByLabelText('Financial year').select(financialYear);

      cy.findByLabelText('Confirmed').check();

      cy.findByRole('button', {
        name: 'Create report',
      }).safeClick();

      cy.findByTestId('connected-content').waitForElement();

      cy.waitUntil(() => Cypress.$('button:contains("Download")').length > 0, {
        timeout,
      });

      cy.findByRole('button', {
        name: 'Download',
      }).click();

      cy.get('div:contains("The download has started")').should('be.visible');
    });
  });

  describe('Notifications', () => {
    it('should display a notification', () => {
      cy.findByRole('button', {
        name: /Notifications \([0-3] unread\)/,
      }).click();

      cy.findAllByText('Your report is ready to download')
        .first()
        .should('be.visible');

      cy.findByRole('button', {
        name: /Notifications \([0-3] unread\)/,
      }).click();

      cy.findByRole('button', {
        name: 'Notifications (0 unread)',
      }).should('be.visible');
    });
  });

  describe('Delete company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('eq', `${baseUrl}/my-companies`);
    });

    it('should remove company', overrides, () => {
      cy.fixture<TCompanies>('data/company.json').then((res) => {
        const { company } = res[0];

        cy.findByTestId(company.name).should('be.visible').safeClick();

        cy.findByRole('link', {
          name: 'Manage company details',
        }).safeClick();

        cy.findByRole('button', {
          name: `Delete ${company.name}`,
        }).click();

        cy.findByLabelText(`Please type ${company.name} to confirm`)
          .should('be.visible')
          .focus();

        cy.findByLabelText(`Please type ${company.name} to confirm`).type(
          company.name,
        );

        cy.findByRole('button', {
          name: 'Delete',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'My companies',
        }).should('be.visible');
      });
    });
  });
});
