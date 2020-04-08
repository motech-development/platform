import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler } from '../get-banks';

describe('get-banks', () => {
  let callback: jest.Mock;
  let context: Context;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();
  });

  it('should return an error if table is not set', async () => {
    await handler({}, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No table set',
        statusCode: 500,
      }),
      statusCode: 500,
    });
  });

  describe('with a table set', () => {
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

    it('should return a list of banks', async () => {
      DocumentClient.prototype.query = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({
          Items: [
            {
              name: 'bank-1',
              pk: '1',
            },
            {
              name: 'bank-2',
              pk: '2',
            },
            {
              name: 'bank-3',
              pk: '3',
            },
          ],
        }),
      });

      await handler({}, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          items: [
            {
              id: '1',
              name: 'bank-1',
            },
            {
              id: '2',
              name: 'bank-2',
            },
            {
              id: '3',
              name: 'bank-3',
            },
          ],
        }),
        statusCode: 200,
      });
    });

    it('should return an empty array if no banks are available', async () => {
      DocumentClient.prototype.query = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({}),
      });

      await handler({}, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          items: [],
        }),
        statusCode: 200,
      });
    });
  });
});
