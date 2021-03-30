/* eslint-disable no-undef, camelcase */
import '@testing-library/cypress/add-commands';
import 'cypress-file-upload';
import 'cypress-localstorage-commands';

Cypress.Commands.add(
  'login',
  (username = Cypress.env('USERNAME'), password = Cypress.env('PASSWORD')) => {
    const audience = Cypress.env('AUDIENCE');
    const client_id = Cypress.env('CLIENT_ID');
    const scope = 'openid profile email offline_access';
    const options = {
      body: {
        audience,
        client_id,
        grant_type: 'password',
        password,
        scope,
        username,
      },
      method: 'POST',
      url: Cypress.env('AUTH_URL'),
    };

    cy.request(options).then(({ body }) => {
      // eslint-disable-next-line camelcase
      const { access_token, expires_in, id_token, token_type } = body;

      cy.intercept('POST', 'oauth/token', {
        access_token,
        expires_in,
        id_token,
        scope: 'openid profile email offline_access',
        token_type: 'Bearer',
      });

      cy.setLocalStorage(
        `@@auth0spajs@@::${client_id}::${audience}::${scope}`,
        JSON.stringify({
          body: {
            access_token,
            audience,
            client_id,
            decodedToken: {
              user: JSON.parse(
                Buffer.from(id_token.split('.')[1], 'base64').toString('ascii'),
              ),
            },
            expires_in,
            id_token,
            scope,
            token_type,
          },
          expiresAt: Math.floor(Date.now() / 1000) + expires_in,
        }),
      ).then(() => {
        cy.visit('/my-companies');
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

Cypress.Commands.add('a11yWithLogs', () => {
  cy.checkA11y(
    null,
    null,
    (violations) => {
      cy.task(
        'log',
        `${violations.length} accessibility violation${
          violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'} detected`,
      );

      const violationData = violations.map(
        ({ id, impact, description, nodes }) => ({
          id,
          impact,
          // eslint-disable-next-line sort-keys
          description,
          nodes: nodes.length,
        }),
      );

      cy.task('table', violationData);
    },
    true,
  );
});
