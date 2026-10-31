import { readFileSync } from 'node:fs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../clear-attachments';

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
          attachment: 'to/file-1.pdf',
          id: 'id-1',
          owner: 'path',
        },
      ],
    });

    event = {
      Records: [
        {
          messageAttributes: {
            key: {
              dataType: 'String',
              stringValue: 'path/to/file-1.pdf',
            },
            metadata: {
              dataType: 'String',
              stringValue: JSON.stringify({
                id: 'id-1',
                typename: 'Something',
              }),
            },
            source: {
              dataType: 'String',
              stringValue: 'upload-bucket',
            },
          },
          messageId: 'message-1',
        },
        {
          messageAttributes: {
            key: {
              dataType: 'String',
              stringValue: 'path/to/file-2.pdf',
            },
            metadata: {
              dataType: 'String',
              stringValue: JSON.stringify({
                id: 'id-2',
                typename: 'Something',
              }),
            },
            source: {
              dataType: 'String',
              stringValue: 'another-bucket',
            },
          },
          messageId: 'message-2',
        },
        {
          messageAttributes: {
            key: {
              dataType: 'String',
              stringValue: 'path/to/file-3.pdf',
            },
            source: {
              dataType: 'String',
              stringValue: 'another-bucket',
            },
          },
          messageId: 'message-3',
        },
      ],
    } as unknown as SQSEvent;
  });

  it('configures partial batch responses for the SQS event source', () => {
    const serverlessConfig = readFileSync('serverless.yml', 'utf8');
    const clearAttachmentsFunction = serverlessConfig
      .split('  ClearAttachments:')[1]
      ?.split('\n  PublishTransactions:')[0];

    expect(clearAttachmentsFunction).toContain(
      'functionResponseType: ReportBatchItemFailures',
    );
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
      it('should report successful processing and skip irrelevant messages', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [],
        });

        expect(ddb).toReceiveCommandTimes(QueryCommand, 1);
        expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 1);
      });
    });

    describe('when DynamoDB throws an error', () => {
      let error: Error;

      beforeEach(() => {
        error = new Error('Something has gone wrong');

        ddb.on(QueryCommand).rejectsOnce(error);
      });

      it('should return the failed message for SQS retry', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          batchItemFailures: [
            {
              itemIdentifier: 'message-1',
            },
          ],
        });

        expect(logger.error).toHaveBeenCalledWith(
          'Failed to clear attachment message',
          {
            error,
            messageId: 'message-1',
          },
        );
      });
    });
  });
});
