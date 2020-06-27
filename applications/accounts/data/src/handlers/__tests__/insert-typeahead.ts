import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { advanceTo, clear } from 'jest-date-mock';
import insertTypeahead from '../insert-typeahead';

describe('insert-typeahead', () => {
  let documentClient: DocumentClient;
  let tableName: string;
  let records: DynamoDBRecord[];

  beforeAll(() => {
    advanceTo('2020-06-06T19:45:00+00:00');
  });

  beforeEach(() => {
    documentClient = new DocumentClient();
    documentClient.update = jest.fn().mockReturnValue({
      promise: jest.fn(),
    });

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
    clear();
  });

  it('should return update with the correct params', () => {
    insertTypeahead(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#descriptions': 'purchases',
        '#groupsCanAccess': 'groupsCanAccess',
        '#owner': 'owner',
        '#suppliers': 'suppliers',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':data': 'owner-id:company-id:Typeahead',
        ':descriptions': documentClient.createSet(['Description 1']),
        ':groupsCanAccess': ['Admin'],
        ':now': '2020-06-06T19:45:00.000Z',
        ':owner': 'owner-id',
        ':suppliers': documentClient.createSet(['Transaction 1']),
      },
      Key: {
        __typename: 'Typeahead',
        id: 'company-id',
      },
      TableName: tableName,
      UpdateExpression:
        'ADD #descriptions :descriptions, #suppliers :suppliers SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #updatedAt = :now',
    });

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#descriptions': 'purchases',
        '#groupsCanAccess': 'groupsCanAccess',
        '#owner': 'owner',
        '#suppliers': 'suppliers',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':data': 'owner-id:company-id:Typeahead',
        ':descriptions': documentClient.createSet(['Description 4']),
        ':groupsCanAccess': ['Admin'],
        ':now': '2020-06-06T19:45:00.000Z',
        ':owner': 'owner-id',
        ':suppliers': documentClient.createSet(['Transaction 4']),
      },
      Key: {
        __typename: 'Typeahead',
        id: 'company-id',
      },
      TableName: tableName,
      UpdateExpression:
        'ADD #descriptions :descriptions, #suppliers :suppliers SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #updatedAt = :now',
    });

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#descriptions': 'sales',
        '#groupsCanAccess': 'groupsCanAccess',
        '#owner': 'owner',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':data': 'owner-id:company-id:Typeahead',
        ':descriptions': documentClient.createSet(['Description 2']),
        ':groupsCanAccess': ['Admin'],
        ':now': '2020-06-06T19:45:00.000Z',
        ':owner': 'owner-id',
      },
      Key: {
        __typename: 'Typeahead',
        id: 'company-id',
      },
      TableName: tableName,
      UpdateExpression:
        'ADD #descriptions :descriptions SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #updatedAt = :now',
    });
  });

  it('should call update the correct number of times', () => {
    insertTypeahead(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledTimes(3);
  });
});
