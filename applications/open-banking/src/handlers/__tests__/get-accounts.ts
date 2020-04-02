import { APIGatewayEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../get-accounts';
import httpClient from '../../shared/http-client';

describe('get-accounts', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: Pick<APIGatewayEvent, 'headers'>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      headers: {
        Consent: 'consent',
      },
    };

    httpClient.get = jest.fn();
  });

  it('should return error if no consent header set', async () => {
    delete event.headers.Consent;

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No consent',
        statusCode: 401,
      }),
      statusCode: 401,
    });
  });

  it('should call the correct endpoint', async () => {
    await handler(event as APIGatewayEvent, context, callback);

    expect(httpClient.get).toHaveBeenCalledWith('/accounts', {
      headers: {
        Consent: 'consent',
      },
    });
  });

  it('should return success response', async () => {
    (httpClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: [
          {
            accountIdentifications: [
              {
                identification: 'ACCOUNT_NUMBER',
                type: '12345678',
              },
              {
                identification: 'SORT_CODE',
                type: '123456',
              },
            ],
            balance: '100.00',
            currency: 'GBP',
            id: 'account-id',
            type: 'BUSINESS',
          },
        ],
      },
    });

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        items: [
          {
            accountIdentifications: [
              {
                identification: 'ACCOUNT_NUMBER',
                type: '12345678',
              },
              {
                identification: 'SORT_CODE',
                type: '123456',
              },
            ],
            balance: '100.00',
            currency: 'GBP',
            id: 'account-id',
            type: 'BUSINESS',
          },
        ],
      }),
      statusCode: 200,
    });
  });

  it('should return an error response if request fails', async () => {
    (httpClient.get as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    await handler(event as APIGatewayEvent, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'Unable to get accounts',
        statusCode: 404,
      }),
      statusCode: 404,
    });
  });
});
