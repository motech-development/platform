import {
  BatchWriteItemCommand,
  DynamoDBClient,
  ScanCommand,
  UpdateTableCommand,
} from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../data-restore';

jest.mock('@motech-development/node-logger');

describe('data-restore handler', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    ddb = mockClient(DynamoDBClient);
  });

  it('should throw an error if source is missing', async () => {
    await expect(handler(null, context, callback)).rejects.toThrow(
      'Missing source or target table',
    );
  });

  describe('when source is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.SOURCE = 'source-table';

      ddb.reset();
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if source is missing', async () => {
      await expect(handler(null, context, callback)).rejects.toThrow(
        'Missing source or target table',
      );
    });

    describe('when target is set', () => {
      beforeEach(() => {
        process.env.SOURCE = 'source-table';
        process.env.TARGET = 'target-table';
      });

      afterEach(() => {
        process.env = env;
      });

      it('should clear the target table and restore data from the source table', async () => {
        const items = Array.from({ length: 50 }, (_, i) => ({
          data: {
            S: `data${i + 1}`,
          },
          id: {
            S: `${i + 1}`,
          },
        }));

        ddb
          .on(ScanCommand, {
            TableName: 'target-table',
          })
          .resolves({
            Items: items,
          })
          .on(ScanCommand, {
            TableName: 'source-table',
          })
          .resolves({
            Items: items,
          })
          .on(BatchWriteItemCommand)
          .resolves({})
          .on(UpdateTableCommand, {
            StreamSpecification: {
              StreamEnabled: false,
            },
            TableName: 'target-table',
          })
          .resolves({})
          .on(UpdateTableCommand, {
            StreamSpecification: {
              StreamEnabled: true,
            },
            TableName: 'target-table',
          })
          .resolves({});

        await handler(null, context, callback);

        expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 2);

        expect(ddb).toHaveReceivedCommandTimes(BatchWriteItemCommand, 4);
      });

      it('should clear the target table and restore data from the source table when chunking threshold is not reached', async () => {
        const items = Array.from({ length: 10 }, (_, i) => ({
          data: {
            S: `data${i + 1}`,
          },
          id: {
            S: `${i + 1}`,
          },
        }));

        ddb
          .on(ScanCommand, {
            TableName: 'target-table',
          })
          .resolves({
            Items: items,
          })
          .on(ScanCommand, {
            TableName: 'source-table',
          })
          .resolves({
            Items: items,
          })
          .on(BatchWriteItemCommand)
          .resolves({})
          .on(UpdateTableCommand, {
            StreamSpecification: {
              StreamEnabled: false,
            },
            TableName: 'target-table',
          })
          .resolves({})
          .on(UpdateTableCommand, {
            StreamSpecification: {
              StreamEnabled: true,
            },
            TableName: 'target-table',
          })
          .resolves({});

        await handler(null, context, callback);

        expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 2);

        expect(ddb).toHaveReceivedCommandTimes(BatchWriteItemCommand, 2);
      });

      it('should log an error if an exception is thrown', async () => {
        const error = new Error('Test error');

        ddb.on(ScanCommand).rejects(error);

        await handler(null, context, callback);

        expect(logger.error).toHaveBeenCalledWith(error.message);
      });
    });
  });
});
