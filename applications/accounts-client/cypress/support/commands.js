/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => {
  const options = {
    body: {
      audience: Cypress.env('auth_audience'),
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret'),
      grant_type: 'password',
      password,
      scope: 'openid profile email',
      username,
    },
    method: 'POST',
    url: Cypress.env('auth_url'),
  };

  cy.request(options).then(({ body }) => {
    // eslint-disable-next-line camelcase
    const { access_token, expires_in, id_token } = body;

    cy.server();

    cy.route({
      method: 'POST',
      response: {
        access_token,
        expires_in,
        id_token,
        scope: 'openid profile email',
        token_type: 'Bearer',
      },
      url: 'oauth/token',
    });

    const stateId = 'test';

    cy.setCookie(
      `a0.spajs.txs.${stateId}`,
      encodeURIComponent(
        JSON.stringify({
          appState: '/',
          audience: Cypress.env('auth_audience'),
          redirect_uri: 'http://localhost:3000',
          scope: 'openid profile email',
        }),
      ),
    ).then(() => {
      // ?code=uxpMEMlxtlozJ11D&state=cV9sYTY0bHlhM1VxeHd2a0JOVEpUcGJobFRvQjYwNUJqalNCS2guaHotNQ%3D%3D
      cy.visit(`/?code=test-code&state=${stateId}`);
    });
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
