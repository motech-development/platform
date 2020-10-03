/* eslint-disable no-undef */

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
});

after(() => {
  cy.task('clearDownloads');
});
