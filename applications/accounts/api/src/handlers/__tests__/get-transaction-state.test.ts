import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { AppSyncResolverEvent, Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler, ITransactionStateArguments } from '../get-transaction-state';

const transaction = {
  __typename: 'Transaction',
  amount: 100,
  attachment: 'company-id/updated.pdf',
  category: 'Sales',
  companyId: 'company-id',
  date: '2026-09-05T00:00:00.000Z',
  description: 'Updated description',
  id: 'transaction-id',
  name: 'Customer',
  owner: 'owner-id',
  refund: false,
  scheduled: false,
  status: 'confirmed',
  vat: 20,
};

type StateEvent = AppSyncResolverEvent<ITransactionStateArguments>;

const invoke = (identity: unknown = { sub: 'owner-id' }) =>
  handler(
    {
      arguments: { companyId: 'company-id', transactionId: 'transaction-id' },
      identity,
    } as StateEvent,
    {} as Context,
    vi.fn(),
  );

describe('get-transaction-state', () => {
  const ddb = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddb.reset();
    vi.stubEnv('TABLE', 'accounts-test-application');
    ddb.on(GetCommand).resolves({ Item: transaction });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    ddb.restore();
  });

  it('reads current transaction state directly and consistently for its owner', async () => {
    await expect(invoke()).resolves.toEqual(transaction);
    expect(ddb).toReceiveCommandTimes(GetCommand, 1);
    expect(ddb).toReceiveCommandWith(GetCommand, {
      ConsistentRead: true,
      Key: { __typename: 'Transaction', id: 'transaction-id' },
      TableName: 'accounts-test-application',
    });
  });

  it('reads updated state again when a notification is replayed', async () => {
    ddb
      .on(GetCommand)
      .resolvesOnce({ Item: { ...transaction, status: 'pending' } })
      .resolvesOnce({ Item: transaction });

    await expect(invoke()).resolves.toMatchObject({ status: 'pending' });
    await expect(invoke()).resolves.toEqual(transaction);
    expect(ddb).toReceiveCommandTimes(GetCommand, 2);
  });

  it.each([
    ['deleted', undefined],
    [
      'moved to another company',
      { ...transaction, companyId: 'other-company' },
    ],
    ['owned by another user', { ...transaction, owner: 'other-owner' }],
    ['missing its owner', { ...transaction, owner: undefined }],
  ])('returns null for a transaction that is %s', async (_, item) => {
    ddb.on(GetCommand).resolves({ Item: item });
    await expect(invoke()).resolves.toBeNull();
  });

  it.each([null, {}, { sub: '' }, { sub: 123 }, { username: 'owner-id' }])(
    'rejects an invalid authenticated identity before accessing data: %j',
    async (identity) => {
      await expect(invoke(identity)).resolves.toEqual({
        errorMessage: 'Unauthorized',
        errorType: 'UnauthorizedException',
      });
      expect(ddb).toReceiveCommandTimes(GetCommand, 0);
    },
  );

  it('fails without a configured table before accessing data', async () => {
    vi.stubEnv('TABLE', undefined);
    await expect(invoke()).resolves.toEqual({
      errorMessage: 'Transaction state is unavailable',
      errorType: 'ConfigurationError',
    });
    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
  });

  it.each([
    'ResourceNotFoundException',
    'ValidationException',
    'AccessDeniedException',
    'UnrecognizedClientException',
  ])('classifies permanent DynamoDB %s failures', async (name) => {
    ddb
      .on(GetCommand)
      .rejects(Object.assign(new Error('Permanent failure'), { name }));
    await expect(invoke()).resolves.toEqual({
      errorMessage: 'Transaction state is unavailable',
      errorType: 'ConfigurationError',
    });
  });

  it.each([
    'ThrottlingException',
    'ProvisionedThroughputExceededException',
    'InternalServerError',
  ])('preserves retryable DynamoDB %s failures', async (name) => {
    ddb
      .on(GetCommand)
      .rejects(Object.assign(new Error('Temporary failure'), { name }));
    await expect(invoke()).rejects.toThrow('Temporary failure');
  });

  it('propagates a failed read rather than treating the transaction as deleted', async () => {
    ddb.on(GetCommand).rejects(new Error('DynamoDB unavailable'));
    await expect(invoke()).rejects.toThrow('DynamoDB unavailable');
  });
});
