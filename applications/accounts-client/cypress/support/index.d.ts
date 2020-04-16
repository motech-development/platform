/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in helper
     * @example cy.login('username', 'password')
     */
    login(username?: string, password?: string): Chainable<Element>;
  }
}
