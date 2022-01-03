import { DateTime } from 'luxon';

/* eslint-disable jest/valid-expect-in-promise */
describe('Non-VAT registered', () => {
  let baseUrl: string | null;
  let timeout: number;

  beforeEach(() => {
    ({ baseUrl } = Cypress.config());
    timeout = 20000;
  });

  describe('Register company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', `${baseUrl}/my-companies/dashboard/`);
    });

    it('should create a company', () => {
      cy.fixture('data/company.json').then((res) => {
        const data = res[1];

        cy.findByRole('link', {
          name: 'Add a new company',
        }).safeClick();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .focus()
          .type(data.company.name);

        cy.findByLabelText('Company number*')
          .should('be.visible')
          .focus()
          .type(data.company.companyNumber);

        cy.findByLabelText('Account number*')
          .should('be.visible')
          .focus()
          .type(data.company.bank.accountNumber);

        cy.findByLabelText('Sort code*')
          .should('be.visible')
          .focus()
          .type(data.company.bank.sortCode);

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .focus()
          .type(data.company.address.line1);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .focus()
          .type(data.company.address.line3);

        cy.findByLabelText('County')
          .should('be.visible')
          .focus()
          .type(data.company.address.line4);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .focus()
          .type(data.company.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .focus()
          .type(data.company.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .focus()
          .type(data.company.contact.telephone);

        cy.findByRole('button', {
          name: 'Settings',
        }).safeClick();

        cy.findByLabelText('None').check();

        cy.findByLabelText('Day')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.day);

        cy.findByLabelText('Month')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.month);

        cy.findByLabelText('VAT to charge')
          .should('be.visible')
          .focus()
          .clear()
          .type(data.vat.charge);

        cy.findByLabelText('VAT to pay')
          .should('be.visible')
          .focus()
          .clear()
          .type(data.vat.pay);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: data.company.name,
        }).should('be.visible');
      });
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

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

    it('should have correct default settings', () => {
      cy.fixture('data/settings.json').then((res) => {
        cy.fixture('data/company.json').then((companies) => {
          const company = companies[1];
          const settings = res[1];

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

          cy.findByLabelText('VAT registration number')
            .should('be.visible')
            .should('have.value', company.vat.registration);

          cy.findByLabelText('None').should('be.checked');

          cy.findByLabelText('Day')
            .should('be.visible')
            .should('have.value', company.yearEnd.day);

          cy.findByLabelText('Day')
            .should('be.visible')
            .focus()
            .select(settings.yearEnd.day);

          cy.findByLabelText('Month')
            .should('be.visible')
            .should('have.value', company.yearEnd.month);

          cy.findByLabelText('Month')
            .should('be.visible')
            .focus()
            .select(settings.yearEnd.month);

          cy.findByRole('button', {
            name: 'Save',
          }).safeClick();

          cy.findByText('Dashboard').should('be.visible');
        });
      });
    });

    it('should update company settings', () => {
      cy.fixture('data/settings.json').then((res) => {
        const settings = res[1];

        cy.findByRole('button', {
          name: 'Add a new category',
        }).click();

        cy.findAllByLabelText('Name')
          .eq(5)
          .should('be.visible')
          .focus()
          .type(settings.categories[0].name);

        cy.findByRole('button', {
          name: 'Add a new category',
        }).click();

        cy.findAllByLabelText('Name')
          .eq(6)
          .should('be.visible')
          .focus()
          .type(settings.categories[1].name);

        cy.findAllByLabelText('VAT rate')
          .eq(6)
          .should('be.visible')
          .focus()
          .clear()
          .type(settings.categories[1].vatRate);

        cy.findByLabelText('Day')
          .should('be.visible')
          .should('have.value', settings.yearEnd.day);

        cy.findByLabelText('Month')
          .should('be.visible')
          .should('have.value', settings.yearEnd.month);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByText('Dashboard').should('be.visible');
      });
    });
  });

  describe('Clients', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

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

    it('should add client 1', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[0];

        cy.findByRole('link', {
          name: 'Add a new client',
        }).safeClick();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .focus()
          .type(client.name);

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .focus()
          .type(client.address.line1);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .focus()
          .type(client.address.line3);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .focus()
          .type(client.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .focus()
          .type(client.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .focus()
          .type(client.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });

    it('should add client 2', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[1];

        cy.findByRole('link', {
          name: 'Add a new client',
        }).safeClick();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .focus()
          .type(client.name);

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .focus()
          .type(client.address.line1);

        cy.findByLabelText('Address line 2')
          .should('be.visible')
          .focus()
          .type(client.address.line2);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .focus()
          .type(client.address.line3);

        cy.findByLabelText('County')
          .should('be.visible')
          .focus()
          .type(client.address.line4);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .focus()
          .type(client.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .focus()
          .type(client.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .focus()
          .type(client.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });

    it('should add client 3', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[2];

        cy.findByRole('link', {
          name: 'Add a new client',
        }).safeClick();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .focus()
          .type(client.name);

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .focus()
          .type(client.address.line1);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .focus()
          .type(client.address.line3);

        cy.findByLabelText('County')
          .should('be.visible')
          .focus()
          .type(client.address.line4);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .focus()
          .type(client.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .focus()
          .type(client.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .focus()
          .type(client.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });

    it('should update client 2', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[1];
        const updated = res[3];

        cy.findAllByRole('link', {
          name: 'Manage client details',
        })
          .eq(1)
          .safeClick();

        cy.findByLabelText('Name*')
          .should('be.visible')
          .should('have.value', client.name)
          .focus()
          .clear()
          .type(updated.name);

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .should('have.value', client.address.line1);

        cy.findByLabelText('Address line 2')
          .should('be.visible')
          .should('have.value', client.address.line2);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .should('have.value', client.address.line3);

        cy.findByLabelText('County')
          .should('be.visible')
          .should('have.value', client.address.line4);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .should('have.value', client.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .should('have.value', client.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .should('have.value', client.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });

    it('should delete client 3', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[2];

        cy.findAllByRole('link', {
          name: 'Manage client details',
        })
          .eq(0)
          .safeClick();

        cy.findByRole('button', {
          name: `Delete ${client.name}`,
        }).click();

        cy.findByLabelText(`Please type ${client.name} to confirm`)
          .should('be.visible')
          .focus()
          .type(client.name);

        cy.findAllByRole('button', {
          name: 'Delete',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Clients',
        }).should('be.visible');
      });
    });
  });

  describe('Accounts', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

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
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[0];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Sale').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .select(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

        cy.format('currency', '0').then((value) => {
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
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[1];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Category')
          .should('be.visible')
          .focus()
          .select(transaction.category);

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

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

    it('should add a confirmed purchase refund', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[9];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Yes').check();

        cy.findByLabelText('Category')
          .should('be.visible')
          .focus()
          .select(transaction.category);

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

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

    it('should add a confirmed zero VAT rate purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[2];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Confirmed').check();

        cy.findByLabelText('Category')
          .should('be.visible')
          .focus()
          .select(transaction.category);

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

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

    it('should show correct balance details', () => {
      cy.contains('Balance: £1810.40').should('be.visible');

      cy.contains('VAT owed: £0.00').should('be.visible');

      cy.contains('VAT paid: £12.94').should('be.visible');
    });

    it('should delete a confirmed transaction', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[2];

        cy.findByTestId(`Delete ${transaction.supplier}`).click();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findAllByRole('button', {
          name: 'Delete',
        })
          .last()
          .safeClick();

        cy.contains('Balance: £1922.40').should('be.visible');
      });
    });

    it('should add a pending sale', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[3];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Sale').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .select(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Pending').check();

        cy.findAllByLabelText('Yes').eq(1).check();

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

        cy.format('currency', '0').then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Pending transactions',
        }).should('be.visible');
      });
    });

    it('should add a pending purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[4];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Pending').check();

        cy.findAllByLabelText('No').eq(1).check();

        cy.findByLabelText('Category')
          .should('be.visible')
          .focus()
          .select(transaction.category);

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

        cy.format('currency', transaction.vat).then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Pending transactions',
        }).should('be.visible');
      });
    });

    it('should add a pending zero VAT rate purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[5];

        cy.findByRole('link', {
          name: 'Record a new transaction',
        }).safeClick();

        cy.findByLabelText('Purchase').check();

        cy.findByLabelText('Supplier')
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findByLabelText('Description')
          .should('be.visible')
          .focus()
          .type(transaction.description);

        cy.findByLabelText('Pending').check();

        cy.findAllByLabelText('No').eq(1).check();

        cy.findByLabelText('Category')
          .should('be.visible')
          .focus()
          .select(transaction.category);

        cy.findByLabelText('Amount')
          .should('be.visible')
          .focus()
          .type(transaction.amount);

        cy.format('currency', transaction.vat).then((value) => {
          cy.findByLabelText('VAT')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.findByRole('button', {
          name: 'Save',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Pending transactions',
        }).should('be.visible');
      });
    });

    it('should delete a pending transaction', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[5];

        cy.findByRole('link', {
          name: 'View pending transactions',
        }).safeClick();

        cy.findByRole('heading', {
          name: 'Pending transactions',
        }).should('be.visible');

        cy.a11yWithLogs();

        cy.findByTestId(`Delete ${transaction.supplier}`).click();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.findAllByRole('button', {
          name: 'Delete',
        })
          .last()
          .safeClick();

        cy.findAllByRole('button', {
          name: 'Delete',
        }).should('have.length', 1);
      });
    });

    it('should have published the scheduled transaction', () => {
      cy.contains('Balance: £3922.40').should('be.visible');

      cy.contains('VAT owed: £0.00').should('be.visible');

      cy.contains('VAT paid: £12.94').should('be.visible');
    });
  });

  describe('Exports', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

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

    it('should generate a report', () => {
      cy.findByRole('link', {
        name: 'Create new report',
      }).safeClick();

      cy.findByTestId('connected-content').waitForElement();

      const financialYear = DateTime.now().year.toString();

      cy.findByLabelText('Financial year')
        .should('be.visible')
        .focus()
        .select(financialYear);

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

    it('should download a report', () => {
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

      cy.findAllByText('A scheduled transaction has been published')
        .first()
        .should('be.visible');

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

    it('should remove company', () => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

        cy.findByTestId(company.name).safeClick();

        cy.findByRole('link', {
          name: 'Manage company details',
        }).safeClick();

        cy.findByRole('button', {
          name: `Delete ${company.name}`,
        }).click();

        cy.findByLabelText(`Please type ${company.name} to confirm`)
          .should('be.visible')
          .focus()
          .type(company.name);

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
