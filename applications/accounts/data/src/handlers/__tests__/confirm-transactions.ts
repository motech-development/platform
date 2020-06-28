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
            id: {
              S: 'transaction-1',
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
            id: {
              S: 'transaction-2',
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
        '#scheduled': 'scheduled',
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
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
        'SET #scheduled = :scheduled, #status = :status, #updatedAt = :updatedAt',
    });
  });

  it('should call update the correct number of times', () => {
    confirmTransactions(documentClient, tableName, records);

    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
