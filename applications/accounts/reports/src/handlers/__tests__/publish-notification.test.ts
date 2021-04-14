import aws4 from 'aws4';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
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

      (aws4.sign as jest.Mock).mockReturnValue({
        body: JSON.stringify({
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        }),
        data: {
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        },
        headers: {
          Authorization: 'Auth goes here...',
          'Content-Length': '123',
          'Content-Type': 'application/json',
          Host: 'host-value',
        },
        host: 'api.com',
        method: 'POST',
        path: '/production/api/v1/notifications',
        url: 'https://api.com/production/api/v1/notifications',
      });
    });

    afterEach(() => {
      process.env = env;
    });

    it('should sign the request with the correct params', async () => {
      await handler(event, context, callback);

      expect(aws4.sign).toHaveBeenCalledWith({
        body: JSON.stringify({
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        }),
        data: {
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        },
        headers: {
          'Content-Type': 'application/json',
        },
        host: 'api.com',
        method: 'POST',
        path: '/production/api/v1/notifications',
        url: 'https://api.com/production/api/v1/notifications',
      });
    });

    it('should make the correct request', async () => {
      await handler(event, context, callback);

      expect(axios).toHaveBeenCalledWith({
        body: JSON.stringify({
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        }),
        data: {
          message: 'REPORT_READY_TO_DOWNLOAD',
          owner: 'OWNER-ID',
        },
        headers: {
          Authorization: 'Auth goes here...',
          'Content-Type': 'application/json',
        },
        host: 'api.com',
        method: 'POST',
        path: '/production/api/v1/notifications',
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
