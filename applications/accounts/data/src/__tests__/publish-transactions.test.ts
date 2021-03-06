import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler } from '../publish-transactions';

describe('schedule-transaction', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: DynamoDBStreamEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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

        expect(DocumentClient.prototype.update).toHaveBeenCalledTimes(0);
      });

      it('should update the correct number of records', async () => {
        await handler(event, context, callback);

        expect(DocumentClient.prototype.update).toHaveBeenCalledTimes(2);
      });
    });

    describe('when DyanmoDB throws an error', () => {
      beforeEach(() => {
        (DocumentClient.prototype.update as jest.Mock).mockReturnValue({
          promise: jest
            .fn()
            .mockRejectedValue(new Error('Something has gone wrong')),
        });

        jest.spyOn(console, 'error').mockReturnValue();
      });

      it('should swallow the error', async () => {
        await handler(event, context, callback);

        expect(console.error).toHaveBeenCalledWith('Something has gone wrong');
      });
    });
  });
});
