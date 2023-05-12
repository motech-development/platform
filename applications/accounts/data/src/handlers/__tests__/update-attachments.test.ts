import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { SQSRecord } from 'aws-lambda';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import updateAttachments from '../update-attachments';

describe('update-attachments', () => {
  let bucket: string;
  let ddb: AwsStub<ServiceInputTypes, ServiceOutputTypes>;
  let documentClient: DynamoDBClient;
  let tableName: string;
  let records: SQSRecord[];

  beforeAll(() => {
    advanceTo('2020-06-06T19:45:00+00:00');
  });

  beforeEach(() => {
    ddb = mockClient(DynamoDBClient);

    documentClient = new DynamoDBClient({});

    ddb
      .on(QueryCommand)
      .resolvesOnce({
        Items: [
          {
            __typename: 'Something',
            id: 'id-1',
            owner: 'owner',
          },
        ],
      })
      .resolvesOnce({
        Items: [],
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

    expect(ddb).toReceiveCommandWith(QueryCommand, {
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

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
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

    expect(ddb).toReceiveCommandWith(UpdateCommand, {
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

    expect(ddb).toReceiveCommandTimes(UpdateCommand, 2);
  });
});
