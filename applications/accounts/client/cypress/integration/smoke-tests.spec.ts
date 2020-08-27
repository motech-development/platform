describe('Smoke tests', () => {
  let timeout: number;

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

        cy.get('h2')
          .should('contain.text', 'My companies')
          .should('be.visible');
      });
    });

    timeout = 20000;
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

        cy.get('a:contains("Add a new company")')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'Add a new company')
          .should('be.visible');

        cy.checkA11y();

        cy.get('input[id="company.name"]')
          .should('be.visible')
          .focus()
          .type(data.company.name);

        cy.get('input[id="company.companyNumber"]')
          .should('be.visible')
          .focus()
          .type(data.company.companyNumber);

        cy.get('input[id="company.bank.accountNumber"]')
          .should('be.visible')
          .focus()
          .type(data.company.bank.accountNumber);

        cy.get('input[id="company.bank.sortCode"]')
          .should('be.visible')
          .focus()
          .type(data.company.bank.sortCode);

        cy.get('input[id="company.address.line1"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line1);

        cy.get('input[id="company.address.line2"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line2);

        cy.get('input[id="company.address.line3"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line3);

        cy.get('input[id="company.address.line5"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line5);

        cy.get('input[id="company.contact.email"]')
          .should('be.visible')
          .focus()
          .type(data.company.contact.email);

        cy.get('input[id="company.contact.telephone"]')
          .should('be.visible')
          .focus()
          .type(data.company.contact.telephone);

        cy.get('button:contains("Settings")')
          .should('be.visible')
          .click();

        cy.get('input[id="vat.registration"]')
          .should('be.visible')
          .focus()
          .type(data.vat.registration);

        cy.get('input[type="radio"]')
          .should('be.visible')
          .check(data.vat.scheme);

        cy.get('select[id="yearEnd.day"]')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.day);

        cy.get('select[id="yearEnd.month"]')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.month);

        cy.get('input[id="balance.balance"]')
          .should('be.visible')
          .clear()
          .type(data.balance.balance);

        cy.get('input[id="balance.vat.owed"]')
          .should('be.visible')
          .clear()
          .type(data.balance.vat.owed);

        cy.get('input[id="balance.vat.paid"]')
          .should('be.visible')
          .clear()
          .type(data.balance.vat.paid);

        cy.get('button[type="submit"]')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', data.company.name)
          .should('be.visible');
      });
    });

    it('should create a non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const data = res[1];

        cy.get('a:contains("Add a new company")')
          .should('be.visible')
          .click();

        cy.get('input[id="company.name"]')
          .should('be.visible')
          .focus()
          .type(data.company.name);

        cy.get('input[id="company.companyNumber"]')
          .should('be.visible')
          .focus()
          .type(data.company.companyNumber);

        cy.get('input[id="company.bank.accountNumber"]')
          .should('be.visible')
          .focus()
          .type(data.company.bank.accountNumber);

        cy.get('input[id="company.bank.sortCode"]')
          .should('be.visible')
          .focus()
          .type(data.company.bank.sortCode);

        cy.get('input[id="company.address.line1"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line1);

        cy.get('input[id="company.address.line3"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line3);

        cy.get('input[id="company.address.line4"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line4);

        cy.get('input[id="company.address.line5"]')
          .should('be.visible')
          .focus()
          .type(data.company.address.line5);

        cy.get('input[id="company.contact.email"]')
          .should('be.visible')
          .focus()
          .type(data.company.contact.email);

        cy.get('input[id="company.contact.telephone"]')
          .should('be.visible')
          .focus()
          .type(data.company.contact.telephone);

        cy.get('button:contains("Settings")')
          .should('be.visible')
          .click();

        cy.get('input[type="radio"]')
          .should('be.visible')
          .check(data.vat.scheme);

        cy.get('select[id="yearEnd.day"]')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.day);

        cy.get('select[id="yearEnd.month"]')
          .should('be.visible')
          .focus()
          .select(data.yearEnd.month);

        cy.get('input[id="vat.charge"]')
          .should('be.visible')
          .clear()
          .type(data.vat.charge);

        cy.get('input[id="vat.pay"]')
          .should('be.visible')
          .clear()
          .type(data.vat.pay);

        cy.get('button[type="submit"]')
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
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', company.name)
          .should('be.visible');

        cy.checkA11y();

        cy.get('a:contains("Manage company details")')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', company.name)
          .should('be.visible');

        cy.checkA11y();

        cy.get('input[id="name"]')
          .should('be.visible')
          .should('have.value', company.name);
        cy.get('input[id="companyNumber"]')
          .should('be.visible')
          .should('have.value', company.companyNumber);

        cy.get('input[id="bank.accountNumber"]')
          .should('be.visible')
          .should('have.value', company.bank.accountNumber)
          .clear()
          .type(updated.bank.accountNumber);

        cy.format('sort code', company.bank.sortCode).then(value => {
          cy.get('input[id="bank.sortCode"]')
            .should('be.visible')
            .should('have.value', value)
            .clear()
            .type(updated.bank.sortCode);
        });

        cy.get('input[id="address.line1"]')
          .should('be.visible')
          .should('have.value', company.address.line1)
          .clear()
          .type(updated.address.line1);
        cy.get('input[id="address.line2"]')
          .should('be.visible')
          .should('have.value', company.address.line2)
          .clear();
        cy.get('input[id="address.line3"]')
          .should('be.visible')
          .should('have.value', company.address.line3);
        cy.get('input[id="address.line5"]')
          .should('be.visible')
          .should('have.value', company.address.line5);
        cy.get('input[id="contact.email"]')
          .should('be.visible')
          .should('have.value', company.contact.email)
          .clear()
          .type(updated.contact.email);
        cy.get('input[id="contact.telephone"]')
          .should('be.visible')
          .should('have.value', company.contact.telephone);

        cy.get('button[type="submit"]')
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', company.name)
          .should('be.visible');
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
            .should('be.visible')
            .click();

          cy.get('a:contains("Manage settings")')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Settings')
            .should('be.visible');

          cy.checkA11y();

          cy.get('button:contains("Add a new category")')
            .should('be.visible')
            .click();

          cy.get('input[id="categories.5.name"]')
            .should('be.visible')
            .focus()
            .type(settings.categories[0].name);

          cy.get('button:contains("Add a new category")')
            .should('be.visible')
            .click();

          cy.get('input[id="categories.6.name"]')
            .should('be.visible')
            .focus()
            .type(settings.categories[1].name);

          cy.get('input[id="categories.6.vatRate"]')
            .should('be.visible')
            .clear()
            .type(settings.categories[1].vatRate);

          cy.get('button:contains("Add a new category")')
            .should('be.visible')
            .click();

          cy.get('input[id="categories.7.name"]')
            .should('be.visible')
            .focus()
            .type(settings.categories[2].name);

          cy.get('input[id="categories.7.vatRate"]')
            .should('be.visible')
            .clear()
            .type(settings.categories[2].vatRate);

          cy.format('percentage', '20').then(value => {
            cy.get('input[id="vat.pay"]')
              .should('be.visible')
              .should('have.value', value)
              .clear()
              .type(settings.vat.pay);
          });

          cy.format('VAT registration', company.vat.registration).then(
            value => {
              cy.get('input[id="vat.registration"]')
                .should('be.visible')
                .should('have.value', value);
            },
          );

          cy.get('input[id="vat.registration"]')
            .should('be.visible')
            .clear()
            .type(settings.vat.registration);

          cy.get(`input[type="radio"][value="${company.vat.scheme}"]`)
            .should('be.visible')
            .should('be.checked');

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(settings.vat.scheme);

          cy.get('select[id="yearEnd.day"]')
            .should('be.visible')
            .should('have.value', company.yearEnd.day);

          cy.get('select[id="yearEnd.month"]')
            .should('be.visible')
            .should('have.value', company.yearEnd.month);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should remove expenses category', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage settings")')
          .should('be.visible')
          .click();

        cy.get('input[id="categories.5.name"]')
          .should('be.visible')
          .should('have.value', settings.categories[0].name);

        cy.format('percentage', settings.categories[0].vatRate).then(value => {
          cy.get('input[id="categories.5.vatRate"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.get('input[id="categories.6.name"]')
          .should('be.visible')
          .should('have.value', settings.categories[1].name);

        cy.format('percentage', settings.categories[1].vatRate).then(value => {
          cy.get('input[id="categories.6.vatRate"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.get('input[id="categories.7.name"]')
          .should('be.visible')
          .should('have.value', settings.categories[2].name);

        cy.format('percentage', settings.categories[2].vatRate).then(value => {
          cy.get('input[id="categories.7.vatRate"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.format('percentage', settings.vat.charge).then(value => {
          cy.get('input[id="vat.charge"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.format('percentage', settings.vat.pay).then(value => {
          cy.get('input[id="vat.pay"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.format('VAT registration', settings.vat.registration).then(value => {
          cy.get('input[id="vat.registration"]')
            .should('be.visible')
            .should('have.value', value);
        });

        cy.get(`input[type="radio"][value="${settings.vat.scheme}"]`)
          .should('be.visible')
          .should('be.checked');

        cy.get('button:contains("Remove")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('button[type="submit"]')
          .should('be.visible')
          .click();

        cy.get('p:contains("Dashboard")').should('be.visible');
      });
    });

    it('should re-add expense categories', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage settings")')
          .should('be.visible')
          .click();

        cy.get('button:contains("Add a new category")')
          .should('be.visible')
          .click();

        cy.get('input[id="categories.5.name"]')
          .should('be.visible')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")')
          .should('be.visible')
          .click();

        cy.get('input[id="categories.6.name"]')
          .should('be.visible')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.6.vatRate"]')
          .should('be.visible')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('button[type="submit"]')
          .should('be.visible')
          .click();

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
            .should('be.visible')
            .click();

          cy.get('a:contains("Manage settings")')
            .should('be.visible')
            .click();

          cy.format('percentage', settings.vat.charge).then(value => {
            cy.get('input[id="vat.charge"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.format('percentage', settings.vat.pay).then(value => {
            cy.get('input[id="vat.pay"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('input[id="vat.registration"]')
            .should('be.visible')
            .should('have.value', company.vat.registration);

          cy.get(`input[type="radio"][value="${company.vat.scheme}"]`)
            .should('be.visible')
            .should('be.checked');

          cy.get('select[id="yearEnd.day"]')
            .should('be.visible')
            .should('have.value', company.yearEnd.day);

          cy.get('select[id="yearEnd.day"]')
            .should('be.visible')
            .focus()
            .select(settings.yearEnd.day);

          cy.get('select[id="yearEnd.month"]')
            .should('be.visible')
            .should('have.value', company.yearEnd.month);

          cy.get('select[id="yearEnd.month"]')
            .should('be.visible')
            .focus()
            .select(settings.yearEnd.month);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('p:contains("Dashboard")').should('be.visible');
        });
      });
    });

    it('should update non-VAT registered company settings', () => {
      cy.fixture('data/settings.json').then(res => {
        const settings = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage settings")')
          .should('be.visible')
          .click();

        cy.get('button:contains("Add a new category")')
          .should('be.visible')
          .click();

        cy.get('input[id="categories.5.name"]')
          .should('be.visible')
          .focus()
          .type(settings.categories[0].name);

        cy.get('button:contains("Add a new category")')
          .should('be.visible')
          .click();

        cy.get('input[id="categories.6.name"]')
          .should('be.visible')
          .focus()
          .type(settings.categories[1].name);

        cy.get('input[id="categories.6.vatRate"]')
          .should('be.visible')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.get('select[id="yearEnd.day"]')
          .should('be.visible')
          .should('have.value', settings.yearEnd.day);

        cy.get('select[id="yearEnd.month"]')
          .should('be.visible')
          .should('have.value', settings.yearEnd.month);

        cy.get('button[type="submit"]')
          .should('be.visible')
          .click();

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
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage clients")')
          .should('be.visible')
          .click();

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');

          cy.checkA11y();

          const client = res[0];

          cy.get('a:contains("Add a new client")')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Add a new client')
            .should('be.visible');

          cy.checkA11y();

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .should('be.visible')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .should('be.visible')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .should('be.visible')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .should('be.visible')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .should('be.visible')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage clients")')
          .should('be.visible')
          .click();

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/clients/',
        );
      });

      it('should add client 1', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[0];

          cy.get('a:contains("Add a new client")')
            .should('be.visible')
            .click();

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .should('be.visible')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .should('be.visible')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line5"]')
            .should('be.visible')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .should('be.visible')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .should('be.visible')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });

      it('should add client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];

          cy.get('a:contains("Add a new client")')
            .should('be.visible')
            .click();

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .should('be.visible')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line2"]')
            .should('be.visible')
            .focus()
            .type(client.address.line2);
          cy.get('input[id="address.line3"]')
            .should('be.visible')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .should('be.visible')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .should('be.visible')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .should('be.visible')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .should('be.visible')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });

      it('should add client 3', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[2];

          cy.get('a:contains("Add a new client")')
            .should('be.visible')
            .click();

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(client.name);
          cy.get('input[id="address.line1"]')
            .should('be.visible')
            .focus()
            .type(client.address.line1);
          cy.get('input[id="address.line3"]')
            .should('be.visible')
            .focus()
            .type(client.address.line3);
          cy.get('input[id="address.line4"]')
            .should('be.visible')
            .focus()
            .type(client.address.line4);
          cy.get('input[id="address.line5"]')
            .should('be.visible')
            .focus()
            .type(client.address.line5);
          cy.get('input[id="contact.email"]')
            .should('be.visible')
            .focus()
            .type(client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .should('be.visible')
            .focus()
            .type(client.contact.telephone);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });

      it('should update client 2', () => {
        cy.fixture('data/client.json').then(res => {
          const client = res[1];
          const updated = res[3];

          cy.get('a:contains("Manage client details")')
            .eq(1)
            .should('be.visible')
            .click();

          cy.get('input[id="name"]')
            .should('be.visible')
            .should('have.value', client.name)
            .clear()
            .type(updated.name);
          cy.get('input[id="address.line1"]')
            .should('be.visible')
            .should('have.value', client.address.line1);
          cy.get('input[id="address.line2"]')
            .should('be.visible')
            .should('have.value', client.address.line2);
          cy.get('input[id="address.line3"]')
            .should('be.visible')
            .should('have.value', client.address.line3);
          cy.get('input[id="address.line4"]')
            .should('be.visible')
            .should('have.value', client.address.line4);
          cy.get('input[id="address.line5"]')
            .should('be.visible')
            .should('have.value', client.address.line5);
          cy.get('input[id="contact.email"]')
            .should('be.visible')
            .should('have.value', client.contact.email);
          cy.get('input[id="contact.telephone"]')
            .should('be.visible')
            .should('have.value', client.contact.telephone);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });

      it('should delete client 3', () => {
        cy.fixture('data/client.json').then(res => {
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

          cy.get('button[type="submit"]')
            .eq(1)
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Clients')
            .should('be.visible');
        });
      });
    });
  });

  describe.skip('Accounts', () => {
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
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage accounts")')
          .should('be.visible')
          .click();

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            cy.checkA11y();

            const transaction = res[0];

            cy.get('a:contains("Record a new transaction")')
              .should('be.visible')
              .click();

            cy.get('h2')
              .should('contain.text', 'Record transaction')
              .should('be.visible');

            cy.checkA11y();

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.type);

            cy.get('input[id="attachment"]')
              .should('be.visible')
              .upload({
                fileContent: file,
                fileName: 'invoice.pdf',
                mimeType: 'application/pdf',
              });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="name"]')
              .should('be.visible')
              .focus()
              .select(transaction.supplier);

            cy.get('input[id="description"]')
              .should('be.visible')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.status);

            cy.get('input[id="amount"]')
              .should('be.visible')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]')
                .should('be.visible')
                .should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout,
            }).should('not.be.visible');

            cy.get('button[type="submit"]')
              .should('be.visible')
              .click();

            cy.get('h2')
              .should('contain.text', 'Accounts')
              .should('be.visible');
          });
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[1];

            cy.get('a:contains("Record a new transaction")')
              .should('be.visible')
              .click();

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.type);

            cy.get('input[id="name"]')
              .should('be.visible')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .should('be.visible')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.status);

            cy.get('input[id="attachment"]')
              .should('be.visible')
              .upload({
                fileContent: file,
                fileName: 'invoice.pdf',
                mimeType: 'application/pdf',
              });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .should('be.visible')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .should('be.visible')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]')
                .should('be.visible')
                .should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout,
            }).should('not.be.visible');

            cy.get('button[type="submit"]')
              .should('be.visible')
              .click();

            cy.get('h2')
              .should('contain.text', 'Accounts')
              .should('be.visible');
          });
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          cy.fixture('upload/invoice.pdf').then(file => {
            const transaction = res[2];

            cy.get('a:contains("Record a new transaction")')
              .should('be.visible')
              .click();

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.type);

            cy.get('input[id="name"]')
              .should('be.visible')
              .focus()
              .type(transaction.supplier);

            cy.get('input[id="description"]')
              .should('be.visible')
              .focus()
              .type(transaction.description);

            cy.get('input[type="radio"]')
              .should('be.visible')
              .check(transaction.status);

            cy.get('input[id="attachment"]')
              .should('be.visible')
              .upload({
                fileContent: file,
                fileName: 'invoice.pdf',
                mimeType: 'application/pdf',
              });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('select[id="category"]')
              .should('be.visible')
              .focus()
              .select(transaction.category);

            cy.get('input[id="amount"]')
              .should('be.visible')
              .focus()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]')
                .should('be.visible')
                .should('have.value', value);
            });

            cy.get('div:contains("File has been uploaded")', {
              timeout,
            }).should('not.be.visible');

            cy.get('button[type="submit"]')
              .should('be.visible')
              .click();

            cy.get('h2')
              .should('contain.text', 'Accounts')
              .should('be.visible');
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
              .should('be.visible')
              .click();

            cy.get('h2')
              .should('contain.text', 'View transaction')
              .should('be.visible');

            cy.checkA11y();

            cy.get('input[name="transaction"][type="hidden"]').should(
              'have.value',
              transaction.type,
            );

            cy.get('select[id="name"]')
              .should('be.visible')
              .should('have.value', transaction.supplier);

            cy.get('input[id="description"]')
              .should('be.visible')
              .should('have.value', transaction.description);

            cy.get(`input[value="${transaction.status}"]`)
              .should('be.visible')
              .should('have.prop', 'checked');

            cy.get('input[id="amount"]')
              .should('be.visible')
              .clear()
              .type(transaction.amount);

            cy.format('currency', transaction.vat).then(value => {
              cy.get('input[id="vat"]')
                .should('be.visible')
                .should('have.value', value);
            });

            cy.get('button:contains("Delete file")')
              .should('be.visible')
              .click();

            cy.get('div:contains("File has been deleted")', {
              timeout,
            }).should('not.be.visible');

            cy.get('input[id="attachment"]')
              .should('be.visible')
              .upload({
                fileContent: file,
                fileName: 'invoice.pdf',
                mimeType: 'application/pdf',
              });

            cy.get('input[id="attachment"]').should('not.be.visible');

            cy.get('div:contains("File has been uploaded")', {
              timeout,
            }).should('not.be.visible');

            cy.get('button[type="submit"]')
              .should('be.visible')
              .click();

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
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Accounts')
            .should('be.visible');

          cy.checkA11y();

          cy.get('input[id="confirmation"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.contains('Balance: £790.40').should('be.visible');

          cy.contains('VAT owed: £100.00').should('be.visible');
        });
      });

      it('should make a VAT payment', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[7];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('select[id="category"]')
            .should('be.visible')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Accounts')
            .should('be.visible');
        });
      });

      it('should show correct balance details after VAT is paid', () => {
        cy.contains('Balance: £690.40').should('be.visible');

        cy.contains('VAT owed: £0').should('be.visible');
      });

      it('should download attachment', () => {
        cy.get('a:contains("View")')
          .eq(3)
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'View transaction')
          .should('be.visible');

        cy.get('button:contains("Download file")')
          .should('be.visible')
          .click();

        cy.get('div:contains("The download has started")').should('be.visible');
      });
    });

    describe('Non-VAT registered company', () => {
      beforeEach(() => {
        cy.get('a:contains("Select company")')
          .eq(0)
          .should('be.visible')
          .click();

        cy.get('a:contains("Manage accounts")')
          .should('be.visible')
          .click();

        cy.url().should(
          'include',
          'http://localhost:3000/my-companies/accounts/',
        );
      });

      it('should add a confirmed sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[0];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('select[id="name"]')
            .should('be.visible')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Accounts')
            .should('be.visible');
        });
      });

      it('should add a confirmed purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[1];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('select[id="category"]')
            .should('be.visible')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Accounts')
            .should('be.visible');
        });
      });

      it('should add a confirmed zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[2];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('select[id="category"]')
            .should('be.visible')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Accounts')
            .should('be.visible');
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
            .should('be.visible')
            .click();

          cy.get('input[id="confirmation"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.contains('Balance: £1902.40').should('be.visible');
        });
      });

      it('should add a pending sale', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[3];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('select[id="name"]')
            .should('be.visible')
            .focus()
            .select(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.scheduled);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', '0').then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Pending transactions')
            .should('be.visible');
        });
      });

      it('should add a pending purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[4];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.scheduled);

          cy.get('select[id="category"]')
            .should('be.visible')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Pending transactions')
            .should('be.visible');
        });
      });

      it('should add a pending zero VAT rate purchase', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("Record a new transaction")')
            .should('be.visible')
            .click();

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.type);

          cy.get('input[id="name"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('input[id="description"]')
            .should('be.visible')
            .focus()
            .type(transaction.description);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.status);

          cy.get('input[type="radio"]')
            .should('be.visible')
            .check(transaction.scheduled);

          cy.get('select[id="category"]')
            .should('be.visible')
            .focus()
            .select(transaction.category);

          cy.get('input[id="amount"]')
            .should('be.visible')
            .focus()
            .type(transaction.amount);

          cy.format('currency', transaction.vat).then(value => {
            cy.get('input[id="vat"]')
              .should('be.visible')
              .should('have.value', value);
          });

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Pending transactions')
            .should('be.visible');
        });
      });

      it('should delete a pending transaction', () => {
        cy.fixture('data/account.json').then(res => {
          const transaction = res[5];

          cy.get('a:contains("View pending transactions")')
            .should('be.visible')
            .click();

          cy.get('h2')
            .should('contain.text', 'Pending transactions')
            .should('be.visible');

          cy.checkA11y();

          cy.get('button:contains("Delete")')
            .eq(1)
            .should('be.visible')
            .click();

          cy.get('input[id="confirmation"]')
            .should('be.visible')
            .focus()
            .type(transaction.supplier);

          cy.get('button[type="submit"]')
            .should('be.visible')
            .click();

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

  describe.skip('Notifications', () => {
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
      cy.url().should('eq', 'http://localhost:3000/my-companies');
    });

    it('should remove VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const { company } = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]')
          .eq(1)
          .should('be.visible')
          .click();

        cy.get('h2')
          .should('contain.text', 'My companies')
          .should('be.visible');
      });
    });

    it('should remove non-VAT registered company', () => {
      cy.fixture('data/company.json').then(res => {
        const { company } = res[1];

        cy.get('a:contains("Select company")')
          .eq(0)
          .should('be.visible')
          .click();

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

        cy.get('button[type="submit"]')
          .should('be.visible')
          .eq(1)
          .click();

        cy.get('h2')
          .should('contain.text', 'My companies')
          .should('be.visible');
      });
    });
  });
});
