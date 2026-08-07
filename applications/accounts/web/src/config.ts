import { type HostedStage, isHostedStage } from '../stage';

export type AccountsWebStage = HostedStage | 'local';

export interface AccountsWebConfig {
  appsyncUrl: string;
  auth0Audience: string;
  auth0ClientId: string;
  auth0Domain: string;
  commitSha: string;
  region: string;
  sentryDsn?: string;
  stage: AccountsWebStage;
}

function required(env: ImportMetaEnv, key: keyof ImportMetaEnv): string {
  const value = (env as Record<string, unknown>)[key];

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  throw new Error(`Missing required Accounts web configuration: ${key}`);
}

function deploymentStage(value: string): AccountsWebStage {
  if (value === 'local' || isHostedStage(value)) {
    return value;
  }

  throw new Error(
    'Invalid Accounts web configuration: VITE_STAGE must be local, develop, production or pr-<number>',
  );
}

export function readAccountsWebConfig(
  env: ImportMetaEnv = import.meta.env,
): AccountsWebConfig {
  const stage = deploymentStage(required(env, 'VITE_STAGE'));

  return {
    appsyncUrl: required(env, 'VITE_APPSYNC_URL'),
    auth0Audience: required(env, 'VITE_AUTH0_AUDIENCE'),
    auth0ClientId: required(env, 'VITE_AUTH0_CLIENT_ID'),
    auth0Domain: required(env, 'VITE_AUTH0_DOMAIN'),
    commitSha: required(env, 'VITE_COMMIT_SHA'),
    region: required(env, 'VITE_AWS_REGION'),
    sentryDsn: env.VITE_SENTRY_DSN,
    stage,
  };
}
