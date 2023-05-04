/* eslint-disable @typescript-eslint/naming-convention */
import '@testing-library/cypress/add-commands';
import 'cypress-file-upload';
import 'cypress-localstorage-commands';
import 'cypress-wait-until';

Cypress.Commands.add('getBaseUrl', () => {
  const { baseUrl } = Cypress.config();

  if (baseUrl === null) {
    throw new Error('BaseURL not found.');
  }

  return cy.then(() => baseUrl);
});

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

    cy.request<{
      access_token: string;
      expires_in: number;
      id_token: string;
      token_type: string;
    }>(options).then(({ body }) => {
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
              ) as string,
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
      return cy.then(() => `£${Math.abs(parseFloat(value)).toFixed(2)}`);
    case 'percentage':
      return cy.then(() => `${value}%`);
    case 'sort code':
      return cy.then(
        () => value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3') as string,
      );
    case 'VAT registration':
      return cy.then(() => `GB${value}`);
    default:
      throw new Error('Format unknown');
  }
});

Cypress.Commands.add('a11yWithLogs', () => {
  cy.checkA11y(
    undefined,
    undefined,
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

Cypress.Commands.add(
  'safeClick',
  {
    prevSubject: 'element',
  },
  ($element) => {
    cy.wrap($element).as('button');

    cy.get('@button').should('be.visible');

    cy.get('@button').pipe(($el) => {
      const instance = $el.get(0);

      instance.click();

      return instance;
    });

    cy.get('@button').should('not.exist');

    return cy.get('@button');
  },
);

Cypress.Commands.add(
  'waitForToast',
  (timeout = 20000) =>
    cy.waitUntil(() => Cypress.$('[role="alert"]').length === 0, {
      timeout,
    }) as unknown as Cypress.Chainable<Element>,
);

Cypress.Commands.add(
  'waitForElement',
  {
    prevSubject: 'element',
  },
  ($element, visible = true) => {
    cy.wrap($element).as('element');

    cy.get('@element').pipe(($el) => $el.get(0));

    cy.get('@element').should(visible ? 'be.visible' : 'not.exist');

    return cy.get('@element');
  },
);
