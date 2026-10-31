import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import type { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../transactions';

describe('transactions', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: DynamoDBStreamEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);

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

    event.Records = event.Records.map((record, index) => ({
      ...record,
      eventID: `event-${index}`,
      eventSourceARN:
        'arn:aws:dynamodb:eu-west-1:123456789012:table/app-table/stream/2020-06-06T19:45:00.000',
    }));
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

        expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 0);
      });

      it('should update the correct number of records', async () => {
        await handler(event, context, callback);

        expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 3);

        expect(
          ddb
            .commandCalls(TransactWriteCommand)
            .map(({ args: [command] }) =>
              String(command.input.TransactItems?.[0]?.Put?.Item?.eventName),
            ),
        ).toEqual(['INSERT', 'MODIFY', 'REMOVE']);
      });
    });

    describe('when DyanmoDB throws an error', () => {
      let error: Error;

      beforeEach(() => {
        error = new Error('Something has gone wrong');

        ddb.on(TransactWriteCommand).rejectsOnce(error);

        ddb
          .on(GetCommand)
          .callsFake((input: GetCommandInput) =>
            input.Key?.__typename === 'Company'
              ? { Item: { __typename: 'Company', id: 'company-id' } }
              : {},
          );
      });

      it('should propagate the error for Lambda to retry', async () => {
        await expect(handler(event, context, callback)).rejects.toBe(error);

        expect(logger.error).toHaveBeenCalledWith('An error occurred', error);
      });
    });
  });
});
