import {
  DynamoDBClient,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import type { Context, DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { mutation as transactionChangeMutation } from '../../shared/publish-transaction-change';
import { mutation } from '../../shared/update-balance';
import { handler } from '../publish-stream';

const transaction = {
  __typename: 'Transaction',
  amount: 100,
  attachment: '',
  category: 'Sales',
  companyId: 'company-id',
  date: '2026-09-06T00:00:00.000Z',
  description: 'Description',
  id: 'transaction-id',
  name: 'Name',
  owner: 'owner-id',
  status: 'confirmed',
  vat: 20,
};

const balance = {
  __typename: 'Balance',
  balance: 100,
  id: 'company-id',
  items: {
    '2026-09-06T00:00:00.000Z': 100,
  },
  owner: 'owner-id',
  vat: {
    owed: 20,
    paid: 0,
  },
};

const record = (
  eventName: DynamoDBRecord['eventName'],
  previous: object | undefined,
  current: object | undefined,
): DynamoDBRecord => ({
  dynamodb: {
    ...(previous
      ? {
          OldImage: marshall(previous) as StreamRecord['OldImage'],
        }
      : {}),
    ...(current
      ? {
          NewImage: marshall(current) as StreamRecord['NewImage'],
        }
      : {}),
    SequenceNumber: '100',
  },
  eventID: 'event-id',
  eventName,
});

const invoke = (records: DynamoDBRecord[]) =>
  handler(
    {
      Records: records,
    },
    {} as Context,
    vi.fn(),
  );

const balancePush = {
  mutation,
  variables: {
    id: 'company-id',
    input: {
      balance: 100,
      vat: {
        owed: 20,
        paid: 0,
      },
    },
    owner: 'owner-id',
  },
};

describe('publish-stream', () => {
  const mutate = vi.mocked(AWSAppSyncClient.prototype.mutate);
  let ddb: AwsClientStub<DynamoDBClient>;

  beforeEach(() => {
    vi.stubEnv('AWS_REGION', 'eu-west-2');
    vi.stubEnv('ENDPOINT', 'https://my.api/graphql');
    vi.stubEnv('TABLE', 'app-table');
    mutate.mockReset();
    mutate.mockResolvedValue({
      data: {},
    });
    vi.mocked(logger.error).mockClear();
    ddb = mockClient(DynamoDBClient);
    ddb.on(GetCommand).resolves({
      Item: balance,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['region', 'AWS_REGION', 'No region set'],
    ['endpoint', 'ENDPOINT', 'No endpoint set'],
    ['table', 'TABLE', 'No table set'],
  ])('should throw an error if no %s is set', async (_, name, message) => {
    vi.stubEnv(name, '');

    await expect(invoke([])).rejects.toThrow(message);
  });

  it('applies a confirmed transaction to its balance once, keyed by the stream event', async () => {
    await invoke([record('INSERT', undefined, transaction)]);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 1);
    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(id)',
            Item: {
              __typename: 'BalanceEvent',
              id: 'event-id',
              ttl: expect.any(Number) as number,
            },
            TableName: 'app-table',
          },
        },
        expect.objectContaining({
          Update: expect.objectContaining({
            Key: {
              __typename: 'Balance',
              id: 'company-id',
            },
          }) as unknown,
        }),
      ]) as never,
    });
  });

  it.each([
    ['created', record('INSERT', undefined, transaction)],
    [
      'edited',
      record('MODIFY', transaction, {
        ...transaction,
        amount: 50,
      }),
    ],
    ['deleted', record('REMOVE', transaction, undefined)],
    [
      'published',
      record(
        'MODIFY',
        {
          ...transaction,
          status: 'pending',
        },
        transaction,
      ),
    ],
    [
      'unconfirmed',
      record('MODIFY', transaction, {
        ...transaction,
        status: 'pending',
      }),
    ],
  ])(
    'pushes the stored balance when a confirmed transaction is %s',
    async (_, change) => {
      await invoke([change]);

      expect(ddb).toReceiveCommandWith(GetCommand, {
        ConsistentRead: true,
        Key: {
          __typename: 'Balance',
          id: 'company-id',
        },
        TableName: 'app-table',
      });
      expect(mutate).toHaveBeenNthCalledWith(1, balancePush);
      expect(mutate).toHaveBeenNthCalledWith(2, {
        mutation: transactionChangeMutation,
        variables: {
          id: 'company-id',
          owner: 'owner-id',
          transactionId: 'transaction-id',
        },
      });
    },
  );

  it('pushes the balance when the record was already applied', async () => {
    ddb.on(TransactWriteCommand).rejects(
      new TransactionCanceledException({
        $metadata: {},
        CancellationReasons: [
          {
            Code: 'ConditionalCheckFailed',
          },
        ],
        message: 'Transaction cancelled',
      }),
    );

    await expect(
      invoke([record('INSERT', undefined, transaction)]),
    ).resolves.toEqual({
      batchItemFailures: [],
    });

    expect(mutate).toHaveBeenCalledWith(balancePush);
  });

  it.each([
    [
      'created as pending',
      record('INSERT', undefined, {
        ...transaction,
        status: 'pending',
      }),
    ],
    [
      'edited while pending',
      record(
        'MODIFY',
        {
          ...transaction,
          status: 'pending',
        },
        {
          ...transaction,
          amount: 50,
          status: 'pending',
        },
      ),
    ],
    [
      'deleted while pending',
      record(
        'REMOVE',
        {
          ...transaction,
          status: 'pending',
        },
        undefined,
      ),
    ],
  ])('leaves the balance alone when a transaction is %s', async (_, change) => {
    await invoke([change]);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 0);
    expect(mutate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        mutation,
      }),
    );
  });

  it('pushes both balances when a confirmed transaction changes company', async () => {
    ddb
      .on(GetCommand, {
        Key: {
          __typename: 'Balance',
          id: 'other-company',
        },
      })
      .resolves({
        Item: {
          ...balance,
          id: 'other-company',
        },
      });

    await invoke([
      record('MODIFY', transaction, {
        ...transaction,
        data: `owner-id:other-company:confirmed:${transaction.date}`,
      }),
    ]);

    expect(mutate).toHaveBeenCalledWith(balancePush);
    expect(mutate).toHaveBeenCalledWith({
      ...balancePush,
      variables: {
        ...balancePush.variables,
        id: 'other-company',
      },
    });
  });

  it('does not push a balance that cannot be read back', async () => {
    ddb.on(GetCommand).resolves({});

    await expect(
      invoke([record('INSERT', undefined, transaction)]),
    ).resolves.toEqual({
      batchItemFailures: [],
    });

    expect(mutate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        mutation,
      }),
    );
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it.each([
    ['missing id', 'id', undefined],
    ['empty owner', 'owner', ''],
    ['invalid owner', 'owner', 123],
    ['invalid balance', 'balance', '100'],
    ['null VAT', 'vat', null],
    [
      'invalid VAT owed',
      'vat',
      {
        owed: '20',
        paid: 0,
      },
    ],
    [
      'missing VAT paid',
      'vat',
      {
        owed: 20,
      },
    ],
  ] as const)(
    'skips a stored balance with %s and still publishes the transaction change',
    async (_, field, value) => {
      const malformed: Record<string, unknown> = {
        ...balance,
        [field]: value,
      };

      if (value === undefined) Reflect.deleteProperty(malformed, field);

      ddb.on(GetCommand).resolves({
        Item: malformed,
      });

      await expect(
        invoke([record('INSERT', undefined, transaction)]),
      ).resolves.toEqual({
        batchItemFailures: [],
      });

      expect(mutate).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          mutation: transactionChangeMutation,
        }),
      );
      expect(logger.error).toHaveBeenCalledOnce();
    },
  );

  it('pushes only supported VAT fields from the stored balance', async () => {
    ddb.on(GetCommand).resolves({
      Item: {
        ...balance,
        vat: {
          legacy: true,
          owed: 20,
          paid: 0,
        },
      },
    });

    await invoke([record('INSERT', undefined, transaction)]);

    expect(mutate).toHaveBeenCalledWith(balancePush);
  });

  it('does not publish balance writes', async () => {
    await expect(invoke([record('MODIFY', balance, balance)])).resolves.toEqual(
      {
        batchItemFailures: [],
      },
    );

    expect(mutate).not.toHaveBeenCalled();
  });

  it('retries the record when the balance cannot be applied', async () => {
    ddb.on(TransactWriteCommand).rejects(new Error('DynamoDB unavailable'));

    await expect(
      invoke([record('INSERT', undefined, transaction)]),
    ).resolves.toEqual({
      batchItemFailures: [
        {
          itemIdentifier: '100',
        },
      ],
    });

    expect(mutate).not.toHaveBeenCalled();
  });

  it('fails the batch when a failed record has no sequence number', async () => {
    mutate.mockRejectedValueOnce(new Error('Something has gone wrong'));

    const change = record('INSERT', undefined, transaction);

    delete change.dynamodb?.SequenceNumber;

    await expect(invoke([change])).rejects.toThrow('Something has gone wrong');
  });
});
