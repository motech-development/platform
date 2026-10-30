import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { Context, S3Event } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../queue-upload';

describe('queue-upload', () => {
  let callback: Mock;
  let context: Context;
  let event: S3Event;
  let sqs: AwsClientStub<SQSClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'upload-bucket',
            },
            object: {
              key: 'path/to/file-1.pdf',
            },
          },
        },
        {
          s3: {
            bucket: {
              name: 'upload-bucket',
            },
            object: {
              key: 'path/to/file-2.gif',
            },
          },
        },
      ],
    } as S3Event;

    sqs = mockClient(SQSClient);
    sqs.on(SendMessageBatchCommand).resolves({});
  });

  it('should throw an error when no queue url is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No queue set',
    );
  });

  describe('when queue url is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.QUEUE_URL = 'https://sqs-queue';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error no download bucket is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No destination bucket set',
      );
    });
  });

  describe('when queue url and download bucket are set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.QUEUE_URL = 'https://sqs-queue';
      process.env.DOWNLOAD_BUCKET = 'download-bucket';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should send the correct messages to SQS', async () => {
      await handler(event, context, callback);

      expect(sqs).toReceiveCommandWith(SendMessageBatchCommand, {
        Entries: [
          {
            Id: 'message-0',
            MessageAttributes: {
              from: {
                DataType: 'String',
                StringValue: 'upload-bucket',
              },
              key: {
                DataType: 'String',
                StringValue: 'path/to/file-1.pdf',
              },
              to: {
                DataType: 'String',
                StringValue: 'download-bucket',
              },
            },
            MessageBody: 'Upload path/to/file-1.pdf',
          },
          {
            Id: 'message-1',
            MessageAttributes: {
              from: {
                DataType: 'String',
                StringValue: 'upload-bucket',
              },
              key: {
                DataType: 'String',
                StringValue: 'path/to/file-2.gif',
              },
              to: {
                DataType: 'String',
                StringValue: 'download-bucket',
              },
            },
            MessageBody: 'Upload path/to/file-2.gif',
          },
        ],
        QueueUrl: 'https://sqs-queue',
      });
    });

    it('chunks more than ten records into bounded batches with unique IDs', async () => {
      event = {
        Records: Array.from({ length: 11 }, (_, index) => ({
          s3: {
            bucket: {
              name: 'upload-bucket',
            },
            object: {
              key: `path/to/file-${index}.pdf`,
            },
          },
        })),
      } as unknown as S3Event;

      await handler(event, context, callback);

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

      await handler(event, context, callback);

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

      await expect(handler(event, context, callback)).rejects.toThrow(
        'SQS rejected entry message-0',
      );

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

      await expect(handler(event, context, callback)).rejects.toThrow(
        'SQS batch send failed after 3 attempts',
      );

      expect(sqs).toReceiveCommandTimes(SendMessageBatchCommand, 3);
    });
  });
});
