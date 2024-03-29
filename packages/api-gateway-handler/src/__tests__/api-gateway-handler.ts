import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import proxyHandler from '../api-gateway-handler';
import ErrorResponse from '../error-response';

describe('api-gateway-handler', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      body: '',
    } as APIGatewayProxyEvent;
  });

  it('should call the callback with the correct response', async () => {
    const handler = async () =>
      Promise.resolve({
        body: '',
        statusCode: 200,
      });

    await proxyHandler(handler)(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: '',
      statusCode: 200,
    });
  });

  it('should return the error response when thrown', async () => {
    const error = new ErrorResponse('Something has gone wrong.', 502);
    const handler = () => {
      throw error;
    };

    await proxyHandler(handler)(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: 'Something has gone wrong.',
      statusCode: 502,
    });
  });
});
