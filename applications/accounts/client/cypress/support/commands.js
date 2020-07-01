/* eslint-disable no-undef */
import 'cypress-file-upload';

Cypress.Commands.add(
  'login',
  (username = Cypress.env('USERNAME'), password = Cypress.env('PASSWORD')) => {
    const options = {
      body: {
        audience: Cypress.env('AUDIENCE'),
        client_id: Cypress.env('CLIENT_ID'),
        grant_type: 'password',
        password,
        scope: 'openid profile email offline_access',
        username,
      },
      method: 'POST',
      url: Cypress.env('AUTH_URL'),
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
          scope: 'openid profile email offline_access',
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
            audience: Cypress.env('AUDIENCE'),
            redirect_uri: 'http://localhost:3000/my-companies',
            scope: 'openid profile email offline_access',
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
    case 'currency':
      return `£${Math.abs(value).toFixed(2)}`;
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
