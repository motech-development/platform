describe('Smoke tests', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');

      cy.wait(1000);
    });
  });

  describe('Register company', () => {
    beforeEach(() => {
      cy.get('a:contains("Add a new company")').click();

      cy.url().should('eq', 'http://localhost:3000/my-companies/add-company');

      cy.wait(1000);
    });

    afterEach(() => {
      cy.url().should(
        'include',
        'http://localhost:3000/my-companies/dashboard/',
      );
    });

    it('should create a VAT registered company', () => {
      cy.fixture('company.json').then(res => {
        const company = res[0];

        cy.get('input[id="name"]').type(company.name);
        cy.get('input[id="companyNumber"]').type(company.companyNumber);
        cy.get('input[id="vatRegistration"]').type(company.vatRegistration);
        cy.get('input[id="bank.accountNumber"]').type(
          company.bank.accountNumber,
        );
        cy.get('input[id="bank.sortCode"]').type(company.bank.sortCode);
        cy.get('input[id="address.line1"]').type(company.address.line1);
        cy.get('input[id="address.line2"]').type(company.address.line2);
        cy.get('input[id="address.line3"]').type(company.address.line3);
        cy.get('input[id="address.line5"]').type(company.address.line5);
        cy.get('input[id="contact.email"]').type(company.contact.email);
        cy.get('input[id="contact.telephone"]').type(company.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should create a non-VAT registered company', () => {
      cy.fixture('company.json').then(res => {
        const company = res[1];

        cy.get('input[id="name"]').type(company.name);
        cy.get('input[id="companyNumber"]').type(company.companyNumber);
        cy.get('input[id="bank.accountNumber"]').type(
          company.bank.accountNumber,
        );
        cy.get('input[id="bank.sortCode"]').type(company.bank.sortCode);
        cy.get('input[id="address.line1"]').type(company.address.line1);
        cy.get('input[id="address.line3"]').type(company.address.line3);
        cy.get('input[id="address.line4"]').type(company.address.line4);
        cy.get('input[id="address.line5"]').type(company.address.line5);
        cy.get('input[id="contact.email"]').type(company.contact.email);
        cy.get('input[id="contact.telephone"]').type(company.contact.telephone);

        cy.get('button[type="submit"]').click();
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
      cy.fixture('company.json').then(res => {
        const company = res[0];
        const updated = res[2];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage company details")').click();

        cy.wait(1000);

        cy.get('input[id="name"]').should('have.value', company.name);
        cy.get('input[id="companyNumber"]').should(
          'have.value',
          company.companyNumber,
        );

        cy.format('VAT registration', company.vatRegistration).then(value => {
          cy.get('input[id="vatRegistration"]').should('have.value', value);
        });

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

    it('should update company settings', () => {
      cy.fixture('settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.0.name"]').type(
          settings.categories[0].name,
        );

        cy.get('button:contains("Add a new category")').click();

        cy.get('input[id="categories.1.name"]').type(
          settings.categories[1].name,
        );

        cy.get('input[id="categories.1.vatRate"]')
          .clear()
          .type(settings.categories[1].vatRate);

        cy.format('percentage', '20').then(value => {
          cy.get('input[id="vat.pay"]')
            .should('have.value', value)
            .clear()
            .type(settings.vat.pay);
        });

        cy.get('button[type="submit"]').click();
      });
    });

    it('should remove expenses category', () => {
      cy.fixture('settings.json').then(res => {
        const settings = res[0];

        cy.get('a:contains("Select company")')
          .eq(1)
          .click();

        cy.wait(1000);

        cy.get('a:contains("Manage settings")').click();

        cy.wait(1000);

        cy.get('input[id="categories.0.name"]').should(
          'have.value',
          settings.categories[0].name,
        );

        cy.format('percentage', settings.categories[0].vatRate).then(value => {
          cy.get('input[id="categories.0.vatRate"]').should(
            'have.value',
            value,
          );
        });

        cy.get('input[id="categories.1.name"]').should(
          'have.value',
          settings.categories[1].name,
        );

        cy.format('percentage', settings.categories[1].vatRate).then(value => {
          cy.get('input[id="categories.1.vatRate"]').should(
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

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button:contains("Remove")')
          .eq(0)
          .click();

        cy.get('button[type="submit"]').click();
      });
    });

    it('should have correct defaults for non-VAT registered company', () => {
      cy.fixture('settings.json').then(res => {
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

        cy.get('button[type="submit"]').click();
      });
    });
  });

  describe('Clients', () => {
    beforeEach(() => {
      cy.get('a:contains("Select company")')
        .eq(0)
        .click();

      cy.wait(1000);

      cy.get('a:contains("Manage clients")').click();

      cy.wait(1000);

      cy.url().should('include', 'http://localhost:3000/my-companies/clients/');

      cy.wait(1000);
    });

    afterEach(() => {
      cy.url().should('include', 'http://localhost:3000/my-companies/clients/');
    });

    it('should add client 1', () => {
      cy.fixture('client.json').then(res => {
        const client = res[0];

        cy.get('a:contains("Add a new client")').click();

        cy.wait(1000);

        cy.get('input[id="name"]').type(client.name);
        cy.get('input[id="address.line1"]').type(client.address.line1);
        cy.get('input[id="address.line3"]').type(client.address.line3);
        cy.get('input[id="address.line5"]').type(client.address.line5);
        cy.get('input[id="contact.email"]').type(client.contact.email);
        cy.get('input[id="contact.telephone"]').type(client.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should add client 2', () => {
      cy.fixture('client.json').then(res => {
        const client = res[1];

        cy.get('a:contains("Add a new client")').click();

        cy.wait(1000);

        cy.get('input[id="name"]').type(client.name);
        cy.get('input[id="address.line1"]').type(client.address.line1);
        cy.get('input[id="address.line2"]').type(client.address.line2);
        cy.get('input[id="address.line3"]').type(client.address.line3);
        cy.get('input[id="address.line4"]').type(client.address.line4);
        cy.get('input[id="address.line5"]').type(client.address.line5);
        cy.get('input[id="contact.email"]').type(client.contact.email);
        cy.get('input[id="contact.telephone"]').type(client.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should add client 3', () => {
      cy.fixture('client.json').then(res => {
        const client = res[2];

        cy.get('a:contains("Add a new client")').click();

        cy.wait(1000);

        cy.get('input[id="name"]').type(client.name);
        cy.get('input[id="address.line1"]').type(client.address.line1);
        cy.get('input[id="address.line3"]').type(client.address.line3);
        cy.get('input[id="address.line4"]').type(client.address.line4);
        cy.get('input[id="address.line5"]').type(client.address.line5);
        cy.get('input[id="contact.email"]').type(client.contact.email);
        cy.get('input[id="contact.telephone"]').type(client.contact.telephone);

        cy.get('button[type="submit"]').click();
      });
    });

    it('should update client 2', () => {
      cy.fixture('client.json').then(res => {
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
      });
    });

    it('should delete client 3', () => {
      cy.fixture('client.json').then(res => {
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
      });
    });
  });

  describe('Delete company', () => {
    afterEach(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');
    });

    it('should remove VAT registered company', () => {
      cy.fixture('company.json').then(res => {
        const company = res[0];

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
      });
    });

    it('should remove non-VAT registered company', () => {
      cy.fixture('company.json').then(res => {
        const company = res[1];

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
      });
    });
  });
});
