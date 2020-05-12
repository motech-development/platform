import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler } from '../balance';

describe('balance', () => {
  let callback: jest.Mock;
  let context: Context;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();
  });

  it('should throw an error if no table is set', async () => {
    const event = {
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
      beforeEach(() => {
        DocumentClient.prototype.update = jest.fn().mockReturnValue({
          promise: jest.fn(),
        });
      });

      it('should do nothing if there is nothing to process', async () => {
        const event = {
          Records: [],
        };

        await handler(event, context, callback);

        expect(DocumentClient.prototype.update).toHaveBeenCalledTimes(0);
      });

      it('should update the correct number of records', async () => {
        const event = {
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Expenses',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Expenses',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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

        await handler(event, context, callback);

        expect(DocumentClient.prototype.update).toHaveBeenCalledTimes(3);
      });
    });

    describe('when DyanmoDB throws an error', () => {
      beforeEach(() => {
        DocumentClient.prototype.update = jest.fn().mockReturnValue({
          promise: jest
            .fn()
            .mockRejectedValue(new Error('Something has gone wrong')),
        });

        jest.spyOn(console, 'error').mockReturnValue();
      });

      it('should swallow the error', async () => {
        const event = {
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Expenses',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Expenses',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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
                  category: {
                    S: 'Sales',
                  },
                  companyId: {
                    S: 'company-id',
                  },
                  date: {
                    S: '2019-12-15T00:00:00.000Z',
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

        await handler(event, context, callback);

        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledWith('Something has gone wrong');
      });
    });
  });
});
