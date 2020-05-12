import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler, IEvent } from '../delete-records';

describe('delete-records', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      count: 2,
      current: 0,
      items: [
        ['client-id-1', 'client-id-2'],
        ['client-id-3', 'client-id-4'],
      ],
    };
  });

  it('should throw if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
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

    it('should throw if no typename set is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No typename set',
      );
    });
  });

  describe('with a table and typename set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
      process.env.TYPENAME = 'Client';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call batchWrite with the correct params', async () => {
      await handler(event, context, callback);

      expect(DocumentClient.prototype.batchWrite).toHaveBeenCalledWith({
        RequestItems: {
          'app-table': [
            {
              DeleteRequest: {
                Key: {
                  __typename: 'Client',
                  id: 'client-id-1',
                },
              },
            },
            {
              DeleteRequest: {
                Key: {
                  __typename: 'Client',
                  id: 'client-id-2',
                },
              },
            },
          ],
        },
      });
    });

    it('should should not complete', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        ...event,
        complete: false,
        current: 1,
      });
    });

    it('should should complete', async () => {
      event.current = 1;

      await expect(handler(event, context, callback)).resolves.toEqual({
        ...event,
        complete: true,
        current: 2,
      });
    });
  });
});
