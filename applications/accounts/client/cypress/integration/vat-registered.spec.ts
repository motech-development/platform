/* eslint-disable jest/valid-expect-in-promise */
describe('VAT registered', () => {
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
        const data = res[0];

        cy.a11yWithLogs();

        cy.findByRole('link', {
          name: 'Add a new company',
        })
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'Add a new company')
          .should('be.visible');

        cy.a11yWithLogs();

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

        cy.findByLabelText('Address line 2')
          .should('be.visible')
          .focus()
          .type(data.company.address.line2);

        cy.findByLabelText('Town*')
          .should('be.visible')
          .focus()
          .type(data.company.address.line3);

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

        cy.findByLabelText('VAT registration number')
          .should('be.visible')
          .focus()
          .type(data.vat.registration);

        cy.findByLabelText('Standard').check();

        cy.findByLabelText('Day')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.day);

        cy.findByLabelText('Month')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.month);

        cy.findByLabelText('Opening balance')
          .should('be.visible')
          .focus()
          .clear()
          .type(data.balance.balance);

        cy.findByLabelText('VAT owed')
          .should('be.visible')
          .focus()
          .clear()
          .type(data.balance.vat.owed);

        cy.findByLabelText('VAT paid')
          .should('be.visible')
          .focus()
          .clear()
          .type(data.balance.vat.paid);

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

  describe('Update company', () => {
    afterEach(() => {
      cy.url({
        timeout,
      }).should('include', 'http://localhost:3000/my-companies/dashboard/');
    });

    it('should update company details', () => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[0];
        const updated = res[2].company;

        cy.findByTestId(company.name).should('be.visible').click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');

        cy.a11yWithLogs();

        cy.findByRole('link', {
          name: 'Manage company details',
        })
          .should('be.visible')
          .click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');

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
          .focus()
          .clear()
          .type(updated.bank.accountNumber);

        cy.format('sort code', company.bank.sortCode).then((value) => {
          cy.findByLabelText('Sort code*')
            .should('be.visible')
            .should('have.value', value)
            .focus()
            .clear()
            .type(updated.bank.sortCode);
        });

        cy.findByLabelText('Address line 1*')
          .should('be.visible')
          .should('have.value', company.address.line1)
          .focus()
          .clear()
          .type(updated.address.line1);

        cy.findByLabelText('Address line 2')
          .should('be.visible')
          .should('have.value', company.address.line2)
          .focus()
          .clear();

        cy.findByLabelText('Town*')
          .should('be.visible')
          .should('have.value', company.address.line3);

        cy.findByLabelText('Postcode*')
          .should('be.visible')
          .should('have.value', company.address.line5);

        cy.findByLabelText('Email address*')
          .should('be.visible')
          .should('have.value', company.contact.email)
          .focus()
          .clear()
          .type(updated.contact.email);

        cy.findByLabelText('Telephone number*')
          .should('be.visible')
          .should('have.value', company.contact.telephone);

        cy.findByRole('button', {
          name: 'Save',
        })
          .should('be.visible')
          .click();

        cy.get('h2').should('contain.text', company.name).should('be.visible');
      });
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[0];

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

    it('should update company settings', () => {
      cy.fixture('data/settings.json').then((res) => {
        cy.fixture('data/company.json').then((companies) => {
          const settings = res[0];
          const company = companies[0];

          cy.a11yWithLogs();

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

          cy.findByRole('button', {
            name: 'Add a new category',
          })
            .should('be.visible')
            .click();

          cy.findAllByLabelText('Name')
            .eq(7)
            .should('be.visible')
            .focus()
            .type(settings.categories[2].name);

          cy.findAllByLabelText('VAT rate')
            .eq(7)
            .should('be.visible')
            .focus()
            .clear()
            .type(settings.categories[2].vatRate);

          cy.format('percentage', '20').then((value) => {
            cy.findByLabelText('VAT to pay')
              .should('be.visible')
              .should('have.value', value)
              .focus()
              .clear()
              .type(settings.vat.pay);
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
            .focus()
            .clear()
            .type(settings.vat.registration);

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
          })
            .should('be.visible')
            .click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should remove expenses category', () => {
      cy.fixture('data/settings.json').then((res) => {
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
          .should('be.visible')
          .click();

        cy.findAllByRole('button', {
          name: 'Remove',
        })
          .eq(0)
          .should('be.visible')
          .click();

        cy.findAllByRole('button', {
          name: 'Remove',
        })
          .eq(0)
          .should('be.visible')
          .click();

        cy.findByRole('button', {
          name: 'Save',
        })
          .should('be.visible')
          .click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });

    it('should re-add expense categories', () => {
      cy.fixture('data/settings.json').then((res) => {
        const settings = res[0];

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
        const { company } = res[0];

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

        cy.a11yWithLogs();

        cy.get('a:contains("Add a new client")').should('be.visible').click();

        cy.get('h2')
          .should('contain.text', 'Add a new client')
          .should('be.visible');

        cy.a11yWithLogs();

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
  });

  describe('Accounts', () => {
    beforeEach(() => {
      cy.fixture('data/company.json').then((res) => {
        const { company } = res[0];

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
        cy.fixture('upload/invoice.pdf').then((file) => {
          const transaction = res[0];

          cy.a11yWithLogs();

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Record transaction')
            .should('be.visible');

          cy.a11yWithLogs();

          cy.findByLabelText('Sale').check();

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

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

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('div:contains("File has been uploaded")', {
            timeout,
          }).should('not.exist');

          cy.get('button[type="submit"]').should('be.visible').click();

          cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
        });
      });
    });

    it('should add a confirmed sale refund', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[8];

        cy.get('a:contains("Record a new transaction")')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'Record transaction')
          .should('be.visible');

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

        cy.findByLabelText('Yes').check();

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

    it('should add a confirmed purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        cy.fixture('upload/invoice.pdf').then((file) => {
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

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

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

          cy.get('div:contains("File has been uploaded")', {
            timeout,
          }).should('not.exist');

          cy.get('button[type="submit"]').should('be.visible').click();

          cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
        });
      });
    });

    it('should add a confirmed zero VAT rate purchase', () => {
      cy.fixture('data/account.json').then((res) => {
        cy.fixture('upload/invoice.pdf').then((file) => {
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

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

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

          cy.get('div:contains("File has been uploaded")', {
            timeout,
          }).should('not.exist');

          cy.get('button[type="submit"]').should('be.visible').click();

          cy.get('h2').should('contain.text', 'Accounts').should('be.visible');
        });
      });
    });

    it('should show correct balance details', () => {
      cy.contains('Balance: £2290.40').should('be.visible');

      cy.contains('VAT owed: £332.50').should('be.visible');

      cy.contains('VAT paid: £26.27').should('be.visible');
    });

    it('should update a transaction', () => {
      cy.fixture('data/account.json').then((res) => {
        cy.fixture('upload/invoice.pdf').then((file) => {
          const transaction = res[6];

          cy.get('a:contains("View")').eq(4).should('be.visible').click();

          cy.get('h2')
            .should('contain.text', 'View transaction')
            .should('be.visible');

          cy.a11yWithLogs();

          cy.get('input[name="transaction"][type="hidden"]').should(
            'have.value',
            transaction.type,
          );

          cy.findByLabelText('Supplier')
            .should('be.visible')
            .should('have.value', transaction.supplier);

          cy.findByLabelText('Description')
            .should('be.visible')
            .should('have.value', transaction.description);

          cy.findByLabelText('Confirmed').should('have.prop', 'checked');

          cy.findByLabelText('Amount')
            .should('be.visible')
            .focus()
            .clear()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then((value) => {
            cy.findByLabelText('VAT')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button:contains("Delete file")').should('be.visible').click();

          cy.get('div:contains("File has been deleted")', {
            timeout,
          }).should('not.exist');

          cy.findByLabelText('Select file to upload').attachFile({
            fileContent: file,
            fileName: 'invoice.pdf',
            mimeType: 'application/pdf',
          });

          cy.findByLabelText('Select file to upload').should('not.exist');

          cy.get('div:contains("File has been uploaded")', {
            timeout,
          }).should('not.exist');

          cy.get('button[type="submit"]').should('be.visible').click();

          cy.contains('Balance: £2790.40').should('be.visible');

          cy.contains('VAT owed: £410.00').should('be.visible');
        });
      });
    });

    it('should delete a confirmed transaction', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[0];

        cy.get('button:contains("Delete")').eq(3).should('be.visible').click();

        cy.a11yWithLogs();

        cy.findByLabelText(`Please type ${transaction.supplier} to confirm`)
          .should('be.visible')
          .focus()
          .type(transaction.supplier);

        cy.get('button[type="submit"]').should('be.visible').click();

        cy.contains('Balance: £290.40').should('be.visible');

        cy.contains('VAT owed: £22.50').should('be.visible');
      });
    });

    it('should make a VAT payment', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[7];

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

    it('should make a VAT refund', () => {
      cy.fixture('data/account.json').then((res) => {
        const transaction = res[10];

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

    it('should show correct balance details after VAT is paid', () => {
      cy.contains('Balance: £267.90').should('be.visible');

      cy.contains('VAT owed: £0.00').should('be.visible');
    });

    it('should download attachment', () => {
      cy.get('a:contains("View")').eq(4).should('be.visible').click();

      cy.get('h2')
        .should('contain.text', 'View transaction')
        .should('be.visible');

      cy.get('button:contains("Download file")').should('be.visible').click();

      cy.get('div:contains("The download has started")').should('be.visible');
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
        const { company } = res[0];

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

        cy.get('button[type="submit"]').eq(1).should('be.visible').click();

        cy.get('h2')
          .should('contain.text', 'My companies')
          .should('be.visible');
      });
    });
  });
});
