import { describe, expect, it } from 'vitest';
import { readAccountsWebConfig } from './config';

const baseEnvironment: ImportMetaEnv = {
  BASE_URL: '/',
  DEV: true,
  MODE: 'test',
  PROD: false,
  SSR: false,
  VITE_APPSYNC_URL: 'https://appsync.example/graphql',
  VITE_AUTH0_AUDIENCE: 'https://api.example',
  VITE_AUTH0_CLIENT_ID: 'client-id',
  VITE_AUTH0_DOMAIN: 'identity.example',
  VITE_AWS_REGION: 'eu-west-1',
  VITE_COMMIT_SHA: '0123456789012345678901234567890123456789',
  VITE_SENTRY_DSN: 'https://sentry.example/1',
  VITE_STAGE: 'pr-1542',
};

describe('Accounts web configuration', () => {
  it('reads the application and ordinary error-monitoring configuration', () => {
    expect(readAccountsWebConfig(baseEnvironment)).toEqual({
      appsyncUrl: 'https://appsync.example/graphql',
      auth0Audience: 'https://api.example',
      auth0ClientId: 'client-id',
      auth0Domain: 'identity.example',
      commitSha: '0123456789012345678901234567890123456789',
      region: 'eu-west-1',
      sentryDsn: 'https://sentry.example/1',
      stage: 'pr-1542',
    });
  });

  it.each(['preview', 'pr-current', 'production-candidate'])(
    'rejects non-canonical deployment stage %s',
    (stage) => {
      expect(() =>
        readAccountsWebConfig({ ...baseEnvironment, VITE_STAGE: stage }),
      ).toThrow('VITE_STAGE must be local, develop, production or pr-<number>');
    },
  );
});
