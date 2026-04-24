import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import proxyHandler from '../api-gateway-handler';
import ErrorResponse from '../error-response';

describe('api-gateway-handler', () => {
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    event = {
      body: '',
    } as APIGatewayProxyEvent;
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
});
