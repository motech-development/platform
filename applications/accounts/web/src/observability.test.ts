import * as Sentry from '@sentry/tanstackstart-react';
import type { AccountsOwnerId } from './auth/owner';
import type { AccountsWebConfig } from './config';
import {
  captureGraphqlFailure,
  capturePresignedTransferFailure,
  captureRouteFailure,
  captureSessionRenewalFailure,
  captureSignOutFailure,
  initialiseObservability,
  setObservabilityCompany,
  setObservabilityUser,
} from './observability';

const mocks = vi.hoisted(() => ({
  captureException: vi.fn(),
  init: vi.fn(),
  scope: { setContext: vi.fn() },
  setContext: vi.fn(),
  setUser: vi.fn(),
  withScope: vi.fn(),
}));

vi.mock('@sentry/tanstackstart-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/tanstackstart-react')>()),
  captureException: mocks.captureException,
  init: mocks.init,
  setContext: mocks.setContext,
  setUser: mocks.setUser,
  withScope: mocks.withScope,
}));

const hostedConfig: AccountsWebConfig = {
  appsyncUrl: 'https://appsync.example/graphql',
  auth0Audience: 'https://api.example',
  auth0ClientId: 'client-id',
  auth0Domain: 'identity.example',
  commitSha: '0123456789012345678901234567890123456789',
  region: 'eu-west-1',
  sentryDsn: 'https://sentry.example/1',
  stage: 'pr-1542',
};
const ownerId = 'owner-789' as AccountsOwnerId;

describe('Accounts web error monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.withScope.mockImplementation(
      (callback: (scope: typeof mocks.scope) => void) => {
        callback(mocks.scope);
      },
    );
  });

  it('initialises ordinary hosted error monitoring', () => {
    initialiseObservability(hostedConfig);

    expect(mocks.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: hostedConfig.sentryDsn,
        environment: hostedConfig.stage,
        initialScope: { tags: { service: 'accounts-web' } },
        release: hostedConfig.commitSha,
        sendDefaultPii: false,
      }),
    );
  });

  it('does not initialise monitoring for local development', () => {
    initialiseObservability({ ...hostedConfig, stage: 'local' });

    expect(mocks.init).not.toHaveBeenCalled();
  });

  it('preserves SDK diagnostics without blanket event or breadcrumb hooks', () => {
    initialiseObservability(hostedConfig);
    const options = mocks.init.mock.calls[0]?.[0] as Parameters<
      typeof Sentry.init
    >[0];

    expect(options.beforeSend).toBeUndefined();
    expect(options.beforeBreadcrumb).toBeUndefined();
  });

  it('attaches GraphQL diagnostics with only durable-secret exclusions', () => {
    const error = new Error('Upload failed');

    captureGraphqlFailure({
      error,
      operationName: 'RequestUpload',
      result: {
        data: {
          requestUpload: {
            id: 'upload-123',
            url: 'https://storage.example/invoice.pdf?download=invoice.pdf&X-Amz-Credential=credential&X-Amz-Signature=signature',
          },
        },
      },
      variables: {
        attachmentBytes: new Uint8Array([1, 2, 3]),
        authorization: 'Bearer request-token',
        companyId: 'company-123',
        description: 'Quarterly subscription',
      },
    });

    expect(mocks.scope.setContext).toHaveBeenCalledWith(
      'graphql',
      expect.objectContaining({
        operationName: 'RequestUpload',
        variables: {
          attachmentBytes: '[Filtered file contents]',
          authorization: '[Filtered]',
          companyId: 'company-123',
          description: 'Quarterly subscription',
        },
      }),
    );
    expect(mocks.captureException).toHaveBeenCalledWith(error);
    const graphqlContext = mocks.scope.setContext.mock.calls[0]?.[1] as {
      result: { data: { requestUpload: { url: string } } };
    };
    const presignedUrl = new URL(graphqlContext.result.data.requestUpload.url);

    expect(presignedUrl.searchParams.get('download')).toBe('invoice.pdf');
    expect(presignedUrl.searchParams.get('X-Amz-Credential')).toBe(
      'credential',
    );
    expect(presignedUrl.searchParams.get('X-Amz-Signature')).toBe('signature');
  });

  it('captures the original presigned transfer failure with its operation', () => {
    const error = new Error('Storage connection failed');

    capturePresignedTransferFailure(error, 'Upload');

    expect(mocks.scope.setContext).toHaveBeenCalledWith('storage', {
      operation: 'Upload',
    });
    expect(mocks.captureException).toHaveBeenCalledWith(error);
  });

  it('captures original route and authentication failures at their boundaries', () => {
    const routeError = new Error('Route rendering failed');
    const renewalError = new Error('Session renewal failed');
    const signOutError = new Error('Sign-out redirect failed');

    captureRouteFailure(routeError);
    captureSessionRenewalFailure(renewalError);
    captureSignOutFailure(signOutError);

    expect(mocks.scope.setContext).toHaveBeenNthCalledWith(1, 'route', {
      operation: 'RenderRoute',
    });
    expect(mocks.scope.setContext).toHaveBeenNthCalledWith(
      2,
      'authentication',
      { operation: 'RenewSession' },
    );
    expect(mocks.scope.setContext).toHaveBeenNthCalledWith(
      3,
      'authentication',
      { operation: 'SignOut' },
    );
    expect(mocks.captureException).toHaveBeenNthCalledWith(1, routeError);
    expect(mocks.captureException).toHaveBeenNthCalledWith(2, renewalError);
    expect(mocks.captureException).toHaveBeenNthCalledWith(3, signOutError);
  });

  it('keeps authenticated owner and active company context current', () => {
    setObservabilityUser(ownerId, 'owner@example.com');
    setObservabilityCompany('company-123');
    setObservabilityCompany();
    setObservabilityUser();

    expect(mocks.setUser).toHaveBeenNthCalledWith(1, {
      email: 'owner@example.com',
      id: 'owner-789',
    });
    expect(mocks.setContext).toHaveBeenNthCalledWith(1, 'company', {
      id: 'company-123',
    });
    expect(mocks.setContext).toHaveBeenNthCalledWith(2, 'company', null);
    expect(mocks.setUser).toHaveBeenNthCalledWith(2, null);
  });
});
