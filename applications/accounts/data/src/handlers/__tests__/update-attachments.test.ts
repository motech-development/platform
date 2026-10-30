import { createHash } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import type { SQSRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import updateAttachments from '../update-attachments';

describe('update-attachments', () => {
  let bucket: string;
  let ddb: AwsClientStub<DynamoDBClient>;
  let documentClient: DynamoDBClient;
  let record: SQSRecord;
  let tableName: string;

  beforeAll(() => {
    vi.setSystemTime(new Date('2020-06-06T19:45:00+00:00'));
  });

  beforeEach(() => {
    vi.mocked(logger.error).mockClear();
    ddb = mockClient(DynamoDBClient);
    documentClient = new DynamoDBClient({});
    tableName = 'test';
    bucket = 'upload-bucket';
    record = {
      messageAttributes: {
        key: {
          dataType: 'String',
          stringValue: 'owner/company-id/file-1.pdf',
        },
        metadata: {
          dataType: 'String',
          stringValue: JSON.stringify({
            id: 'record-id',
            typename: 'Something',
          }),
        },
        source: {
          dataType: 'String',
          stringValue: bucket,
        },
      },
      messageId: 'sqs-message-id',
    } as unknown as SQSRecord;
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('queries every page, including empty pages with a continuation key', async () => {
    ddb
      .on(QueryCommand)
      .resolvesOnce({
        Items: [],
        LastEvaluatedKey: {
          __typename: 'Something',
          data: 'owner:company-id',
          id: 'cursor',
        },
      })
      .resolvesOnce({
        Items: [
          {
            __typename: 'Something',
            attachment: 'company-id/file-1.pdf',
            id: 'record-id',
            owner: 'owner',
          },
        ],
      });

    await updateAttachments(documentClient, tableName, bucket, record);

    expect(ddb).toReceiveCommandTimes(QueryCommand, 2);
    expect(ddb).toReceiveCommandWith(QueryCommand, {
      ExpressionAttributeNames: {
        '#attachment': 'attachment',
        '#data': 'data',
        '#owner': 'owner',
        '#typename': '__typename',
      },
      ExpressionAttributeValues: {
        ':attachment': 'company-id/file-1.pdf',
        ':data': 'owner:company-id',
        ':owner': 'owner',
        ':typename': 'Something',
      },
      FilterExpression: '#owner = :owner AND #attachment = :attachment',
      IndexName: '__typename-data-index',
      KeyConditionExpression:
        '#typename = :typename AND begins_with(#data, :data)',
      ProjectionExpression: '#attachment, id, #owner, #typename',
      TableName: tableName,
    });
    expect(ddb).toReceiveCommandWith(QueryCommand, {
      ExclusiveStartKey: {
        __typename: 'Something',
        data: 'owner:company-id',
        id: 'cursor',
      },
    });
  });

  it('treats an empty continuation key as the end of pagination', async () => {
    ddb.on(QueryCommand).resolves({
      Items: [],
      LastEvaluatedKey: {},
    });

    await updateAttachments(documentClient, tableName, bucket, record);

    expect(ddb).toReceiveCommandTimes(QueryCommand, 1);
    expect(ddb).not.toReceiveCommand(TransactWriteCommand);
  });

  it('atomically removes the matching attachment and writes one deterministic notification', async () => {
    ddb.on(QueryCommand).resolves({
      Items: [
        {
          __typename: 'Something',
          attachment: 'company-id/file-1.pdf',
          id: 'record-id',
          owner: 'owner',
        },
      ],
    });

    await updateAttachments(documentClient, tableName, bucket, record);

    const expectedId = createHash('sha256')
      .update(JSON.stringify(['sqs-message-id', 'Something', 'record-id']))
      .digest('hex');

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Update: {
            ConditionExpression:
              '#owner = :owner AND #attachment = :attachment',
            ExpressionAttributeNames: {
              '#attachment': 'attachment',
              '#owner': 'owner',
            },
            ExpressionAttributeValues: {
              ':attachment': 'company-id/file-1.pdf',
              ':owner': 'owner',
            },
            Key: {
              __typename: 'Something',
              id: 'record-id',
            },
            TableName: tableName,
            UpdateExpression: 'REMOVE #attachment',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            Item: {
              __typename: 'Notification',
              createdAt: '2020-06-06T19:45:00.000Z',
              data: 'owner:Notification:2020-06-06T19:45:00.000Z',
              id: expectedId,
              message: 'VIRUS_SCAN_FAIL',
              owner: 'owner',
              read: false,
            },
            TableName: tableName,
          },
        },
      ],
    });
  });

  it('does not remove a replacement attachment returned by a stale index result', async () => {
    ddb.on(QueryCommand).resolves({
      Items: [
        {
          __typename: 'Something',
          attachment: 'company-id/file-1.pdf',
          id: 'record-id',
          owner: 'owner',
        },
      ],
    });
    ddb.on(TransactWriteCommand).rejectsOnce(
      Object.assign(new Error('condition failed'), {
        name: 'TransactionCanceledException',
      }),
    );
    ddb.on(GetCommand).resolves({
      Item: {
        __typename: 'Something',
        attachment: 'company-id/replacement.pdf',
        id: 'record-id',
        owner: 'owner',
      },
    });

    await expect(
      updateAttachments(documentClient, tableName, bucket, record),
    ).resolves.toBeUndefined();

    expect(ddb).toReceiveCommandWith(GetCommand, {
      ConsistentRead: true,
      Key: {
        __typename: 'Something',
        id: 'record-id',
      },
      TableName: tableName,
    });
  });

  it('treats an ambiguous transaction as complete when its attachment is already gone', async () => {
    ddb.on(QueryCommand).resolves({
      Items: [
        {
          __typename: 'Something',
          attachment: 'company-id/file-1.pdf',
          id: 'record-id',
          owner: 'owner',
        },
      ],
    });
    ddb.on(TransactWriteCommand).rejectsOnce(new Error('response timed out'));
    ddb.on(GetCommand).resolves({
      Item: {
        __typename: 'Something',
        id: 'record-id',
        owner: 'owner',
      },
    });

    await expect(
      updateAttachments(documentClient, tableName, bucket, record),
    ).resolves.toBeUndefined();
  });

  it('rethrows transaction failures while the original attachment is still present', async () => {
    const error = new Error('temporarily unavailable');
    ddb.on(QueryCommand).resolves({
      Items: [
        {
          __typename: 'Something',
          attachment: 'company-id/file-1.pdf',
          id: 'record-id',
          owner: 'owner',
        },
      ],
    });
    ddb.on(TransactWriteCommand).rejectsOnce(error);
    ddb.on(GetCommand).resolves({
      Item: {
        __typename: 'Something',
        attachment: 'company-id/file-1.pdf',
        id: 'record-id',
        owner: 'owner',
      },
    });

    await expect(
      updateAttachments(documentClient, tableName, bucket, record),
    ).rejects.toBe(error);
  });

  it('logs and skips malformed or irrelevant messages', async () => {
    const malformed = {
      ...record,
      messageAttributes: undefined,
    } as unknown as SQSRecord;
    const wrongBucket = {
      ...record,
      messageAttributes: {
        ...record.messageAttributes,
        source: {
          dataType: 'String',
          stringValue: 'another-bucket',
        },
      },
    };

    await updateAttachments(documentClient, tableName, bucket, malformed);
    await updateAttachments(documentClient, tableName, bucket, wrongBucket);

    expect(ddb).not.toReceiveCommand(QueryCommand);
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});
