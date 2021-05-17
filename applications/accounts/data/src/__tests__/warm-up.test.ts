import { Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ctx from 'aws-lambda-mock-context';
import { advanceTo, clear } from 'jest-date-mock';
import { handler } from '../warm-up';

describe('warm up', () => {
  let callback: jest.Mock;
  let context: Context;

  beforeAll(() => {
    advanceTo('2021-04-11T19:45:00+00:00');
  });

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();
  });

  afterAll(clear);

  it('should throw an error if table is not set', async () => {
    await expect(handler(null, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('when table is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'TABLE-NAME';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should input the correct data into the database', async () => {
      await handler(null, context, callback);

      expect(DocumentClient.prototype.put).toHaveBeenCalledWith({
        Item: {
          __typename: 'WarmUp',
          createdAt: '2021-04-11T19:45:00.000Z',
          data: 'WarmUp:2021-04-11T19:45:00.000Z',
          id: 'test-uuid',
          ttl: 1618170300,
        },
        TableName: 'TABLE-NAME',
      });
    });

    it('should complete correctly', async () => {
      await expect(handler(null, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
