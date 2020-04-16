describe('Register companies', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');

      cy.wait(1000);

      cy.get('#add-company').click();

      cy.url().should('eq', 'http://localhost:3000/my-companies/add-company');

      cy.wait(1000);
    });
  });

  afterEach(() => {
    cy.url().should('include', 'http://localhost:3000/my-companies/dashboard/');
  });

  it('should create a VAT registered company', () => {
    cy.fixture('company.json').then(res => {
      const company = res[0];

      cy.get('input[id="name"]').type(company.name);
      cy.get('input[id="companyNumber"]').type(company.companyNumber);
      cy.get('input[id="vatRegistration"]').type(company.vatRegistration);
      cy.get('input[id="bank.accountNumber"]').type(company.bank.accountNumber);
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
      cy.get('input[id="bank.accountNumber"]').type(company.bank.accountNumber);
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
