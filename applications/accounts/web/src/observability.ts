import * as Sentry from '@sentry/tanstackstart-react';
import type { AccountsOwnerId } from './auth/owner';
import type { AccountsWebConfig } from './config';

const filteredValue = '[Filtered]';
const filteredFileContents = '[Filtered file contents]';

const secretFieldNames = new Set([
  'accesstoken',
  'apikey',
  'authorization',
  'authtoken',
  'awsaccesskeyid',
  'awssecretaccesskey',
  'awssessiontoken',
  'bearertoken',
  'clientsecret',
  'cookie',
  'cookies',
  'csrftoken',
  'credential',
  'idtoken',
  'password',
  'proxyauthorization',
  'refreshtoken',
  'secret',
  'secretaccesskey',
  'securitytoken',
  'sessiontoken',
  'setcookie',
  'signature',
  'token',
  'xamzcredential',
  'xamzsecuritytoken',
  'xamzsignature',
]);

const oauthQueryParameters = new Set([
  'accesstoken',
  'code',
  'idtoken',
  'password',
  'refreshtoken',
  'state',
  'token',
]);

function normaliseFieldName(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
}

function redactUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);

    if (url.username) url.username = filteredValue;
    if (url.password) url.password = filteredValue;

    [...url.searchParams.keys()].forEach((name) => {
      const normalisedName = normaliseFieldName(name);
      if (oauthQueryParameters.has(normalisedName)) {
        url.searchParams.set(name, filteredValue);
      }
    });

    return url.toString();
  } catch {
    return rawUrl;
  }
}

function redactSecretsFromText(value: string) {
  return value
    .replaceAll(/\b(Bearer|Basic)\s+[A-Z0-9._~+/=-]+/gi, `$1 ${filteredValue}`)
    .replaceAll(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      filteredValue,
    )
    .replaceAll(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, filteredValue)
    .replaceAll(/https?:\/\/[^\s<>"']+/g, redactUrl);
}

function isRawFileContent(value: object) {
  return (
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

function diagnosticValue(
  value: unknown,
  fieldName?: string,
  seen = new WeakMap<object, unknown>(),
): unknown {
  if (fieldName && secretFieldNames.has(normaliseFieldName(fieldName))) {
    return filteredValue;
  }

  if (typeof value === 'string') return redactSecretsFromText(value);
  if (value === null || typeof value !== 'object') return value;
  if (isRawFileContent(value)) return filteredFileContents;

  const existingValue = seen.get(value);
  if (existingValue) return existingValue;

  if (Array.isArray(value)) {
    const redactedValues = new Array<unknown>(value.length);
    seen.set(value, redactedValues);
    value.forEach((item, index) => {
      redactedValues[index] = diagnosticValue(item, undefined, seen);
    });
    return redactedValues;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') return value;

  const redactedValue: Record<string, unknown> = {};
  seen.set(value, redactedValue);
  Object.entries(value).forEach(([name, item]) => {
    redactedValue[name] = diagnosticValue(item, name, seen);
  });
  return redactedValue;
}

export function setObservabilityUser(
  ownerId?: AccountsOwnerId,
  email?: string,
) {
  Sentry.setUser(ownerId ? { email, id: ownerId } : null);
}

export function setObservabilityCompany(companyId?: string) {
  Sentry.setContext('company', companyId ? { id: companyId } : null);
}

export function captureGraphqlFailure({
  error,
  operationName,
  result,
  variables,
}: Readonly<{
  error: unknown;
  operationName: string;
  result?: unknown;
  variables: Record<string, unknown>;
}>) {
  Sentry.withScope((scope) => {
    scope.setContext('graphql', {
      operationName,
      ...(result === undefined ? {} : { result: diagnosticValue(result) }),
      variables: diagnosticValue(variables),
    });
    Sentry.captureException(error);
  });
}

export function capturePresignedTransferFailure(
  error: unknown,
  operation: 'Download' | 'Upload',
) {
  Sentry.withScope((scope) => {
    scope.setContext('storage', { operation });
    Sentry.captureException(error);
  });
}

function captureBoundaryFailure(
  context: 'authentication' | 'route',
  operation: 'RenderRoute' | 'RenewSession',
  error: unknown,
) {
  Sentry.withScope((scope) => {
    scope.setContext(context, { operation });
    Sentry.captureException(error);
  });
}

export function captureRouteFailure(error: unknown) {
  captureBoundaryFailure('route', 'RenderRoute', error);
}

export function captureSessionRenewalFailure(error: unknown) {
  captureBoundaryFailure('authentication', 'RenewSession', error);
}

export function initialiseObservability(config: AccountsWebConfig) {
  if (config.stage === 'local' || !config.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.stage,
    initialScope: {
      tags: {
        service: 'accounts-web',
      },
    },
    release: config.commitSha,
    sendDefaultPii: false,
  });
}
