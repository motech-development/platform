import { SQSRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { advanceTo, clear } from 'jest-date-mock';
import updateAttachments from '../update-attachments';

describe('update-attachments', () => {
  let bucket: string;
  let documentClient: DocumentClient;
  let tableName: string;
  let records: SQSRecord[];

  beforeAll(() => {
    advanceTo('2020-06-06T19:45:00+00:00');
  });

  beforeEach(() => {
    documentClient = new DocumentClient();
    documentClient.update = jest.fn().mockReturnValue({
      promise: jest.fn(),
    });
    documentClient.query = jest.fn().mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [
            {
              __typename: 'Something',
              id: 'id-1',
              owner: 'owner',
            },
          ],
        })
        .mockResolvedValueOnce({
          Items: [],
        }),
    });

    tableName = 'test';

    bucket = 'upload-bucket';

    records = [
      {
        messageAttributes: {
          key: {
            stringValue: 'path/to/file-1.pdf',
          },
          metadata: {
            stringValue: JSON.stringify({
              id: 'id-1',
              owner: 'owner',
              typename: 'Something',
            }),
          },
          source: {
            stringValue: 'upload-bucket',
          },
        },
      },
      {
        messageAttributes: {
          key: {
            stringValue: 'path/to/file-1a.pdf',
          },
          metadata: {
            stringValue: JSON.stringify({
              id: 'id-1a',
              owner: 'owner',
              typename: 'Something',
            }),
          },
          source: {
            stringValue: 'upload-bucket',
          },
        },
      },
      {
        messageAttributes: {
          key: {
            stringValue: 'path/to/file-2.pdf',
          },
          metadata: {
            stringValue: JSON.stringify({
              id: 'id-2',
              owner: 'owner',
              typename: 'Something',
            }),
          },
          source: {
            stringValue: 'another-bucket',
          },
        },
      },
      {
        messageAttributes: {
          key: {
            stringValue: 'path/to/file-3.pdf',
          },
          source: {
            stringValue: 'another-bucket',
          },
        },
      },
    ] as unknown as SQSRecord[];
  });

  afterAll(() => {
    clear();
  });

  it('should query with the correct params', async () => {
    await updateAttachments(documentClient, tableName, bucket, records);

    expect(documentClient.query).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#attachment': 'attachment',
        '#data': 'data',
        '#owner': 'owner',
        '#typename': '__typename',
      },
      ExpressionAttributeValues: {
        ':attachment': 'to/file-1.pdf',
        ':data': 'path:to',
        ':owner': 'path',
        ':typename': 'Something',
      },
      FilterExpression: '#owner = :owner AND #attachment = :attachment',
      IndexName: '__typename-data-index',
      KeyConditionExpression:
        '#typename = :typename AND begins_with(#data, :data)',
      ProjectionExpression: 'id, #owner, #typename',
      TableName: 'test',
    });
  });

  it('should return update with the correct params', async () => {
    await updateAttachments(documentClient, tableName, bucket, records);

    expect(documentClient.update).toHaveBeenCalledWith({
      ExpressionAttributeNames: {
        '#attachment': 'attachment',
      },
      Key: {
        __typename: 'Something',
        id: 'id-1',
      },
      TableName: 'test',
      UpdateExpression: 'REMOVE #attachment',
    });
  });

  it('should create notification', async () => {
    await updateAttachments(documentClient, tableName, bucket, records);

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
        ':message': 'VIRUS_SCAN_FAIL',
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

  it('should call update the correct number of times', async () => {
    await updateAttachments(documentClient, tableName, bucket, records);

    expect(documentClient.update).toHaveBeenCalledTimes(2);
  });
});
