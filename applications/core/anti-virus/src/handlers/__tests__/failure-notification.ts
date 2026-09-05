import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  getFileData,
  getStagedFile,
} from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../failure-notification';

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/s3-file-operations')
  >()),
  getFileData: vi.fn(),
  getStagedFile: vi.fn(),
}));

describe('failure-notification', () => {
  let callback: Mock;
  let context: Context;
  let event: IEvent;
  let sqs: AwsClientStub<SQSClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      from: 'upload-bucket',
      key: 'path/to/file.pdf',
    };

    sqs = mockClient(SQSClient);
  });

  it('should throw an error if queue url is not set', async () => {
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

      process.env.QUEUE_URL = 'https://queue.url';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('with metadata', () => {
      beforeEach(() => {
        (getFileData as Mock).mockResolvedValue({
          Metadata: {
            id: 'test-id',
            typename: 'TestType',
          },
        });
      });

      it('should send message with the correct params with an id set', async () => {
        await handler(event, context, callback);

        expect(sqs).toReceiveCommandWith(SendMessageCommand, {
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'path/to/file.pdf',
            },
            metadata: {
              DataType: 'String',
              StringValue: JSON.stringify({
                id: 'test-id',
                typename: 'TestType',
              }),
            },
            source: {
              DataType: 'String',
              StringValue: 'upload-bucket',
            },
          },
          MessageBody: 'path/to/file.pdf has failed virus scan',
          QueueUrl: 'https://queue.url',
        });
      });

      it('should send message with the correct params with no id set', async () => {
        (getFileData as Mock).mockResolvedValue({
          Metadata: {
            typename: 'TestType',
          },
        });

        await handler(event, context, callback);

        expect(sqs).toReceiveCommandWith(SendMessageCommand, {
          DelaySeconds: 600,
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'path/to/file.pdf',
            },
            metadata: {
              DataType: 'String',
              StringValue: JSON.stringify({
                typename: 'TestType',
              }),
            },
            source: {
              DataType: 'String',
              StringValue: 'upload-bucket',
            },
          },
          MessageBody: 'path/to/file.pdf has failed virus scan',
          QueueUrl: 'https://queue.url',
        });
      });

      it('should return the correct data', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          from: 'upload-bucket',
          key: 'path/to/file.pdf',
        });
      });
    });

    it('does not report a deleted source as a failed virus scan', async () => {
      vi.mocked(getFileData).mockRejectedValueOnce(
        Object.assign(new Error('missing'), { name: 'NotFound' }),
      );
      await handler(event, context, callback);
      expect(sqs).not.toReceiveCommand(SendMessageCommand);
    });

    it('keeps internal lifecycle metadata out of the notification', async () => {
      event.key = 'owner/%252F/file.pdf';
      vi.mocked(getFileData).mockResolvedValueOnce({
        $metadata: {},
        Metadata: {
          'attachment-lifecycle': 'v1',
          id: 'test-id',
          typename: 'TestType',
        },
      });
      vi.mocked(getStagedFile).mockResolvedValueOnce({
        from: event.from,
        key: event.key,
        path: 'downloads/key',
        state: 'pending',
        to: 'downloads',
      });
      await handler({ ...event, to: 'downloads' }, context, callback);
      expect(getStagedFile).toHaveBeenCalledWith(
        'downloads',
        'owner/%2F/file.pdf',
      );
      expect(
        sqs.commandCalls(SendMessageCommand)[0]?.args[0].input.MessageAttributes
          ?.metadata.StringValue,
      ).toBe(JSON.stringify({ id: 'test-id', typename: 'TestType' }));
    });

    describe('without metadata', () => {
      beforeEach(() => {
        (getFileData as Mock).mockResolvedValue({});
      });

      it('should send message with the correct params', async () => {
        await handler(event, context, callback);

        expect(sqs).toReceiveCommandWith(SendMessageCommand, {
          DelaySeconds: 600,
          MessageAttributes: {
            key: {
              DataType: 'String',
              StringValue: 'path/to/file.pdf',
            },
            source: {
              DataType: 'String',
              StringValue: 'upload-bucket',
            },
          },
          MessageBody: 'path/to/file.pdf has failed virus scan',
          QueueUrl: 'https://queue.url',
        });
      });

      it('should return the correct data', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          from: 'upload-bucket',
          key: 'path/to/file.pdf',
        });
      });
    });
  });
});
