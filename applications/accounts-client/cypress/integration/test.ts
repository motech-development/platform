describe('Test', () => {
  it('should do something', () => {
    cy.login().then(() => {
      cy.url().should('eq', 'http://localhost:3000/my-companies');
    });
  });
});
