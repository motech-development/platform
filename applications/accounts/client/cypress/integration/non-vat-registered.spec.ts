/* eslint-disable jest/valid-expect-in-promise */
describe('Non-VAT registered', () => {
  let timeout: number;

  beforeEach(() => {
    timeout = 20000;
  });

  describe('Register company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', 'http://localhost:3000/my-companies/dashboard/');
    });

    it('should create a company', () => {
      cy.fixture('data/company.json').then((res) => {
        const data = res[1];

        cy.findByRole('link', {
          name: 'Add a new company',
        })
          .should('be.visible')
          .click();

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
        })
          .should('be.visible')
          .click();

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
        })
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', data.company.name)
          .should('be.visible');
      });
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

        cy.findByTestId(company.name).should('be.visible').click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');

        cy.findByRole('link', {
          name: 'Manage settings',
        })
          .should('be.visible')
          .click();

        cy.get('h2').should('contain.text', 'Settings').should('be.visible');
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', 'http://localhost:3000/my-companies/dashboard/');
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
          })
            .should('be.visible')
            .click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should update company settings', () => {
      cy.fixture('data/settings.json').then((res) => {
        const settings = res[1];

        cy.findByRole('button', {
          name: 'Add a new category',
        })
          .should('be.visible')
          .click();

        cy.findAllByLabelText('Name')
          .eq(5)
          .should('be.visible')
          .focus()
          .type(settings.categories[0].name);

        cy.findByRole('button', {
          name: 'Add a new category',
        })
          .should('be.visible')
          .click();

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
        })
          .should('be.visible')
          .click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });
  });

  describe('Clients', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

        cy.findByTestId(company.name).should('be.visible').click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');

        cy.get('a:contains("Manage clients")').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');

        cy.url({
          timeout,
        }).should('include', 'http://localhost:3000/my-companies/clients/');
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', 'http://localhost:3000/my-companies/clients/');
    });

    it('should add client 1', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[0];

        cy.get('a:contains("Add a new client")').should('be.visible').click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');
      });
    });

    it('should add client 2', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[1];

        cy.get('a:contains("Add a new client")').should('be.visible').click();

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

        cy.get('input[id="address.line4"]')
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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');
      });
    });

    it('should add client 3', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[2];

        cy.get('a:contains("Add a new client")').should('be.visible').click();

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

        cy.get('input[id="address.line4"]')
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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');
      });
    });

    it('should update client 2', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[1];
        const updated = res[3];

        cy.get('a:contains("Manage client details")')
          .eq(1)
          .should('be.visible')
          .click();

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

        cy.get('input[id="address.line4"]')
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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');
      });
    });

    it('should delete client 3', () => {
      cy.fixture('data/client.json').then((res) => {
        const client = res[2];

        cy.get('a:contains("Manage client details")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get(`button:contains("Delete ${client.name}")`)
          .should('be.visible')
          .click();

        cy.get('input[id="confirmation"]')
          .should('be.visible')
          .focus()
          .type(client.name);

        cy.get('button[type="submit"]').eq(1).should('be.visible').click();

        cy.get('h2').should('contain.text', 'Clients').should('be.visible');
      });
    });
  });

  describe('Accounts', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

        cy.findByTestId(company.name).should('be.visible').click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');

        cy.get('a:contains("Manage accounts")').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Accounts').should('be.visible');

        cy.url({
          timeout,
        }).should('include', 'http://localhost:3000/my-companies/accounts/');
      });
    });

    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', 'http://localhost:3000/my-companies/accounts/');
    });

    it('should add a confirmed sale', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[0];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
      });
    });

    it('should add a confirmed purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[1];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
      });
    });

    it('should add a confirmed purchase refund', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[9];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
      });
    });

    it('should add a confirmed zero VAT rate purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[2];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
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

        cy.get('button:contains("Delete")').eq(0).should('be.visible').click();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.contains('Balance: £1922.40').should('be.visible');
      });
    });

    it('should add a pending sale', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[3];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2')
          .should('contain.text', 'Pending transactions')
          .should('be.visible');
      });
    });

    it('should add a pending purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[4];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2')
          .should('contain.text', 'Pending transactions')
          .should('be.visible');
      });
    });

    it('should add a pending zero VAT rate purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[5];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('h2')
          .should('contain.text', 'Pending transactions')
          .should('be.visible');
      });
    });

    it('should delete a pending transaction', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[5];

        cy.get('a:contains("View pending transactions")')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'Pending transactions')
          .should('be.visible');

        cy.a11yWithLogs();

        cy.get('button:contains("Delete")').eq(1).should('be.visible').click();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.get('button:contains("Delete")').should('have.length', 1);
      });
    });

    it('should have published the scheduled transaction', () => {
      cy.contains('Balance: £3922.40').should('be.visible');

      cy.contains('VAT owed: £0.00').should('be.visible');

      cy.contains('VAT paid: £12.94').should('be.visible');
    });
  });

  describe('Notifications', () => {
    it('should display a notification', () => {
      cy.get('button[aria-label="Notifications (1 unread)"]')
        .should('be.visible')
        .click();

      cy.get('p')
        .eq(1)
        .should('contain.text', 'A scheduled transaction has been published')
        .should('be.visible');

      cy.get('button[aria-label="Notifications (1 unread)"]')
        .should('be.visible')
        .click();

      cy.get('button[aria-label="Notifications (0 unread)"]').should(
        'be.visible',
      );
    });
  });

  describe('Delete company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('eq', 'http://localhost:3000/my-companies');
    });

    it('should remove company', () => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[1];

        cy.findByTestId(company.name).should('be.visible').click();

        cy.get('a:contains("Manage company details")')
          .should('be.visible')
          .click();

        cy.get(`button:contains("Delete ${company.name}")`)
          .should('be.visible')
          .click();

        cy.get('input[id="confirmation"]')
          .should('be.visible')
          .focus()
          .type(company.name);

        cy.get('button[type="submit"]').should('be.visible').eq(1).click();

        cy.get('h2')
          .should('contain.text', 'My companies')
          .should('be.visible');
      });
    });
  });
});
