import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../transform-transactions';

describe('transform-transactions', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
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
            NewImage: {
              __typename: {
                S: 'Balance',
              },
              balance: {
                N: '0',
              },
              id: {
                S: 'balance-id',
              },
              items: {
                M: {},
              },
              owner: {
                S: 'owner-id',
              },
              transactions: {
                L: [],
              },
              updatedAt: {
                S: '2024-03-28',
              },
              vat: {
                M: {
                  owed: {
                    N: '0',
                  },
                  paid: {
                    N: '0',
                  },
                },
              },
            },
            OldImage: {
              __typename: {
                S: 'Balance',
              },
              balance: {
                N: '0',
              },
              id: {
                S: 'balance-id',
              },
              items: {
                M: {},
              },
              owner: {
                S: 'owner-id',
              },
              transactions: {
                L: [],
              },
              updatedAt: {
                S: '2024-03-27',
              },
              vat: {
                M: {
                  owed: {
                    N: '0',
                  },
                  paid: {
                    N: '0',
                  },
                },
              },
            },
          },
          eventName: 'MODIFY' as const,
        },
      ],
    };

    ddb.on(QueryCommand).resolves({
      Items: [],
    });
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

        expect(ddb).toReceiveCommandTimes(UpdateCommand, 1);
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
