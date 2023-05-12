import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import updateScheduledTransactions from '../update-scheduled-transactions';

describe('update-scheduled-transactions', () => {
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
            id: {
              S: 'transaction-1',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
            id: {
              S: 'transaction-1',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
            id: {
              S: 'transaction-2',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: true,
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
            id: {
              S: 'transaction-2',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
            id: {
              S: 'transaction-3',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
            id: {
              S: 'transaction-3',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: true,
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
            id: {
              S: 'transaction-4',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
              S: '2019-12-15T00:00:00.000Z',
            },
            id: {
              S: 'transaction-4',
            },
            owner: {
              S: 'owner',
            },
            scheduled: {
              BOOL: false,
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
    ];
  });

  afterAll(() => {
    clear();
  });

  it('should return update with the correct params', () => {
    updateScheduledTransactions(documentClient, tableName, records);

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#active': 'active',
        '#data': 'data',
        '#ttl': 'ttl',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':active': false,
        ':data': 'owner:company-id:active:1591472700',
        ':ttl': 1591472700,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
      },
      Key: {
        __typename: 'ScheduledTransaction',
        id: 'transaction-1',
      },
      TableName: tableName,
      UpdateExpression:
        'SET #active = :active, #data = :data, #ttl = :ttl, #updatedAt = :updatedAt',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ExpressionAttributeNames: {
        '#active': 'active',
        '#companyId': 'companyId',
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#date': 'date',
        '#owner': 'owner',
        '#ttl': 'ttl',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':active': true,
        ':companyId': 'company-id',
        ':createdAt': '2020-06-06T19:45:00.000Z',
        ':data': 'owner:company-id:active:1576368000',
        ':date': '2019-12-15T00:00:00.000Z',
        ':owner': 'owner',
        ':ttl': 1576368000,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
      },
      Key: {
        __typename: 'ScheduledTransaction',
        id: 'transaction-2',
      },
      TableName: tableName,
      UpdateExpression:
        'SET #active = :active, #companyId = :companyId, #createdAt = if_not_exists(#createdAt, :createdAt), #data = :data, #date = :date, #owner = :owner, #ttl = :ttl, #updatedAt = :updatedAt',
    });

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#active': 'active',
        '#data': 'data',
        '#ttl': 'ttl',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':active': false,
        ':data': 'owner:company-id:active:1591472700',
        ':ttl': 1591472700,
        ':updatedAt': '2020-06-06T19:45:00.000Z',
      },
      Key: {
        __typename: 'ScheduledTransaction',
        id: 'transaction-3',
      },
      TableName: tableName,
      UpdateExpression:
        'SET #active = :active, #data = :data, #ttl = :ttl, #updatedAt = :updatedAt',
    });
  });

  it('should call update the correct number of times', () => {
    updateScheduledTransactions(documentClient, tableName, records);

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 3);
  });
});
