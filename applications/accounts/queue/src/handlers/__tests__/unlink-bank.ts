import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { aws4Interceptor } from 'aws4-axios';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import { handler, IEvent } from '../unlink-bank';

describe('unlink-bank', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsStub<ServiceInputTypes, ServiceOutputTypes>;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    ddb = mockClient(DynamoDBClient);

    event = {
      id: 'company-id',
      owner: 'owner-id',
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
        ddb.on(GetCommand).resolves({});
      });

      it('should not call the endpoont', async () => {
        await handler(event, context, callback);

        expect(axios.request).not.toHaveBeenCalled();
      });

      it('should return the event', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual(event);
      });
    });

    describe('when a user is found', () => {
      beforeEach(() => {
        ddb.on(GetCommand).resolves({
          Item: {
            user: 'user-id',
          },
        });
      });

      it('should call the endpoint', async () => {
        await handler(event, context, callback);

        expect(axios.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: 'https://api.location/test/api/v1/users/user-id',
        });
      });

      it('should sign the request with the correct params', async () => {
        await handler(event, context, callback);

        expect(axios.interceptors.request.use).toHaveBeenCalledWith(
          aws4Interceptor({
            instance: axios,
          }),
        );
      });

      it('should return the event', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual(event);
      });
    });
  });
});
