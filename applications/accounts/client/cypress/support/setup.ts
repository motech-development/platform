/* eslint-disable no-undef */
let baseUrl: string;

before(() => {
  cy.getBaseUrl().then((value) => {
    baseUrl = value;
  });

  cy.clearLocalStorageSnapshot().then(() => {
    cy.login().then(() => {
      cy.url().should('eq', `${baseUrl}/my-companies`);

      cy.saveLocalStorage();
    });
  });
});

beforeEach(() => {
  cy.getBaseUrl().then((value) => {
    baseUrl = value;
  });

  if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {});
        });
      })
      .catch(() => {});
  }

  cy.restoreLocalStorage().then(() => {
    cy.visit('/my-companies').then(() => {
      cy.url().should('eq', `${baseUrl}/my-companies`);

      cy.injectAxe();

      cy.get('h2').should('contain.text', 'My companies').should('be.visible');
    });
  });
});

after(() => {
  cy.task('clearDownloads');
});
