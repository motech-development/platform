import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { advanceTo, clear } from 'jest-date-mock';
import confirmTransactions from '../confirm-transactions';

describe('confirm-transactions', () => {
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
          OldImage: {
            __typename: {
              S: 'ScheduledTransaction',
            },
            active: {
              BOOL: true,
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
          },
        },
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          OldImage: {
            __typename: {
              S: 'ScheduledTransaction',
            },
            active: {
              BOOL: false,
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
          },
        },
      },
    ];
  });

  afterAll(() => {
    clear();
  });

  it('should return update with the correct params', () => {
    confirmTransactions(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#data': 'data',
        '#scheduled': 'scheduled',
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':data': 'owner:company-id:confirmed:2019-12-15T00:00:00.000Z',
        ':scheduled': false,
        ':status': 'confirmed',
        ':updatedAt': '2020-06-06T19:45:00.000Z',
      },
      Key: {
        __typename: 'Transaction',
        id: 'transaction-1',
      },
      TableName: tableName,
      UpdateExpression:
        'SET #data = :data, #scheduled = :scheduled, #status = :status, #updatedAt = :updatedAt',
    });
  });

  it('should create notification', async () => {
    confirmTransactions(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#message': 'message',
        '#owner': 'owner',
        '#read': 'read',
      },
      ExpressionAttributeValues: {
        ':createdAt': '2020-06-06T19:45:00.000Z',
        ':data': 'owner:Notification:2020-06-06T19:45:00.000Z',
        ':message': 'TRANSACTION_PUBLISHED',
        ':owner': 'owner',
        ':read': false,
      },
      Key: {
        __typename: 'Notification',
        id: 'test-uuid',
      },
      TableName: 'test',
      UpdateExpression:
        'SET #createdAt = :createdAt, #data = :data, #message = :message, #owner = :owner, #read = :read',
    });
  });

  it('should call update the correct number of times', () => {
    confirmTransactions(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledTimes(2);
  });
});
