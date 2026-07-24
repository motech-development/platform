import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import { handler } from '../publish-transactions';
import { ITransaction, TransactionStatus } from '../shared/transaction';

jest.mock('uuid', () => ({
  ...jest.requireActual<typeof import('uuid')>('uuid'),
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

const transaction: ITransaction = {
  __typename: 'Transaction',
  amount: 100.25,
  attachment: '',
  category: 'Sales',
  companyId: 'company-id',
  date: '2020-06-07T00:00:00.000Z',
  description: 'Description',
  id: 'transaction-id',
  name: 'Transaction',
  owner: 'owner',
  scheduled: true,
  status: TransactionStatus.Pending,
  vat: 20.05,
};

const publicationEvent = (
  body: unknown = {
    expectedScheduledTime: transaction.date,
    transactionId: transaction.id,
  },
): SQSEvent =>
  ({
    Records: [
      {
        body: typeof body === 'string' ? body : JSON.stringify(body),
      },
    ],
  }) as SQSEvent;

describe('publish-transactions', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBDocumentClient>;
  let originalEnvironment: NodeJS.ProcessEnv;

  beforeAll(() => {
    advanceTo('2020-06-06T19:45:00.000Z');
  });

  beforeEach(() => {
    callback = jest.fn();
    context = ctx();
    context.done();
    ddb = mockClient(DynamoDBDocumentClient);
    originalEnvironment = process.env;
    process.env = {
      ...process.env,
      TABLE: 'accounts-test-application',
    };
    ddb.on(GetCommand).resolves({
      Item: transaction,
    });
  });

  afterEach(() => {
    process.env = originalEnvironment;
  });

  afterAll(() => {
    clear();
  });

  it('atomically confirms the Transaction and creates its notification', async () => {
    await handler(publicationEvent(), context, callback);

    expect(ddb).toReceiveCommandWith(GetCommand, {
      ConsistentRead: true,
      Key: {
        __typename: 'Transaction',
        id: 'transaction-id',
      },
      TableName: 'accounts-test-application',
    });
    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Update: {
            ConditionExpression:
              '#status = :pending AND #scheduled = :scheduled AND #date = :expectedScheduledTime',
            ExpressionAttributeNames: {
              '#data': 'data',
              '#date': 'date',
              '#scheduled': 'scheduled',
              '#status': 'status',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':confirmed': 'confirmed',
              ':data': 'owner:company-id:confirmed:2020-06-07T00:00:00.000Z',
              ':expectedScheduledTime': '2020-06-07T00:00:00.000Z',
              ':notScheduled': false,
              ':pending': 'pending',
              ':scheduled': true,
              ':updatedAt': '2020-06-06T19:45:00.000Z',
            },
            Key: {
              __typename: 'Transaction',
              id: 'transaction-id',
            },
            TableName: 'accounts-test-application',
            UpdateExpression:
              'SET #data = :data, #scheduled = :notScheduled, #status = :confirmed, #updatedAt = :updatedAt',
          },
        },
        {
          Put: {
            Item: {
              __typename: 'Notification',
              createdAt: '2020-06-06T19:45:00.000Z',
              data: 'owner:Notification:2020-06-06T19:45:00.000Z',
              id: 'test-uuid',
              message: 'TRANSACTION_PUBLISHED',
              owner: 'owner',
              read: false,
            },
            TableName: 'accounts-test-application',
          },
        },
      ],
    });
  });

  it.each([
    [
      'a stale Transaction Date',
      { ...transaction, date: '2020-06-08T00:00:00.000Z' },
    ],
    ['an unscheduled Transaction', { ...transaction, scheduled: false }],
    [
      'a manually confirmed Transaction',
      { ...transaction, status: TransactionStatus.Confirmed },
    ],
    ['a deleted Transaction', undefined],
  ])('acknowledges %s without publishing', async (_description, item) => {
    ddb.on(GetCommand).resolves({
      Item: item,
    });

    await handler(publicationEvent(), context, callback);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 0);
  });

  it('creates only one notification for duplicate publication commands', async () => {
    ddb
      .on(GetCommand)
      .resolvesOnce({
        Item: transaction,
      })
      .resolves({
        Item: {
          ...transaction,
          scheduled: false,
          status: TransactionStatus.Confirmed,
        },
      });

    await handler(publicationEvent(), context, callback);
    await handler(publicationEvent(), context, callback);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 1);
  });

  it('acknowledges a concurrent duplicate that loses the condition', async () => {
    ddb.on(TransactWriteCommand).rejects(
      new TransactionCanceledException({
        $metadata: {},
        CancellationReasons: [
          {
            Code: 'ConditionalCheckFailed',
          },
        ],
        message: 'The Transaction was already published',
      }),
    );

    await expect(
      handler(publicationEvent(), context, callback),
    ).resolves.toBeUndefined();
  });

  it.each([
    ['invalid JSON', '{'],
    [
      'a missing Transaction identifier',
      { expectedScheduledTime: transaction.date },
    ],
    ['a missing expected schedule time', { transactionId: transaction.id }],
  ])('rejects a malformed command with %s', async (_description, body) => {
    await expect(
      handler(publicationEvent(body), context, callback),
    ).rejects.toThrow();
  });

  it('throws DynamoDB read failures so SQS can retry', async () => {
    const error = new Error('DynamoDB unavailable');
    ddb.on(GetCommand).rejects(error);

    await expect(
      handler(publicationEvent(), context, callback),
    ).rejects.toThrow(error);
  });

  it('throws DynamoDB transaction failures so SQS can retry', async () => {
    const error = new Error('DynamoDB unavailable');
    ddb.on(TransactWriteCommand).rejects(error);

    await expect(
      handler(publicationEvent(), context, callback),
    ).rejects.toThrow(error);
  });

  it('requires the application table', async () => {
    delete process.env.TABLE;

    await expect(
      handler(publicationEvent(), context, callback),
    ).rejects.toThrow('No table set');
  });
});
