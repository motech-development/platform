import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { aws4Interceptor } from 'aws4-axios';
import axios from 'axios';
import { handler, IEvent } from '../publish-notification';

describe('publish-notification', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      owner: 'OWNER-ID',
      payload: {
        createdAt: '2021-04-11T19:45:00.000Z',
        downloadUrl: 'https://download.url/report.zip',
        id: 'test-uuid',
        ttl: 1618256700,
      },
    };
  });

  it('should throw an error if no endpoint is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No endpoint set',
    );
  });

  describe('when an endpoint is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.ENDPOINT = 'https://api.com';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no stage is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No stage set',
      );
    });
  });

  describe('when an endpoint and stage is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.ENDPOINT = 'https://api.com';
      process.env.STAGE = 'production';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should apply the aws4 interceptor', async () => {
      await handler(event, context, callback);

      expect(axios.interceptors.request.use).toHaveBeenCalledWith(
        aws4Interceptor({}),
      );
    });

    it('should make the correct request', async () => {
      await handler(event, context, callback);

      expect(axios.request).toHaveBeenCalledWith({
        data: {
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
          payload:
            'createdAt=2021-04-11T19%3A45%3A00.000Z&downloadUrl=https%3A%2F%2Fdownload.url%2Freport.zip&id=test-uuid&ttl=1618256700',
        },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: 'https://api.com/production/api/v1/notifications',
      });
    });

    it('should return complete', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
