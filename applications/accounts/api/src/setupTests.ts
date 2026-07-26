import 'aws-sdk-client-mock-vitest/extend';

vi.mock('@motech-development/node-logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('aws-appsync', async (importOriginal) => {
  const appSync = await importOriginal<typeof import('aws-appsync')>();

  appSync.AWSAppSyncClient.prototype.mutate = vi.fn();

  return appSync;
});
