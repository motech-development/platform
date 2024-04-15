import { APIGatewayEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import httpClient from '../../shared/http-client';
import { handler } from '../delete-user';

describe('delete-user', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: Pick<APIGatewayEvent, 'pathParameters'>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      pathParameters: {
        userId: 'user-id',
      },
    };

    httpClient.delete = jest.fn();
  });

  it('should return error if no path params set', async () => {
    event.pathParameters = null;

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No params set',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });

  it('should return error if no user id is set', async () => {
    event.pathParameters = {};

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No user id',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });

  it('should call the correct endpoint', async () => {
    await handler(event as APIGatewayEvent, context, callback);

    expect(httpClient.delete).toHaveBeenCalledWith('/users/user-id');
  });

  it('should return an empty response if user is deleted', async () => {
    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: '',
      statusCode: 204,
    });
  });

  it('should return an error response if user delete fails', async () => {
    (httpClient.delete as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'Unable to delete user',
        statusCode: 500,
      }),
      statusCode: 500,
    });
  });
});
