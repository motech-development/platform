import { APIGatewayEvent, Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';
import proxyHandler from '../shared/proxy-handler';

interface IAccounts {
  data: {
    accountIdentifications: {
      identification: string;
      type: string;
    }[];
    balance: string;
    currency: string;
    id: string;
    type: string;
  }[];
}

export const handler: Handler<APIGatewayEvent> = proxyHandler(async event => {
  const { Consent } = event.headers;

  if (!Consent) {
    const response = {
      body: JSON.stringify({
        message: 'No consent',
        statusCode: 401,
      }),
      statusCode: 401,
    };

    throw response;
  }

  const endpoint = '/accounts';

  try {
    const { data } = await httpClient.get<IAccounts>(endpoint, {
      headers: {
        Consent,
      },
    });

    return {
      body: JSON.stringify({
        items: data.data.map(
          ({ accountIdentifications, balance, currency, id, type }) => ({
            accountIdentifications,
            balance: parseFloat(parseFloat(balance).toFixed(2)),
            currency,
            id,
            type,
          }),
        ),
      }),
      statusCode: 200,
    };
  } catch (e) {
    const { status } = e.response;

    return {
      body: JSON.stringify({
        message: 'Unable to get accounts',
        statusCode: status,
      }),
      statusCode: status,
    };
  }
});
