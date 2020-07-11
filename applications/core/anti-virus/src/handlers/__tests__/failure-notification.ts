import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { SQS } from 'aws-sdk';
import { getFileData } from '../../shared/file-operations';
import { handler, IEvent } from '../failure-notification';

jest.mock('../../shared/file-operations', () => ({
  getFileData: jest.fn(),
}));

describe('failure-notification', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      from: 'upload-bucket',
      key: 'path/to/file.pdf',
    };
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
        (getFileData as jest.Mock).mockResolvedValue({
          Metadata: {
            id: 'test-id',
            typename: 'TestType',
          },
        });
      });

      it('should send message with the correct params', async () => {
        await handler(event, context, callback);

        expect(SQS.prototype.sendMessage).toHaveBeenCalledWith({
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

      it('should return the correct data', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          from: 'upload-bucket',
          key: 'path/to/file.pdf',
        });
      });
    });

    describe('without metadata', () => {
      beforeEach(() => {
        (getFileData as jest.Mock).mockResolvedValue({});
      });

      it('should send message with the correct params', async () => {
        await handler(event, context, callback);

        expect(SQS.prototype.sendMessage).toHaveBeenCalledWith({
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
