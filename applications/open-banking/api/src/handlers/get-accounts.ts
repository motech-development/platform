import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import httpClient, { getErrorStatus } from '../shared/http-client';

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

export const handler = apiGatewayHandler(async (event) => {
  const Consent = paramCheck(event.headers.Consent, 'No consent', 401);
  const endpoint = '/accounts';

  try {
    const { data } = await httpClient.get<IAccounts>(endpoint, {
      headers: {
        Consent,
      },
    });

    return response(
      {
        items: data.data.map(
          ({ accountIdentifications, balance, currency, id, type }) => ({
            accountIdentifications,
            balance: Math.round(parseFloat(balance) * 1e2) / 1e2,
            currency,
            id,
            type,
          }),
        ),
      },
      200,
    );
  } catch (e) {
    const status = getErrorStatus(e);

    return response(
      {
        message: 'Unable to get accounts',
        statusCode: status,
      },
      status,
    );
  }
});
