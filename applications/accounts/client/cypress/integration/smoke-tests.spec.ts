describe('Smoke tests', () => {
  before(() => {
    cy.clearLocalStorageSnapshot().then(() => {
      cy.login().then(() => {
        cy.url().should('eq', 'http://localhost:3000/my-companies');

        cy.saveLocalStorage();
      });
    });
  });

  beforeEach(() => {
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }

    cy.restoreLocalStorage().then(() => {
      cy.visit('/my-companies').then(() => {
        cy.url().should('eq', 'http://localhost:3000/my-companies');

        cy.injectAxe();

        cy.wait(1000);
      });
    });
  });

  after(() => {
    cy.task('clearDownloads');
  });

  describe('Register company', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should create a VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const data = res[0];

        cy.checkA11y();

        cy.get('a:contains("Add a new company")').click();

        cy.wait(1000);

        cy.get('h2').should('contain.text', 'Add a new company');

        cy.wait(1000);

        cy.checkA11y();

        cy.get('input[id="company.name"]')
          .focus()
          .type(data.company.name);

        cy.get('input[id="company.companyNumber"]')
          .focus()
          .type(data.company.companyNumber);

        cy.get('input[id="company.bank.accountNumber"]')
          .focus()
          .type(data.company.bank.accountNumber);

        cy.get('input[id="company.bank.sortCode"]')
          .focus()
          .type(data.company.bank.sortCode);

        cy.get('input[id="company.address.line1"]')
          .focus()
          .type(data.company.address.line1);

        cy.get('input[id="company.address.line2"]')
          .focus()
          .type(data.company.address.line2);

        cy.get('input[id="company.address.line3"]')
          .focus()
          .type(data.company.address.line3);

        cy.get('input[id="company.address.line5"]')
          .focus()
          .type(data.company.address.line5);

        cy.get('input[id="company.contact.email"]')
          .focus()
          .type(data.company.contact.email);

        cy.get('input[id="company.contact.telephone"]')
          .focus()
          .type(data.company.contact.telephone);

        cy.get('button:contains("Settings")').click();

        cy.get('input[id="vat.registration"]')
          .focus()
          .type(data.vat.registration);

        cy.get('input[type="radio"]').check(data.vat.scheme);

        cy.get('select[id="yearEnd.day"]')
          .focus()
          .select(data.yearEnd.day);

        cy.get('select[id="yearEnd.month"]')
          .focus()
          .select(data.yearEnd.month);

        cy.get('input[id="balance.balance"]')
          .clear()
          .type(data.balance.balance);

        cy.get('input[id="balance.vat.owed"]')
          .clear()
          .type(data.balance.vat.owed);

        cy.get('input[id="balance.vat.paid"]')
          .clear()
          .type(data.balance.vat.paid);

        cy.get('button[type="submit"]').click();

        cy.get('h2').should('contain.text', data.company.name);
      });
    });

    it('should create a non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const data = res[1];

        cy.get('a:contains("Add a new company")').click();

        cy.wait(1000);

        cy.get('input[id="company.name"]')
          .focus()
          .type(data.company.name);

        cy.get('input[id="company.companyNumber"]')
          .focus()
          .type(data.company.companyNumber);

        cy.get('input[id="company.bank.accountNumber"]')
          .focus()
          .type(data.company.bank.accountNumber);

        cy.get('input[id="company.bank.sortCode"]')
          .focus()
          .type(data.company.bank.sortCode);

        cy.get('input[id="company.address.line1"]')
          .focus()
          .type(data.company.address.line1);

        cy.get('input[id="company.address.line3"]')
          .focus()
          .type(data.company.address.line3);

        cy.get('input[id="company.address.line4"]')
          .focus()
          .type(data.company.address.line4);

        cy.get('input[id="company.address.line5"]')
          .focus()
          .type(data.company.address.line5);

        cy.get('input[id="company.contact.email"]')
          .focus()
          .type(data.company.contact.email);

        cy.get('input[id="company.contact.telephone"]')
          .focus()
          .type(data.company.contact.telephone);

        cy.get('button:contains("Settings")').click();

        cy.get('input[type="radio"]').check(data.vat.scheme);

        cy.get('select[id="yearEnd.day"]')
          .focus()
          .select(data.yearEnd.day);

        cy.get('select[id="yearEnd.month"]')
          .focus()
          .select(data.yearEnd.month);

        cy.get('input[id="vat.charge"]')
          .clear()
          .type(data.vat.charge);

        cy.get('input[id="vat.pay"]')
          .clear()
          .type(data.vat.pay);

        cy.get('button[type="submit"]').click();

        cy.get('h2').should('contain.text', data.company.name);
      });
    });
  });

  describe('Update company', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should update company details', () => {
      cy.fixture('data/company.json').then(res => {
        const { company } = res[0];
        const updated = res[2].company;

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.checkA11y();

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get('h2').should('contain.text', company.name);

        cy.wait(1000);

        cy.checkA11y();

        cy.get('input[id="name"]').should('have.value', company.name);
        cy.get('input[id="companyNumber"]').should(
          'have.value',
          company.companyNumber,
        );

        cy.get('input[id="bank.accountNumber"]')
          .should('have.value', company.bank.accountNumber)
          .clear()
          .type(updated.bank.accountNumber);

        cy.format('sort code', company.bank.sortCode).then(value => {
          cy.get('input[id="bank.sortCode"]')
            .should('have.value', value)
            .clear()
            .type(updated.bank.sortCode);
        });

        cy.get('input[id="address.line1"]')
          .should('have.value', company.address.line1)
          .clear()
          .type(updated.address.line1);
        cy.get('input[id="address.line2"]')
          .should('have.value', company.address.line2)
          .clear();
        cy.get('input[id="address.line3"]').should(
          'have.value',
          company.address.line3,
        );
        cy.get('input[id="address.line5"]').should(
          'have.value',
          company.address.line5,
        );
        cy.get('input[id="contact.email"]')
          .should('have.value', company.contact.email)
          .clear()
          .type(updated.contact.email);
        cy.get('input[id="contact.telephone"]').should(
          'have.value',
          company.contact.telephone,
        );

        cy.get('button[type="submit"]').click();

        cy.get('h2').should('contain.text', company.name);
      });
    });
  });

  describe('Settings', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should update VAT registered company settings', () => {
      cy.fixture('data/settings.json').then(res => {
        cy.fixture('data/company.json').then(companies => {
          const settings = res[0];
          const company = companies[0];

          cy.get('a:contains("Select company")')
            .eq(1)
            .click();

          cy.wait(1000);

          cy.get('a:contains("Manage settings")').click();

          cy.wait(1000);

          cy.get('h2').should('contain.text', 'Settings');

          cy.wait(1000);

          cy.checkA11y();

          cy.get('button:contains("Add a new category")').click();

          cy.get('input[id="categories.5.name"]')
            .focus()
            .type(settings.categories[0].name);

          cy.get('button:contains("Add a new category")').click();

          cy.get('input[id="categories.6.name"]')
            .focus()
            .type(settings.categories[1].name);

          cy.get('input[id="categories.6.vatRate"]')
            .clear()
            .type(settings.categories[1].vatRate);

          cy.get('button:contains("Add a new category")').click();

          cy.get('input[id="categories.7.name"]')
            .focus()
            .type(settings.categories[2].name);

          cy.get('input[id="categories.7.vatRate"]')
            .clear()
            .type(settings.categories[2].vatRate);

          cy.format('percentage', '20').then(value => {
            cy.get('input[id="vat.pay"]')
              .should('have.value', value)
              .clear()
              .type(settings.vat.pay);
          });

          cy.format('VAT registration', company.vat.registration).then(
            value => {
              cy.get('input[id="vat.registration"]').should(
                'have.value',
                value,
              );
            },
          );

          cy.get('input[id="vat.registration"]')
            .clear()
            .type(settings.vat.registration);

          cy.get(`input[type="radio"][value="${company.vat.scheme}"]`).should(
            'be.checked',
          );

          cy.get('input[type="radio"]').check(settings.vat.scheme);

          cy.get('select[id="yearEnd.day"]').should(
            'have.value',
            company.yearEnd.day,
          );

          cy.get('select[id="yearEnd.month"]').should(
            'have.value',
            company.yearEnd.month,
          );

          cy.get('button[type="submit"]').click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should remove expenses category', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('input[id="categories.5.name"]').should(
          'have.value',
          settings.categories[0].name,
        );

        cy.format('percentage', settings.categories[0].vatRate).then(value => {
          cy.get('input[id="categories.5.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.get('input[id="categories.6.name"]').should(
          'have.value',
          settings.categories[1].name,
        );

        cy.format('percentage', settings.categories[1].vatRate).then(value => {
          cy.get('input[id="categories.6.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.get('input[id="categories.7.name"]').should(
          'have.value',
          settings.categories[2].name,
        );

        cy.format('percentage', settings.categories[2].vatRate).then(value => {
          cy.get('input[id="categories.7.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.format('percentage', settings.vat.charge).then(value => {
          cy.get('input[id="vat.charge"]').should('have.value', value);
        });

        cy.format('percentage', settings.vat.pay).then(value => {
          cy.get('input[id="vat.pay"]').should('have.value', value);
        });

        cy.format('VAT registration', settings.vat.registration).then(value => {
          cy.get('input[id="vat.registration"]').should('have.value', value);
        });

        cy.get(`input[type="radio"][value="${settings.vat.scheme}"]`).should(
          'be.checked',
        );

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button[type="submit"]').click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });

    it('should re-add expense categories', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.5.name"]')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.6.name"]')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.6.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('button[type="submit"]').click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });

    it('should have correct defaults for non-VAT registered company', () => {
      cy.fixture('data/settings.json').then(res => {
        cy.fixture('data/company.json').then(companies => {
          const company = companies[1];
          const settings = res[1];

          cy.get('a:contains("Select company")')
            .eq(0)
            .click();

          cy.wait(1000);

          cy.get('a:contains("Manage settings")').click();

          cy.wait(1000);

          cy.format('percentage', settings.vat.charge).then(value => {
            cy.get('input[id="vat.charge"]').should('have.value', value);
          });

          cy.format('percentage', settings.vat.pay).then(value => {
            cy.get('input[id="vat.pay"]').should('have.value', value);
          });

          cy.get('input[id="vat.registration"]').should(
            'have.value',
            company.vat.registration,
          );

          cy.get(`input[type="radio"][value="${company.vat.scheme}"]`).should(
            'be.checked',
          );

          cy.get('select[id="yearEnd.day"]').should(
            'have.value',
            company.yearEnd.day,
          );

          cy.get('select[id="yearEnd.day"]')
            .focus()
            .select(settings.yearEnd.day);

          cy.get('select[id="yearEnd.month"]').should(
            'have.value',
            company.yearEnd.month,
          );

          cy.get('select[id="yearEnd.month"]')
            .focus()
            .select(settings.yearEnd.month);

          cy.get('button[type="submit"]').click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should update non-VAT registered company settings', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.5.name"]')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.6.name"]')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.6.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('select[id="yearEnd.day"]').should(
          'have.value',
          settings.yearEnd.day,
        );

        cy.get('select[id="yearEnd.month"]').should(
          'have.value',
          settings.yearEnd.month,
        );

        cy.get('button[type="submit"]').click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });
  });

  describe('Clients', () => {
    afterEach(() => {
      cy.url().should('include', 'http://localhost:3000/my-companies/clients/');
    });

    describe('VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage clients")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );

        cy.wait(1000);
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          cy.checkA11y();

          const client = res[0];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('h2').should('contain.text', 'Add a new client');

          cy.wait(1000);

          cy.checkA11y();

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage clients")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );

        cy.wait(1000);
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[0];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });

      it('should add client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line2"]')
            .focus()
            .type(client.address.line2);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });

      it('should add client 3', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[2];

          cy.get('a:contains("Add a new client")').click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });

      it('should update client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];
          const updated = res[3];

          cy.get('a:contains("Manage client details")')
            .eq(1)
            .click();

          cy.wait(1000);

          cy.get('input[id="name"]')
            .should('have.value', client.name)
            .clear()
            .type(updated.name);
          cy.get('input[id="address.line1"]').should(
            'have.value',
            client.address.line1,
          );
          cy.get('input[id="address.line2"]').should(
            'have.value',
            client.address.line2,
          );
          cy.get('input[id="address.line3"]').should(
            'have.value',
            client.address.line3,
          );
          cy.get('input[id="address.line4"]').should(
            'have.value',
            client.address.line4,
          );
          cy.get('input[id="address.line5"]').should(
            'have.value',
            client.address.line5,
          );
          cy.get('input[id="contact.email"]').should(
            'have.value',
            client.contact.email,
          );
          cy.get('input[id="contact.telephone"]').should(
            'have.value',
            client.contact.telephone,
          );

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });

      it('should delete client 3', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[2];

          cy.get('a:contains("Manage client details")')
            .eq(0)
            .click();

          cy.wait(1000);

          cy.get(`button:contains("Delete ${client.name}")`).click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(client.name);

          cy.get('button[type="submit"]')
            .eq(1)
            .click();

          cy.get('h2').should('contain.text', 'Clients');
        });
      });
    });
  });

  describe('Accounts', () => {
    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/accounts/',
      );
    });

    describe('VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage accounts")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );

        cy.wait(1000);
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            cy.checkA11y();

            const transaction = res[0];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('h2').should('contain.text', 'Record transaction');

            cy.wait(1000);

            cy.checkA11y();

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="name"]')
              .focus()
              .select(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();

            cy.get('h2').should('contain.text', 'Accounts');
          });
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[1];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="name"]')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();

            cy.get('h2').should('contain.text', 'Accounts');
          });
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[2];

            cy.get('a:contains("Record a new transaction")').click();

            cy.wait(1000);

            cy.get('input[type="radio"]').check(transaction.type);

            cy.get('input[id="name"]')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]').check(transaction.status);

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();

            cy.get('h2').should('contain.text', 'Accounts');
          });
        });
      });

      it('should show correct balance details', () => {
        cy.contains('Balance: £2790.40').should('be.visible');

        cy.contains('VAT owed: £410.00').should('be.visible');

        cy.contains('VAT paid: £26.27').should('be.visible');
      });

      it('should update a transaction', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[6];

            cy.get('a:contains("View")')
              .eq(3)
              .click();

            cy.wait(1000);

            cy.get('h2').should('contain.text', 'View transaction');

            cy.wait(1000);

            cy.checkA11y();

            cy.get('input[name="transaction"][type="hidden"]').should(
              'have.value',
              transaction.type,
            );

            cy.get('select[id="name"]').should(
              'have.value',
              transaction.supplier,
            );

            cy.get('input[id="description"]').should(
              'have.value',
              transaction.description,
            );

            cy.get(`input[value="${transaction.status}"]`).should(
              'have.prop',
              'checked',
            );

            cy.get('input[id="amount"]')
              .clear()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]').should('have.value', value);
            });

            cy.get('button:contains("Delete file")').click();

            cy.get('div:contains("File has been deleted")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('input[id="attachment"]').upload({
              fileContent: file,
              fileName: 'invoice.pdf',
              mimeType: 'application/pdf',
            });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('div:contains("File has been uploaded")', {
              timeout: 10000,
            }).should('not.be.visible');

            cy.get('button[type="submit"]').click();

            cy.wait(1000);

            cy.contains('Balance: £3290.40').should('be.visible');

            cy.contains('VAT owed: £487.50').should('be.visible');
          });
        });
      });

      it('should delete a confirmed transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[0];

          cy.get('button:contains("Delete")')
            .eq(2)
            .click();

          cy.wait(1000);

          cy.get('h2').should('contain.text', 'Accounts');

          cy.wait(1000);

          cy.checkA11y();

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.contains('Balance: £790.40').should('be.visible');

          cy.contains('VAT owed: £100.00').should('be.visible');
        });
      });

      it('should make a VAT payment', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[7];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Accounts');
        });
      });

      it('should show correct balance details after VAT is paid', () => {
        cy.contains('Balance: £690.40').should('be.visible');

        cy.contains('VAT owed: £0').should('be.visible');
      });

      it('should download attachment', () => {
        cy.get('a:contains("View")')
          .eq(3)
          .click();

        cy.wait(1000);

        cy.get('h2').should('contain.text', 'View transaction');

        cy.get('button:contains("Download file")').click();

        cy.get('div:contains("The download has started")').should('be.visible');
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage accounts")').click();

        cy.wait(1000);

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );

        cy.wait(1000);
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[0];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('select[id="name"]')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Accounts');
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[1];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Accounts');
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[2];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Accounts');
        });
      });

      it('should show correct balance details', () => {
        cy.contains('Balance: £1790.40').should('be.visible');

        cy.contains('VAT owed: £0.00').should('be.visible');

        cy.contains('VAT paid: £16.27').should('be.visible');
      });

      it('should delete a confirmed transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[2];

          cy.get('button:contains("Delete")')
            .eq(0)
            .click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.contains('Balance: £1902.40').should('be.visible');
        });
      });

      it('should add a pending sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[3];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('select[id="name"]')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[type="radio"]').check(transaction.scheduled);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Pending transactions');
        });
      });

      it('should add a pending purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[4];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[type="radio"]').check(transaction.scheduled);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Pending transactions');
        });
      });

      it('should add a pending zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("Record a new transaction")').click();

          cy.wait(1000);

          cy.get('input[type="radio"]').check(transaction.type);

          cy.get('input[id="name"]')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]').check(transaction.status);

          cy.get('input[type="radio"]').check(transaction.scheduled);

          cy.get('select[id="category"]')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]').should('have.value', value);
          });

          cy.get('button[type="submit"]').click();

          cy.get('h2').should('contain.text', 'Pending transactions');
        });
      });

      it('should delete a pending transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("View pending transactions")').click();

          cy.wait(1000);

          cy.get('h2').should('contain.text', 'Pending transactions');

          cy.wait(1000);

          cy.checkA11y();

          cy.get('button:contains("Delete")')
            .eq(1)
            .click();

          cy.wait(1000);

          cy.get('input[id="confirmation"]')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]').click();

          cy.get('button:contains("Delete")').should('have.length', 1);
        });
      });

      it('should have published the scheduled transaction', () => {
        cy.contains('Balance: £3902.40').should('be.visible');

        cy.contains('VAT owed: £0.00').should('be.visible');

        cy.contains('VAT paid: £16.27').should('be.visible');
      });
    });
  });

  describe('Delete company', () => {
    afterEach(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');
    });

    it('should remove VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const { company } = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get(`button:contains("Delete ${company.name}")`).click();

        cy.wait(1000);

        cy.get('input[id="confirmation"]')
          .focus()
          .type(company.name);

        cy.get('button[type="submit"]')
          .eq(1)
          .click();

        cy.get('h2').should('contain.text', 'My companies');
      });
    });

    it('should remove non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const { company } = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get(`button:contains("Delete ${company.name}")`).click();

        cy.wait(1000);

        cy.get('input[id="confirmation"]')
          .focus()
          .type(company.name);

        cy.get('button[type="submit"]')
          .eq(1)
          .click();

        cy.get('h2').should('contain.text', 'My companies');
      });
    });
  });
});
