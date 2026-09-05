import { marshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import type { Context, DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { mutation } from '../../shared/publish-transaction-change';
import { mutation as balanceMutation } from '../../shared/update-balance';
import { handler } from '../update-balance';

const transaction = {
  __typename: 'Transaction',
  amount: 100,
  attachment: 'company-id/receipt.pdf',
  companyId: 'company-id',
  description: 'Original description',
  id: 'transaction-id',
  owner: 'owner-id',
  status: 'pending',
  vat: 20,
};

const record = (
  eventName: DynamoDBRecord['eventName'],
  previous: object | undefined,
  current: object | undefined,
  sequenceNumber = '100',
): DynamoDBRecord => ({
  dynamodb: {
    ...(previous
      ? { OldImage: marshall(previous) as StreamRecord['OldImage'] }
      : {}),
    ...(current
      ? { NewImage: marshall(current) as StreamRecord['NewImage'] }
      : {}),
    SequenceNumber: sequenceNumber,
  },
  eventName,
});

const invoke = (records: DynamoDBRecord[]) =>
  handler({ Records: records }, {} as Context, vi.fn());

describe('transaction stream events', () => {
  const mutate = vi.mocked(AWSAppSyncClient.prototype.mutate);

  beforeEach(() => {
    vi.stubEnv('AWS_REGION', 'eu-west-2');
    vi.stubEnv('ENDPOINT', 'https://my.api/graphql');
    mutate.mockReset();
    mutate.mockResolvedValue({ data: {} });
    vi.mocked(logger.error).mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['create', record('INSERT', undefined, transaction)],
    [
      'edit',
      record('MODIFY', transaction, { ...transaction, description: 'Edited' }),
    ],
    ['delete', record('REMOVE', transaction, undefined)],
    [
      'attach',
      record('MODIFY', transaction, {
        ...transaction,
        attachment: 'company-id/new.pdf',
      }),
    ],
    [
      'detach',
      record('MODIFY', transaction, { ...transaction, attachment: '' }),
    ],
    [
      'publish',
      record('MODIFY', transaction, { ...transaction, status: 'confirmed' }),
    ],
    [
      'unconfirm',
      record('MODIFY', { ...transaction, status: 'confirmed' }, transaction),
    ],
  ])(
    'publishes a scoped invalidation for a Pending %s without balance values',
    async (_, change) => {
      await expect(invoke([change])).resolves.toEqual({
        batchItemFailures: [],
      });

      expect(mutate).toHaveBeenCalledExactlyOnceWith({
        mutation,
        variables: { id: 'company-id', owner: 'owner-id' },
      });
    },
  );

  it('invalidates both scopes when a transaction moves', async () => {
    await invoke([
      record('MODIFY', transaction, {
        ...transaction,
        companyId: 'another-company',
        owner: 'another-owner',
      }),
    ]);

    expect(mutate).toHaveBeenNthCalledWith(1, {
      mutation,
      variables: { id: 'company-id', owner: 'owner-id' },
    });
    expect(mutate).toHaveBeenNthCalledWith(2, {
      mutation,
      variables: { id: 'another-company', owner: 'another-owner' },
    });
  });

  it('replays the same invalidation on duplicate delivery without balance mutations', async () => {
    const change = record('INSERT', undefined, transaction);
    await invoke([change]);
    await invoke([change]);

    expect(mutate).toHaveBeenCalledTimes(2);
    expect(mutate.mock.calls[0]).toEqual(mutate.mock.calls[1]);
    expect(mutate).not.toHaveBeenCalledWith(
      expect.objectContaining({ mutation: balanceMutation }),
    );
  });

  it('publishes a repaired transaction without retrying its malformed previous scope', async () => {
    await expect(
      invoke([record('MODIFY', { ...transaction, owner: 123 }, transaction)]),
    ).resolves.toEqual({ batchItemFailures: [] });

    expect(mutate).toHaveBeenCalledExactlyOnceWith({
      mutation,
      variables: { id: 'company-id', owner: 'owner-id' },
    });
  });

  it('keeps the existing balance event payload', async () => {
    const balance = {
      __typename: 'Balance',
      balance: 100,
      id: 'company-id',
      owner: 'owner-id',
      vat: { owed: 20, paid: 0 },
    };
    await invoke([record('MODIFY', balance, balance)]);

    expect(mutate).toHaveBeenCalledExactlyOnceWith({
      mutation: balanceMutation,
      variables: {
        id: 'company-id',
        input: { balance: 100, vat: { owed: 20, paid: 0 } },
        owner: 'owner-id',
      },
    });
  });

  it.each(['Transaction', 'Balance'])(
    'retries from a failed %s publication before processing later records',
    async (typename) => {
      const item =
        typename === 'Transaction'
          ? transaction
          : {
              __typename: 'Balance',
              balance: 100,
              id: 'company-id',
              owner: 'owner-id',
              vat: { owed: 20, paid: 0 },
            };
      const changes = [
        record('INSERT', undefined, transaction, '100'),
        record('MODIFY', item, item, '101'),
        record('REMOVE', transaction, undefined, '102'),
      ];
      mutate
        .mockResolvedValueOnce({ data: {} })
        .mockRejectedValueOnce(new Error('AppSync unavailable'));

      await expect(invoke(changes)).resolves.toEqual({
        batchItemFailures: [{ itemIdentifier: '101' }],
      });
      expect(mutate).toHaveBeenCalledTimes(2);

      await expect(invoke(changes.slice(1))).resolves.toEqual({
        batchItemFailures: [],
      });
      expect(mutate).toHaveBeenCalledTimes(4);
      expect(mutate.mock.calls[1]).toEqual(mutate.mock.calls[2]);
    },
  );

  it.each([
    ['missing company', 'companyId', undefined],
    ['empty company', 'companyId', ''],
    ['invalid company', 'companyId', 123],
    ['missing owner', 'owner', undefined],
    ['empty owner', 'owner', ''],
    ['invalid owner', 'owner', 123],
  ] as const)(
    'skips a transaction with %s and continues publishing later records',
    async (_, field, value) => {
      const malformed = { ...transaction, [field]: value };
      if (value === undefined) Reflect.deleteProperty(malformed, field);

      await expect(
        invoke([
          record('INSERT', undefined, malformed, '100'),
          record('INSERT', undefined, transaction, '101'),
          record(
            'MODIFY',
            undefined,
            {
              __typename: 'Balance',
              balance: 100,
              id: 'company-id',
              owner: 'owner-id',
              vat: { owed: 20, paid: 0 },
            },
            '102',
          ),
        ]),
      ).resolves.toEqual({ batchItemFailures: [] });

      expect(logger.error).toHaveBeenCalledOnce();
      expect(mutate).toHaveBeenCalledTimes(2);
      expect(mutate).toHaveBeenNthCalledWith(1, {
        mutation,
        variables: { id: 'company-id', owner: 'owner-id' },
      });
      expect(mutate).toHaveBeenNthCalledWith(2, {
        mutation: balanceMutation,
        variables: {
          id: 'company-id',
          input: { balance: 100, vat: { owed: 20, paid: 0 } },
          owner: 'owner-id',
        },
      });
    },
  );

  it('ignores unrelated records and balance creation', async () => {
    await expect(
      invoke([
        record('INSERT', undefined, { __typename: 'Balance' }),
        record('MODIFY', undefined, { __typename: 'Notification' }),
        { eventName: 'MODIFY' },
      ]),
    ).resolves.toEqual({ batchItemFailures: [] });
    expect(mutate).not.toHaveBeenCalled();
  });

  it('publishes the Pending MODIFY record produced by attachment cleanup', async () => {
    const { attachment: removedAttachment, ...updated } = transaction;
    expect(removedAttachment).toBe('company-id/receipt.pdf');

    await expect(
      invoke([record('MODIFY', transaction, updated)]),
    ).resolves.toEqual({ batchItemFailures: [] });
    expect(mutate).toHaveBeenCalledExactlyOnceWith({
      mutation,
      variables: { id: 'company-id', owner: 'owner-id' },
    });
  });
});
