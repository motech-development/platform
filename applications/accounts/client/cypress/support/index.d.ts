/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in helper
     * @example cy.login('username', 'password')
     */
    login(username?: string, password?: string): Chainable<Element>;

    /**
     * Formatting helper
     * @example cy.format('sort code', '123456')
     */
    format(type: string, value: string): Chainable<string>;

    /**
     * Injects Axe for a11y testing
     * @example cy.injectAxe()
     */
    injectAxe(): Chainable<EventEmitter>;

    /**
     * Runs a11y checking
     * @example cy.checkA11y()
     */
    checkA11y(): Chainable<EventEmitter>;

    /**
     * Runs a11y checking with logs
     * @example cy.a11yWithLogs()
     */
    a11yWithLogs(): void;
  }
}
