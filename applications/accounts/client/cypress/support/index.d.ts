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
     * Runs a11y checking with logs
     * @example cy.a11yWithLogs()
     */
    a11yWithLogs(): void;

    /**
     * This will help with flaky behavior in cypress where there is a race condition
     * between the test runner and the app itself and its lifecycle. The problem
     * comes from the app detaching DOM elements before cypress runs actions on
     * them.
     *
     * See more details on this thread: https://github.com/cypress-io/cypress/issues/7306
     * This will probably be natively supported by cypress at some point.
     *
     * The pipe solution comes from this article cypress offers as a workaround the
     * problem for the time being.
     * https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
     * @example cy.get('button').safeClick()
     */
    safeClick(): Chainable<Element>;

    /**
     * Waits for toasts to disappear
     * @example cy.waitForToast(20000)
     */
    waitForToast(timeout?: number): Chainable<Element>;

    /**
     * Waits for an element to become visible or not
     * @example cy.get('button').waitForElement()
     * @example cy.get('button').waitForElement(false)
     */
    waitForElement(visible?: boolean): Chainable<Element>;
  }
}
