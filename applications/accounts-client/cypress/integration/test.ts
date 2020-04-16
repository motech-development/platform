describe('Test', () => {
  it('should do something', () => {
    cy.login('me@mogusbi.co.uk', 'N6hQCc5c6@@2').then(() => {
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });
});
