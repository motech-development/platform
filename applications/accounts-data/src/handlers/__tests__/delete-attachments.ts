import { DynamoDBRecord } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import deleteAttachments from '../delete-attachments';

describe('delete-attachments', () => {
  let queueUrl: string;
  let sqs: SQS;

  beforeEach(() => {
    sqs = new SQS();
    queueUrl = 'https://queue-url';
  });

  it('should not call sendMessageBatch if there are no attachments to process', async () => {
    await deleteAttachments(sqs, queueUrl, []);

    expect(sqs.sendMessageBatch).not.toHaveBeenCalled();
  });

  it('should call sendMessageBatch with the correct params', async () => {
    const records: DynamoDBRecord[] = [
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
            owner: {
              S: 'owner',
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
            owner: {
              S: 'owner',
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
            attachment: {
              S: 'path/to/file-1.pdf',
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
              S: '1',
            },
            owner: {
              S: 'owner',
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
            attachment: {
              S: 'path/to/file-1.pdf',
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
              S: '1',
            },
            owner: {
              S: 'owner',
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
            attachment: {
              S: 'path/to/file-2.pdf',
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
              S: '2',
            },
            owner: {
              S: 'owner',
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
            attachment: {
              S: 'path/to/file-2.pdf',
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
              S: '2',
            },
            owner: {
              S: 'owner',
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
    ];

    await deleteAttachments(sqs, queueUrl, records);

    expect(sqs.sendMessageBatch).toHaveBeenCalledWith({
      Entries: [
        {
          Id: '1',
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'owner/path/to/file-1.pdf',
            },
          },
          MessageBody: 'Delete path/to/file-1.pdf',
        },
        {
          Id: '2',
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'owner/path/to/file-2.pdf',
            },
          },
          MessageBody: 'Delete path/to/file-2.pdf',
        },
      ],
      QueueUrl: 'https://queue-url',
    });
  });
});
