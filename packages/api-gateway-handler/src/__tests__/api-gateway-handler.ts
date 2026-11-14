import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { MockInstance } from 'vitest';
import proxyHandler from '../api-gateway-handler';
import ErrorResponse from '../error-response';

describe('api-gateway-handler', () => {
  let consoleError: MockInstance;
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    event = {
      body: '',
    } as APIGatewayProxyEvent;

    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the correct response', async () => {
    const handler = async () =>
      Promise.resolve({
        body: '',
        statusCode: 200,
      });

    await expect(proxyHandler(handler)(event, context)).resolves.toEqual({
      body: '',
      statusCode: 200,
    });
  });

  it('should return the error response when thrown', async () => {
    const error = new ErrorResponse('Something has gone wrong.', 502);
    const handler = () => {
      throw error;
    };

    await expect(proxyHandler(handler)(event, context)).resolves.toEqual({
      body: 'Something has gone wrong.',
      statusCode: 502,
    });
  });

  it('should not report an error response', async () => {
    const onError = vi.fn();
    const handler = () => {
      throw new ErrorResponse('Something has gone wrong.', 502);
    };

    await proxyHandler(handler, onError)(event, context);

    expect(onError).not.toHaveBeenCalled();
  });

  it('should return a 500 response when a non-ErrorResponse is thrown', async () => {
    const handler = () => {
      throw new Error('Unexpected failure');
    };

    await expect(proxyHandler(handler)(event, context)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Unhandled exception.',
        statusCode: 500,
      }),
      statusCode: 500,
    });
  });

  it('should log and report a non-ErrorResponse', async () => {
    const error = new Error('Unexpected failure');
    const onError = vi.fn();
    const handler = () => {
      throw error;
    };

    await expect(
      proxyHandler(handler, onError)(event, context),
    ).resolves.toEqual({
      body: JSON.stringify({
        message: 'Unhandled exception.',
        statusCode: 500,
      }),
      statusCode: 500,
    });

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should return a 500 response when reporting fails', async () => {
    const reportingError = new Error('Reporting failed');
    const handler = () => {
      throw new Error('Unexpected failure');
    };
    const onError = () => {
      throw reportingError;
    };

    await expect(
      proxyHandler(handler, onError)(event, context),
    ).resolves.toEqual({
      body: JSON.stringify({
        message: 'Unhandled exception.',
        statusCode: 500,
      }),
      statusCode: 500,
    });

    expect(consoleError).toHaveBeenCalledWith(reportingError);
  });
});
