import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { DynamoDBRecord } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import deleteAttachments from '../delete-attachments';

describe('delete-attachments', () => {
  let client: SQSClient;
  let queueUrl: string;
  let sqs: AwsClientStub<SQSClient>;

  beforeEach(() => {
    client = new SQSClient({});
    queueUrl = 'https://queue-url';
    sqs = mockClient(SQSClient);
    sqs.on(SendMessageBatchCommand).resolves({});
  });

  it('should not call sendMessageBatch if there are no attachments to process', async () => {
    await deleteAttachments(client, queueUrl, []);

    expect(sqs).not.toReceiveCommand(SendMessageBatchCommand);
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

    await deleteAttachments(client, queueUrl, records);

    expect(sqs).toReceiveCommandWith(SendMessageBatchCommand, {
      Entries: [
        {
          DelaySeconds: 300,
          Id: 'message-0',
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'owner/path/to/file-1.pdf',
            },
          },
          MessageBody: 'Delete path/to/file-1.pdf',
        },
        {
          DelaySeconds: 300,
          Id: 'message-1',
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

  it('chunks messages into batches of at most ten with unique entry IDs', async () => {
    const records = Array.from({ length: 11 }, (_, index) => ({
      dynamodb: {
        OldImage: {
          __typename: { S: 'Transaction' },
          attachment: { S: `company/${index}.pdf` },
          id: { S: `${index}` },
          owner: { S: 'owner' },
        },
      },
    })) as unknown as DynamoDBRecord[];

    await deleteAttachments(client, queueUrl, records);

    const calls = sqs.commandCalls(SendMessageBatchCommand);

    expect(calls).toHaveLength(2);
    expect(calls.map(({ args }) => args[0].input.Entries?.length)).toEqual([
      10, 1,
    ]);
    expect(calls[0]?.args[0].input.Entries?.map(({ Id }) => Id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `message-${index}`),
    );
    expect(calls[1]?.args[0].input.Entries?.map(({ Id }) => Id)).toEqual([
      'message-10',
    ]);
  });

  it('retries only transiently failed entries', async () => {
    const records = [
      {
        dynamodb: {
          OldImage: {
            __typename: { S: 'Transaction' },
            attachment: { S: 'company/one.pdf' },
            id: { S: 'one' },
            owner: { S: 'owner' },
          },
        },
      },
      {
        dynamodb: {
          OldImage: {
            __typename: { S: 'Transaction' },
            attachment: { S: 'company/two.pdf' },
            id: { S: 'two' },
            owner: { S: 'owner' },
          },
        },
      },
    ] as unknown as DynamoDBRecord[];
    sqs
      .on(SendMessageBatchCommand)
      .resolvesOnce({
        Failed: [
          {
            Code: 'ServiceUnavailable',
            Id: 'message-1',
            Message: 'temporary failure',
            SenderFault: false,
          },
        ],
      })
      .resolvesOnce({});

    await deleteAttachments(client, queueUrl, records);

    const calls = sqs.commandCalls(SendMessageBatchCommand);

    expect(calls).toHaveLength(2);
    expect(calls[0]?.args[0].input.Entries?.map(({ Id }) => Id)).toEqual([
      'message-0',
      'message-1',
    ]);
    expect(calls[1]?.args[0].input.Entries?.map(({ Id }) => Id)).toEqual([
      'message-1',
    ]);
  });

  it('fails immediately for sender faults', async () => {
    sqs.on(SendMessageBatchCommand).resolvesOnce({
      Failed: [
        {
          Code: 'InvalidParameterValue',
          Id: 'message-0',
          Message: 'invalid entry',
          SenderFault: true,
        },
      ],
    });

    await expect(
      deleteAttachments(client, queueUrl, [
        {
          dynamodb: {
            OldImage: {
              __typename: { S: 'Transaction' },
              attachment: { S: 'company/one.pdf' },
              id: { S: 'one' },
              owner: { S: 'owner' },
            },
          },
        },
      ]),
    ).rejects.toThrow('SQS rejected entry message-0');

    expect(sqs).toReceiveCommandTimes(SendMessageBatchCommand, 1);
  });

  it('fails after the bounded retry attempts are exhausted', async () => {
    sqs.on(SendMessageBatchCommand).resolves({
      Failed: [
        {
          Code: 'ServiceUnavailable',
          Id: 'message-0',
          Message: 'temporary failure',
          SenderFault: false,
        },
      ],
    });

    await expect(
      deleteAttachments(client, queueUrl, [
        {
          dynamodb: {
            OldImage: {
              __typename: { S: 'Transaction' },
              attachment: { S: 'company/one.pdf' },
              id: { S: 'one' },
              owner: { S: 'owner' },
            },
          },
        },
      ]),
    ).rejects.toThrow('SQS batch send failed after 3 attempts');

    expect(sqs).toReceiveCommandTimes(SendMessageBatchCommand, 3);
  });
});
