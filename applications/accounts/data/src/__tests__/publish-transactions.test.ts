import {
  DynamoDBClient,
  DynamoDBClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../publish-transactions';

describe('schedule-transaction', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsStub<
    ServiceInputTypes,
    ServiceOutputTypes,
    DynamoDBClientResolvedConfig
  >;
  let event: DynamoDBStreamEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    ddb = mockClient(DynamoDBClient);

    event = {
      Records: [
        {
          dynamodb: {
            OldImage: {
              __typename: {
                S: 'ScheduledTransaction',
              },
              active: {
                BOOL: true,
              },
              id: {
                S: 'transaction-1',
              },
            },
          },
          eventName: 'REMOVE' as const,
        },
        {
          dynamodb: {
            OldImage: {
              __typename: {
                S: 'ScheduledTransaction',
              },
              active: {
                BOOL: false,
              },
              id: {
                S: 'transaction-2',
              },
            },
          },
          eventName: 'MODIFY' as const,
        },
      ],
    };
  });

  it('should throw an error if no table is set', async () => {
    event = {
      Records: [],
    };

    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('with table set', () => {
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

    describe('when there are no errors thrown by DynamoDB', () => {
      it('should do nothing if there is nothing to process', async () => {
        event = {
          Records: [],
        };

        await handler(event, context, callback);

        expect(ddb).toReceiveCommandTimes(UpdateCommand, 0);
      });

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

      it('should swallow the error', async () => {
        await handler(event, context, callback);

        expect(logger.error).toHaveBeenCalledWith('An error occurred', error);
      });
    });
  });
});
