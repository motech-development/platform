import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import proxyHandler from '../api-gateway-handler';

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
    const handler = async () => ({
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
    const handler = () => {
      const response = {
        body: JSON.stringify({
          message: 'No table set',
          statusCode: 500,
        }),
        statusCode: 500,
      };

      throw response;
    };

    await proxyHandler(handler)(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No table set',
        statusCode: 500,
      }),
      statusCode: 500,
    });
  });
});
