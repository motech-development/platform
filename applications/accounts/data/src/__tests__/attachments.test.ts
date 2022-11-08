import logger from '@motech-development/node-logger';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { SQS } from 'aws-sdk';
import { handler } from '../attachments';

describe('attachments', () => {
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
            NewImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '100.25',
              },
              attachment: {
                S: '',
              },
              category: {
                S: 'Sales',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 1',
              },
              name: {
                S: 'Transaction 1',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '1.2',
              },
            },
            OldImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '200.5',
              },
              attachment: {
                S: '',
              },
              category: {
                S: 'Sales',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 1',
              },
              name: {
                S: 'Transaction 1',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '2.4',
              },
            },
          },
          eventName: 'INSERT' as const,
        },
        {
          dynamodb: {
            NewImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '100.25',
              },
              attachment: {
                S: '',
              },
              category: {
                S: 'Expenses',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 2',
              },
              name: {
                S: 'Transaction 2',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '1.2',
              },
            },
            OldImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '200.5',
              },
              attachment: {
                S: '',
              },
              category: {
                S: 'Expenses',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 2',
              },
              name: {
                S: 'Transaction 2',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '2.4',
              },
            },
          },
          eventName: 'MODIFY' as const,
        },
        {
          dynamodb: {
            NewImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '100.25',
              },
              attachment: {
                S: 'path/to/file.pdf',
              },
              category: {
                S: 'Sales',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 3',
              },
              name: {
                S: 'Transaction 3',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '1.2',
              },
            },
            OldImage: {
              __typename: {
                S: 'Transaction',
              },
              amount: {
                N: '200.5',
              },
              attachment: {
                S: 'path/to/file.pdf',
              },
              category: {
                S: 'Sales',
              },
              companyId: {
                S: 'company-id',
              },
              date: {
                S: '2019-12-15T00:00:00.000Z',
              },
              description: {
                S: 'Description 3',
              },
              name: {
                S: 'Transaction 3',
              },
              owner: {
                S: 'owner',
              },
              status: {
                S: 'confirmed',
              },
              vat: {
                N: '2.4',
              },
            },
          },
          eventName: 'REMOVE' as const,
        },
      ],
    };
  });

  it('should throw an error if no queue is set', async () => {
    event = {
      Records: [],
    };

    await expect(handler(event, context, callback)).rejects.toThrow(
      'No attachment queue set',
    );
  });

  describe('with queue set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.ATTACHMENT_QUEUE = 'app-queue';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('when there are no errors thrown by SQS', () => {
      it('should do nothing if there is nothing to process', async () => {
        event = {
          Records: [],
        };

        await handler(event, context, callback);

        expect(SQS.prototype.sendMessageBatch).toHaveBeenCalledTimes(0);
      });

      it('should update the correct number of records', async () => {
        await handler(event, context, callback);

        expect(SQS.prototype.sendMessageBatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('when SQS throws an error', () => {
      let error: Error;

      beforeEach(() => {
        error = new Error('Something has gone wrong');

        (SQS.prototype.sendMessageBatch as jest.Mock).mockReturnValue({
          promise: jest.fn().mockRejectedValue(error),
        });
      });

      it('should swallow the error', async () => {
        await handler(event, context, callback);

        expect(logger.error).toHaveBeenCalledWith('An error occurred', error);
      });
    });
  });
});
