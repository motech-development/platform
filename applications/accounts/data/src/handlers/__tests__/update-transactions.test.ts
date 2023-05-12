import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import updateTransactions from '../update-transactions';

describe('update-transactions', () => {
  let ddb: AwsStub<ServiceInputTypes, ServiceOutputTypes>;
  let documentClient: DynamoDBClient;
  let tableName: string;
  let records: DynamoDBRecord[];

  beforeAll(() => {
    advanceTo('2020-06-06T19:45:00+00:00');
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
    clear();
  });

  it('should return update with the correct params', () => {
    updateTransactions(documentClient, tableName, records);

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

  it('should call update the correct number of times', () => {
    updateTransactions(documentClient, tableName, records);

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 6);
  });
});
