import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue, DynamoDBRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import updateTransactions from '../update-transactions';

describe('update-transactions', () => {
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '2.4',
            },
          },
        },
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'pending',
            },
            vat: {
              N: '2.4',
            },
          },
        },
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '2.4',
            },
          },
        },
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'pending',
            },
            vat: {
              N: '2.4',
            },
          },
        },
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'pending',
            },
            vat: {
              N: '0',
            },
          },
        },
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
              S: 'pending',
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
              S: '2019-12-14T00:00:00.000Z',
            },
            status: {
              S: 'confirmed',
            },
            vat: {
              N: '0',
            },
          },
        },
      },
    ];
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return update with the correct params', async () => {
    await Promise.all(updateTransactions(documentClient, tableName, records));

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemProperty': '2019-12-15T00:00:00.000Z',
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': 'paid',
      },
      ExpressionAttributeValues: {
        ':balance': -100.25,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
        ':vat': -1.2,
      },
      Key: {
        __typename: 'Balance',
        id: 'company-id',
      },
      TableName: 'test',
      UpdateExpression:
        'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemPropertyNew': '2019-12-15T00:00:00.000Z',
        '#itemPropertyOld': '2019-12-14T00:00:00.000Z',
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': 'owed',
      },
      ExpressionAttributeValues: {
        ':balance': -100.25,
        ':itemPropertyNew': 100.25,
        ':itemPropertyOld': 200.5,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
        ':vat': -1.2,
      },
      Key: {
        __typename: 'Balance',
        id: 'company-id',
      },
      TableName: 'test',
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemPropertyNew :itemPropertyNew',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemProperty': '2019-12-14T00:00:00.000Z',
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': 'owed',
      },
      ExpressionAttributeValues: {
        ':balance': 200.5,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
        ':vat': 2.4,
      },
      Key: {
        __typename: 'Balance',
        id: 'company-id',
      },
      TableName: 'test',
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
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
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemProperty': '2019-12-14T00:00:00.000Z',
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': 'owed',
      },
      ExpressionAttributeValues: {
        ':balance': 200.5,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
        ':vat': 200.5,
      },
      Key: {
        __typename: 'Balance',
        id: 'company-id',
      },
      TableName: 'test',
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
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
    });
  });

  describe.each([
    ['VAT payment', 'Expenses', 'owed', 'paid', -100.25, -40.1],
    ['Expenses', 'VAT payment', 'paid', 'owed', -20.05, -200.5],
  ])(
    'reclassifying %s to %s',
    (oldCategory, newCategory, oldBucket, newBucket, oldVat, newVat) => {
      it.each(['2019-12-14T00:00:00.000Z', '2019-12-15T00:00:00.000Z'])(
        'should reverse the old VAT contribution and book the new one on %s',
        async (date) => {
          const oldDate = '2019-12-14T00:00:00.000Z';
          const oldRecord = {
            __typename: 'Transaction',
            amount: -100.25,
            category: oldCategory,
            companyId: 'company-id',
            date: oldDate,
            status: 'confirmed',
            vat: -20.05,
          };
          const newRecord = {
            ...oldRecord,
            amount: -200.5,
            category: newCategory,
            date,
            vat: -40.1,
          };

          await Promise.all(
            updateTransactions(documentClient, tableName, [
              {
                dynamodb: {
                  NewImage: marshall(newRecord) as Record<
                    string,
                    AttributeValue
                  >,
                  OldImage: marshall(oldRecord) as Record<
                    string,
                    AttributeValue
                  >,
                },
              },
            ]),
          );

          expect(ddb).toReceiveCommandTimes(UpdateCommand, 1);
          expect(ddb).toReceiveCommandWith(UpdateCommand, {
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#items': 'items',
              ...(date === oldDate
                ? { '#itemProperty': date }
                : { '#itemPropertyNew': date, '#itemPropertyOld': oldDate }),
              '#updatedAt': 'updatedAt',
              '#vat': 'vat',
              '#vatPropertyNew': newBucket,
              '#vatPropertyOld': oldBucket,
            },
            ExpressionAttributeValues: {
              ':balance': -100.25,
              ...(date === oldDate
                ? {}
                : { ':itemPropertyNew': -200.5, ':itemPropertyOld': -100.25 }),
              ':updatedAt': '2020-06-06T19:45:00.000Z',
              ':vatNew': newVat,
              ':vatOld': oldVat,
            },
            Key: { __typename: 'Balance', id: 'company-id' },
            TableName: tableName,
            UpdateExpression:
              date === oldDate
                ? 'SET #updatedAt = :updatedAt, #vat.#vatPropertyOld = #vat.#vatPropertyOld - :vatOld ADD #balance :balance, #vat.#vatPropertyNew :vatNew, #items.#itemProperty :balance'
                : 'SET #updatedAt = :updatedAt, #vat.#vatPropertyOld = #vat.#vatPropertyOld - :vatOld, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatPropertyNew :vatNew, #items.#itemPropertyNew :itemPropertyNew',
          });
        },
      );
    },
  );

  it('should call update the correct number of times', async () => {
    await Promise.all(updateTransactions(documentClient, tableName, records));

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 6);
  });
});
