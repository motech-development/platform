import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { captureException } from '@sentry/aws-serverless';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../clear-attachments';

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('clear-attachments', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: SQSEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);

    ddb.on(QueryCommand).resolves({
      Items: [
        {
          __typename: 'Something',
          id: 'id-1',
        },
      ],
    });

    event = {
      Records: [
        {
          attributes: {
            SentTimestamp: '0',
          },
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
          messageId: 'message-1',
        },
        {
          attributes: {
            SentTimestamp: '0',
          },
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
          messageId: 'message-2',
        },
        {
          attributes: {
            SentTimestamp: '0',
          },
          messageAttributes: {
            key: {
              stringValue: 'path/to/file-3.pdf',
            },
            source: {
              stringValue: 'another-bucket',
            },
          },
          messageId: 'message-3',
        },
      ],
    } as unknown as SQSEvent;
  });

  it('should throw an error if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('when table is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no bucket is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No source bucket set',
      );
    });
  });

  describe('when table and bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'upload-bucket';
      process.env.TABLE = 'app-table';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('when there are no errors thrown by DynamoDB', () => {
      it('should update the correct number of records', async () => {
        await handler(event, context, callback);

        expect(ddb).toReceiveCommandTimes(UpdateCommand, 2);
      });
    });

    describe('when DyanmoDB throws an error', () => {
      let error: Error;

      beforeEach(() => {
        error = new Error('Something has gone wrong');

        ddb.on(UpdateCommand).rejectsOnce(error);
      });

      it('should log, capture and report the failed record', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [
            {
              itemIdentifier: 'message-1',
            },
          ],
        });

        expect(logger.error).toHaveBeenCalledWith('An error occurred', error);
        expect(captureException).toHaveBeenCalledWith(error);
      });
    });

    describe('when no saved transaction references the attachment', () => {
      beforeEach(() => {
        vi.clearAllMocks();

        ddb.on(QueryCommand).resolves({
          Items: [],
        });
      });

      it('should retry the record within ten minutes of it being sent', async () => {
        event.Records[0].attributes.SentTimestamp = `${Date.now() - 60000}`;

        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [
            {
              itemIdentifier: 'message-1',
            },
          ],
        });

        expect(ddb).toReceiveCommandTimes(UpdateCommand, 0);
        expect(captureException).not.toHaveBeenCalled();
      });

      it('should stop retrying the record after ten minutes', async () => {
        event.Records[0].attributes.SentTimestamp = `${Date.now() - 600000}`;

        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [],
        });
      });
    });

    describe('when a record cannot be processed', () => {
      beforeEach(() => {
        event.Records[1].messageAttributes.metadata.stringValue = 'invalid';
        event.Records[1].messageAttributes.source.stringValue = 'upload-bucket';
      });

      it('should report the failed record without failing the others', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [
            {
              itemIdentifier: 'message-2',
            },
          ],
        });

        expect(ddb).toReceiveCommandTimes(UpdateCommand, 2);
        expect(captureException).toHaveBeenCalledWith(expect.any(SyntaxError));
      });
    });
  });
});
