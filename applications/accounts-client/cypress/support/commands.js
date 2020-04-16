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
Cypress.Commands.add(
  'login',
  (username = Cypress.env('username'), password = Cypress.env('password')) => {
    const options = {
      body: {
        audience: Cypress.env('auth_audience'),
        client_id: Cypress.env('auth_client_id'),
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
            appState: {
              targetUrl: '/my-companies',
            },
            audience: Cypress.env('auth_audience'),
            redirect_uri: 'http://localhost:3000/my-companies',
            scope: 'openid profile email',
          }),
        ),
      ).then(() => {
        cy.visit(`/?code=test-code&state=${stateId}`);
      });
    });
  },
);

Cypress.Commands.add('format', (type, value) => {
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'sort code':
      return value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
    case 'VAT registration':
      return `GB${value}`;
    default:
      throw new Error('Format unknown');
  }
});
