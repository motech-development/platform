import aws4 from 'aws4';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import axios from 'axios';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler, IEvent } from '../unlink-bank';

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('unlink-bank', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      id: 'company-id',
      owner: 'owner-id',
    };

    aws4.sign = jest.fn().mockReturnValue({
      headers: {
        'Content-Length': 'Content-Length',
        Host: 'HOST',
      },
    });
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

    it('should throw if no endpoint is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No endpoint set',
      );
    });
  });

  describe('with a table and endpoint set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
      process.env.ENDPOINT = 'https://api.location';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw if no stage is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No stage set',
      );
    });
  });

  describe('with a table, endpoint and stage set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
      process.env.ENDPOINT = 'https://api.location';
      process.env.STAGE = 'test';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('when no user is found', () => {
      beforeEach(() => {
        DocumentClient.prototype.get = jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Item: null,
          }),
        });
      });

      it('should not call the endpoont', async () => {
        await handler(event, context, callback);

        expect(axios).not.toHaveBeenCalled();
      });

      it('should return the event', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual(event);
      });
    });

    describe('when a user is found', () => {
      beforeEach(() => {
        DocumentClient.prototype.get = jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Item: {
              user: 'user-id',
            },
          }),
        });
      });

      it('should call the endpoint', async () => {
        await handler(event, context, callback);

        expect(axios).toHaveBeenCalled();
      });

      it('should sign the request with the correct params', async () => {
        await handler(event, context, callback);

        expect(aws4.sign).toHaveBeenCalledWith({
          host: 'api.location',
          method: 'DELETE',
          path: '/test/api/v1/users/user-id',
          url: 'https://api.location/test/api/v1/users/user-id',
        });
      });

      it('should return the event', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual(event);
      });
    });
  });
});
