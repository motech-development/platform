import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import insertTypeahead from '../insert-typeahead';

describe('insert-typeahead', () => {
  let ddb: AwsClientStub<DynamoDBClient>;
  let documentClient: DynamoDBClient;
  let tableName: string;
  let records: DynamoDBRecord[];

  beforeAll(() => {
    vi.setSystemTime(new Date('2020-06-06T19:45:00+00:00'));
  });

  beforeEach(() => {
    ddb = mockClient(DynamoDBClient);

    ddb.on(GetCommand).resolves({});

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
            description: {
              S: 'Description 1',
            },
            name: {
              S: 'Transaction 1',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 1',
            },
            name: {
              S: 'Transaction 1',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 2',
            },
            name: {
              S: 'Transaction 2',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 2',
            },
            name: {
              S: 'Transaction 2',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 3',
            },
            name: {
              S: 'Transaction 3',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 3',
            },
            name: {
              S: 'Transaction 3',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 4',
            },
            name: {
              S: 'Transaction 4',
            },
            owner: {
              S: 'owner-id',
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
            description: {
              S: 'Description 4',
            },
            name: {
              S: 'Transaction 4',
            },
            owner: {
              S: 'owner-id',
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

  it('should merge transaction suggestions in one sorted company update', async () => {
    await Promise.all(insertTypeahead(documentClient, tableName, records));

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ConditionExpression: 'attribute_not_exists(#id)',
      ExpressionAttributeValues: {
        ':data': 'owner-id:company-id:Typeahead',
        ':groupsCanAccess': ['Admin'],
        ':now': '2020-06-06T19:45:00.000Z',
        ':owner': 'owner-id',
        ':purchases': ['Description 1', 'Description 4'],
        ':sales': ['Description 2', 'Description 3'],
        ':suppliers': ['Transaction 1', 'Transaction 4'],
      },
      Key: { __typename: 'Typeahead', id: 'company-id' },
      TableName: tableName,
    });
  });

  it('should call update the correct number of times', async () => {
    await Promise.all(insertTypeahead(documentClient, tableName, records));

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 1);
  });
});
