import {
  SendMessageBatchCommand,
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Context, S3Event } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../queue-upload';

describe('queue-upload', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: S3Event;
  let sqs: AwsStub<ServiceInputTypes, ServiceOutputTypes>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
            Id: 'file-1',
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
            Id: 'file-2',
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
  });
});
