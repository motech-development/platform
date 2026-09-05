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

  it('should retain existing suggestions and condition the merge on the stored values', async () => {
    const existing = {
      owner: 'owner-id',
      purchases: ['Older purchase', 'Description 1', 'Description 1'],
      sales: ['Older sale'],
      suppliers: ['Older supplier'],
    };

    ddb.on(GetCommand).resolves({ Item: existing });

    await Promise.all(insertTypeahead(documentClient, tableName, records));

    expect(ddb).toReceiveCommandWith(GetCommand, {
      ConsistentRead: true,
      Key: { __typename: 'Typeahead', id: 'company-id' },
      TableName: tableName,
    });
    expect(ddb).toReceiveCommandWith(UpdateCommand, {
      ConditionExpression:
        '#owner = :owner AND #purchases = :oldpurchases AND #sales = :oldsales AND #suppliers = :oldsuppliers',
      ExpressionAttributeValues: {
        ':data': 'owner-id:company-id:Typeahead',
        ':groupsCanAccess': ['Admin'],
        ':now': '2020-06-06T19:45:00.000Z',
        ':oldpurchases': existing.purchases,
        ':oldsales': existing.sales,
        ':oldsuppliers': existing.suppliers,
        ':owner': 'owner-id',
        ':purchases': ['Description 1', 'Description 4', 'Older purchase'],
        ':sales': ['Description 2', 'Description 3', 'Older sale'],
        ':suppliers': ['Older supplier', 'Transaction 1', 'Transaction 4'],
      },
      Key: { __typename: 'Typeahead', id: 'company-id' },
      TableName: tableName,
    });
  });

  it('should not write suggestions again when a stream event is replayed', async () => {
    ddb.on(GetCommand).resolves({
      Item: {
        owner: 'owner-id',
        purchases: ['Description 1', 'Description 4'],
        sales: ['Description 2', 'Description 3'],
        suppliers: ['Transaction 1', 'Transaction 4'],
      },
    });

    await Promise.all(insertTypeahead(documentClient, tableName, records));

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 0);
  });

  it('should reject updates to a typeahead record belonging to another owner', async () => {
    ddb.on(GetCommand).resolves({ Item: { owner: 'other-owner' } });

    await expect(
      Promise.all(insertTypeahead(documentClient, tableName, records)),
    ).rejects.toThrow('Typeahead owner does not match transaction owner');
    expect(ddb).toReceiveCommandTimes(UpdateCommand, 0);
  });

  it('should reject a batch containing different owners for the same company', () => {
    const otherOwner: DynamoDBRecord = {
      dynamodb: {
        NewImage: {
          __typename: { S: 'Transaction' },
          companyId: { S: 'company-id' },
          owner: { S: 'other-owner' },
        },
      },
    };

    expect(() =>
      insertTypeahead(documentClient, tableName, [...records, otherOwner]),
    ).toThrow('Transactions for a company must have the same owner');
    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
    expect(ddb).toReceiveCommandTimes(UpdateCommand, 0);
  });
});
