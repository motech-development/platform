/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.login('username', 'password')
     */
    login(username: string, password: string): Chainable<Element>;
  }
}
