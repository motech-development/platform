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
