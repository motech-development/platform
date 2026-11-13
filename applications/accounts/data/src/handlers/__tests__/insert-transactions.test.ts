import {
  DynamoDBClient,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import {
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import insertTransactions from '../insert-transactions';

describe('insert-transactions', () => {
  let ddb: AwsClientStub<DynamoDBClient>;
  let documentClient: DynamoDBClient;
  let tableName: string;
  let records: DynamoDBRecord[];

  beforeAll(() => {
    vi.setSystemTime(new Date('2020-06-06T19:45:00+00:00'));
  });

  beforeEach(() => {
    ddb = mockClient(DynamoDBClient);

    documentClient = new DynamoDBClient({});

    tableName = 'test';

    records = [
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'Expenses',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '1.2',
            },
          },
          OldImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'Expenses',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '2.4',
            },
          },
        },
        eventID: 'event-1',
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'Sales',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '1.2',
            },
          },
          OldImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'Sales',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '2.4',
            },
          },
        },
        eventID: 'event-2',
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'Sales',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'pending',
            },
            vat: {
              N: '1.2',
            },
          },
          OldImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'Sales',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'pending',
            },
            vat: {
              N: '2.4',
            },
          },
        },
        eventID: 'event-3',
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'VAT payment',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '0',
            },
          },
          OldImage: {
            __typename: {
              S: 'Transaction',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'VAT payment',
            },
            companyId: {
              S: 'company-id',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '0',
            },
          },
        },
        eventID: 'event-4',
      },
    ];
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return update with the correct params', async () => {
    await Promise.all(
      insertTransactions(documentClient, tableName, records).map((write) =>
        write(),
      ),
    );

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        {
          Update: {
            ConditionExpression: 'attribute_exists(id)',
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#itemProperty': '2019-12-15T00:00:00.000Z',
              '#items': 'items',
              '#updatedAt': 'updatedAt',
              '#vat': 'vat',
              '#vatProperty': 'paid',
            },
            ExpressionAttributeValues: {
              ':balance': 100.25,
              ':updatedAt': '2020-06-06T19:45:00.000Z',
              ':vat': 1.2,
            },
            Key: {
              __typename: 'Balance',
              id: 'company-id',
            },
            TableName: 'test',
            UpdateExpression:
              'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
          },
        },
      ]) as TransactWriteCommandInput['TransactItems'],
    });

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        {
          Update: {
            ConditionExpression: 'attribute_exists(id)',
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#itemProperty': '2019-12-15T00:00:00.000Z',
              '#items': 'items',
              '#updatedAt': 'updatedAt',
              '#vat': 'vat',
              '#vatProperty': 'owed',
            },
            ExpressionAttributeValues: {
              ':balance': 100.25,
              ':updatedAt': '2020-06-06T19:45:00.000Z',
              ':vat': 1.2,
            },
            Key: {
              __typename: 'Balance',
              id: 'company-id',
            },
            TableName: 'test',
            UpdateExpression:
              'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
          },
        },
      ]) as TransactWriteCommandInput['TransactItems'],
    });

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        {
          Update: {
            ConditionExpression: 'attribute_exists(id)',
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#itemProperty': '2019-12-15T00:00:00.000Z',
              '#items': 'items',
              '#updatedAt': 'updatedAt',
              '#vat': 'vat',
              '#vatProperty': 'owed',
            },
            ExpressionAttributeValues: {
              ':balance': 100.25,
              ':updatedAt': '2020-06-06T19:45:00.000Z',
              ':vat': 100.25,
            },
            Key: {
              __typename: 'Balance',
              id: 'company-id',
            },
            TableName: 'test',
            UpdateExpression:
              'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
          },
        },
      ]) as TransactWriteCommandInput['TransactItems'],
    });
  });

  it('should call update the correct number of times', async () => {
    await Promise.all(
      insertTransactions(documentClient, tableName, records).map((write) =>
        write(),
      ),
    );

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 3);
  });

  it('should record the stream event with the balance update', async () => {
    await Promise.all(
      insertTransactions(documentClient, tableName, records).map((write) =>
        write(),
      ),
    );

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(id)',
            Item: {
              __typename: 'BalanceEvent',
              id: 'event-1',
              ttl: 1592077500,
            },
            TableName: 'test',
          },
        },
      ]) as TransactWriteCommandInput['TransactItems'],
    });
  });

  it.each([
    ['the event was already applied', ['ConditionalCheckFailed', 'None']],
    ['the balance no longer exists', ['None', 'ConditionalCheckFailed']],
  ])('should skip the update when %s', async (_, codes) => {
    ddb.on(TransactWriteCommand).rejects(
      new TransactionCanceledException({
        $metadata: {},
        CancellationReasons: codes.map((Code) => ({
          Code,
        })),
        message: 'Transaction cancelled',
      }),
    );

    await expect(
      Promise.all(
        insertTransactions(documentClient, tableName, records).map((write) =>
          write(),
        ),
      ),
    ).resolves.toHaveLength(3);
  });

  it('should throw when the update fails for any other reason', async () => {
    const error = new TransactionCanceledException({
      $metadata: {},
      CancellationReasons: [
        {
          Code: 'None',
        },
        {
          Code: 'TransactionConflict',
        },
      ],
      message: 'Transaction cancelled',
    });

    ddb.on(TransactWriteCommand).rejects(error);

    await expect(
      Promise.all(
        insertTransactions(documentClient, tableName, records).map((write) =>
          write(),
        ),
      ),
    ).rejects.toThrow(error);
  });
});
