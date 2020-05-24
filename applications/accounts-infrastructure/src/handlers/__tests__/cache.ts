import { CloudFrontResponseEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../cache';

describe('cache', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: CloudFrontResponseEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      Records: [
        {
          cf: {
            request: {},
            response: {
              headers: {},
              status: '200',
            },
          },
        },
      ],
    } as CloudFrontResponseEvent;
  });

  it('should do nothing if the status code is not 200', () => {
    const { response } = event.Records[0].cf;

    response.status = '400';

    handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, response);
  });

  it('should not cache index.html', () => {
    const { request, response } = event.Records[0].cf;

    request.uri = 'index.html';

    handler(event, context, callback);

    const result = {
      ...response,
      headers: {
        'Cache-Control': [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    };

    expect(callback).toHaveBeenCalledWith(null, result);
  });

  it('should not cache i18n assets', () => {
    const { request, response } = event.Records[0].cf;

    request.uri = 'locales/en/global.json';

    handler(event, context, callback);

    const result = {
      ...response,
      headers: {
        'Cache-Control': [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    };

    expect(callback).toHaveBeenCalledWith(null, result);
  });

  it('should cache all other assets', () => {
    const { request, response } = event.Records[0].cf;

    request.uri = 'favicon.ico';

    handler(event, context, callback);

    const result = {
      ...response,
      headers: {
        'Cache-Control': [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    };

    expect(callback).toHaveBeenCalledWith(null, result);
  });
});
