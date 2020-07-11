import { SQSRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import updateAttachments from '../update-attachments';

describe('update-attachments', () => {
  let bucket: string;
  let documentClient: DocumentClient;
  let tableName: string;
  let records: SQSRecord[];

  beforeEach(() => {
    documentClient = new DocumentClient();
    documentClient.update = jest.fn().mockReturnValue({
      promise: jest.fn(),
    });

    tableName = 'test';

    bucket = 'upload-bucket';

    records = ([
      {
        messageAttributes: {
          key: {
            stringValue: 'path/to/file-1.pdf',
          },
          metadata: {
            stringValue: JSON.stringify({
              id: 'id-1',
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
    ] as unknown) as SQSRecord[];
  });

  it('should return update with the correct params', () => {
    updateAttachments(documentClient, tableName, bucket, records);

    expect(documentClient.update).toHaveBeenCalledWith({
      ConditionExpression: '#attachment = :attachment',
      ExpressionAttributeNames: {
        '#attachment': 'attachment',
      },
      ExpressionAttributeValues: {
        ':attachment': 'to/file-1.pdf',
      },
      Key: {
        __typename: 'Something',
        id: 'id-1',
      },
      TableName: 'test',
      UpdateExpression: 'REMOVE #attachment',
    });
  });

  it('should call update the correct number of times', () => {
    updateAttachments(documentClient, tableName, bucket, records);

    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
