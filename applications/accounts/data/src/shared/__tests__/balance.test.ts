import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type {
  GetCommandInput,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { insert, remove, update } from '../balance';
import { ITransaction, TransactionStatus } from '../transaction';

describe('balance projection', () => {
  let ddb: AwsClientStub<DynamoDBClient>;
  let documentClient: DynamoDBClient;
  let identity: { eventID: string; eventSourceARN: string };
  let record: ITransaction;

  beforeEach(() => {
    ddb = mockClient(DynamoDBClient);
    documentClient = new DynamoDBClient({});
    identity = {
      eventID: 'event-1',
      eventSourceARN:
        'arn:aws:dynamodb:eu-west-1:123456789012:table/accounts/stream/2020-06-06T19:45:00.000',
    };
    record = {
      __typename: 'Transaction',
      amount: 100.25,
      attachment: '',
      category: 'Sales',
      companyId: 'company-1',
      date: '2020-06-06T00:00:00.000Z',
      description: 'Sale',
      id: 'transaction-1',
      name: 'Customer',
      owner: 'owner-1',
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 20.05,
    };
  });

  afterEach(() => {
    ddb.restore();
  });

  it('atomically stores a source-scoped event marker with the balance change', async () => {
    await insert(documentClient, 'accounts', identity, record);

    const { TransactItems } =
      ddb.commandCalls(TransactWriteCommand)[0].args[0].input;

    expect(TransactItems).toHaveLength(2);
    expect(TransactItems?.[0]?.Put).toMatchObject({
      ConditionExpression: 'attribute_not_exists(#id)',
      Item: {
        __typename: 'BalanceProjectionEvent',
        eventID: identity.eventID,
        eventName: 'INSERT',
        eventSourceARN: identity.eventSourceARN,
      },
      TableName: 'accounts',
    });
    expect(TransactItems?.[1]?.Update).toMatchObject({
      Key: {
        __typename: 'Balance',
        id: record.companyId,
      },
      TableName: 'accounts',
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #vat.#vatProperty = if_not_exists(#vat.#vatProperty, :zero) + :vat, #items.#itemProperty = if_not_exists(#items.#itemProperty, :zero) + :balance ADD #balance :balance',
    });
  });

  it('applies a concurrent replay only once', async () => {
    let marker: Record<string, unknown> | undefined;

    ddb
      .on(TransactWriteCommand)
      .callsFake((input: TransactWriteCommandInput) => {
        const put = input.TransactItems?.[0]?.Put;

        if (marker) {
          throw new Error('ConditionalCheckFailedException');
        }

        marker = put?.Item as Record<string, unknown> | undefined;

        return {};
      });
    ddb
      .on(GetCommand)
      .callsFake((input: GetCommandInput) =>
        String(input.Key?.__typename) === 'BalanceProjectionEvent'
          ? { Item: marker }
          : {},
      );

    const results = await Promise.all([
      insert(documentClient, 'accounts', identity, record),
      insert(documentClient, 'accounts', identity, record),
    ]);

    expect(ddb.commandCalls(TransactWriteCommand)).toHaveLength(2);
    expect(ddb.commandCalls(GetCommand)).toHaveLength(1);
    expect(results.filter((result) => result === undefined)).toHaveLength(1);

    const markerIds = ddb
      .commandCalls(TransactWriteCommand)
      .map(({ args: [command] }) =>
        String(command.input.TransactItems?.[0]?.Put?.Item?.id),
      );

    expect(markerIds[0]).toBe(markerIds[1]);
  });

  it('scopes a marker to both the stream ARN and event ID', async () => {
    await Promise.all([
      insert(documentClient, 'accounts', identity, record),
      insert(
        documentClient,
        'accounts',
        {
          ...identity,
          eventSourceARN: `${identity.eventSourceARN}-replacement`,
        },
        record,
      ),
    ]);

    const markerIds = ddb
      .commandCalls(TransactWriteCommand)
      .map(({ args: [command] }) =>
        String(command.input.TransactItems?.[0]?.Put?.Item?.id),
      );

    expect(markerIds[0]).not.toBe(markerIds[1]);
  });

  it('applies the same atomic marker operation to confirmed updates and deletes', async () => {
    const updatedRecord = {
      ...record,
      amount: 150.5,
      vat: 30.1,
    };

    await update(documentClient, 'accounts', identity, record, updatedRecord);
    await remove(
      documentClient,
      'accounts',
      {
        ...identity,
        eventID: 'event-delete',
      },
      updatedRecord,
    );

    const eventNames = ddb
      .commandCalls(TransactWriteCommand)
      .map(({ args: [command] }) =>
        String(command.input.TransactItems?.[0]?.Put?.Item?.eventName),
      );

    expect(eventNames).toEqual(['MODIFY', 'REMOVE']);
    expect(
      ddb.commandCalls(TransactWriteCommand)[0].args[0].input.TransactItems,
    ).toHaveLength(2);
    expect(
      ddb.commandCalls(TransactWriteCommand)[1].args[0].input.TransactItems,
    ).toHaveLength(2);
  });

  it('propagates projection errors when no matching event marker exists', async () => {
    const error = new Error('Balance update rejected');

    ddb.on(TransactWriteCommand).rejectsOnce(error);
    ddb.on(GetCommand).resolves({});

    await expect(
      insert(documentClient, 'accounts', identity, record),
    ).rejects.toBe(error);
  });

  it('records a delete without recreating a balance that company deletion removed', async () => {
    const error = new Error('Balance item does not exist');
    let calls = 0;

    ddb.on(TransactWriteCommand).callsFake(() => {
      calls += 1;

      if (calls === 1) {
        throw error;
      }

      return {};
    });
    ddb.on(GetCommand).resolves({});

    await remove(documentClient, 'accounts', identity, record);

    expect(ddb.commandCalls(TransactWriteCommand)).toHaveLength(2);
    const { TransactItems } =
      ddb.commandCalls(TransactWriteCommand)[1].args[0].input;

    expect(TransactItems?.[0]?.Put?.Item?.__typename).toBe(
      'BalanceProjectionEvent',
    );
    expect(TransactItems?.[1]?.ConditionCheck?.ConditionExpression).toBe(
      'attribute_not_exists(#id)',
    );
    expect(TransactItems?.[1]?.ConditionCheck?.Key).toEqual({
      __typename: 'Balance',
      id: record.companyId,
    });
  });
});
