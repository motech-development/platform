import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler } from '../typeahead';

describe('typeahead', () => {
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

        await handler(event, context, callback);

        expect(console.error).toHaveBeenCalledWith('Something has gone wrong');
      });
    });
  });
});
