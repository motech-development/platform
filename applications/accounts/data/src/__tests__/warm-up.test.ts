import { Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ctx from 'aws-lambda-mock-context';
import { advanceTo, clear } from 'jest-date-mock';
import { handler } from '../warm-up';

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

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
      jest.useFakeTimers();

      env = {
        ...process.env,
      };

      process.env.TABLE = 'TABLE-NAME';

      (DocumentClient.prototype.get as jest.Mock).mockReturnValue({
        promise: jest
          .fn()
          .mockResolvedValueOnce({
            Item: {
              __typename: 'WarmUp',
              createdAt: '2021-04-11T19:45:00.000Z',
              data: 'WarmUp:2021-04-11T19:45:00.000Z',
              id: 'test-uuid',
              ttl: 1618170300,
            },
          })
          .mockResolvedValueOnce({
            Item: undefined,
          }),
      });
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call get the correct number of times', async () => {
      const result = handler(null, context, callback);

      await flushPromises();

      jest.runAllTimers();

      await result;

      expect(DocumentClient.prototype.get).toHaveBeenCalledTimes(2);
    });

    it('should input the correct data into the database', async () => {
      const result = handler(null, context, callback);

      await flushPromises();

      jest.runAllTimers();

      await result;

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
      const result = handler(null, context, callback);

      await flushPromises();

      jest.runAllTimers();

      await expect(result).resolves.toEqual({
        complete: true,
      });
    });

    it('should throw an error if database has not warmed up', async () => {
      (DocumentClient.prototype.get as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Item: {
            __typename: 'WarmUp',
            createdAt: '2021-04-11T19:45:00.000Z',
            data: 'WarmUp:2021-04-11T19:45:00.000Z',
            id: 'test-uuid',
            ttl: 1618170300,
          },
        }),
      });

      const result = handler(null, context, callback);

      await flushPromises();

      jest.runAllTimers();

      await flushPromises();

      jest.runAllTimers();

      await flushPromises();

      jest.runAllTimers();

      await flushPromises();

      jest.runAllTimers();

      await flushPromises();

      jest.runAllTimers();

      await expect(result).rejects.toThrow('Database has not warmed up');
    });
  });
});
