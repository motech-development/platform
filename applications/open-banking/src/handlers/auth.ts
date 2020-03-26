import { APIGatewayEvent, Handler } from 'aws-lambda';
import { object, string } from 'yup';
import httpClient from '../shared/http-client';
import proxyHandler from '../shared/proxy-handler';
import validateBody from '../shared/validate-body';

const schema = object().shape({
  bank: string().required(),
  callback: string().required(),
  user: string().required(),
});

export const post: Handler<APIGatewayEvent> = proxyHandler(async event => {
  const body = await validateBody(schema, event.body);
  const endpoint = '/account-auth-requests';

  try {
    const { data } = await httpClient.post(endpoint, {
      callback: body.callback,
      institutionId: body.bank,
      userUuid: body.user,
    });

    return {
      body: JSON.stringify({
        authorisationUrl: data.data.authorisationUrl,
      }),
      statusCode: 200,
    };
  } catch (e) {
    const { status } = e.response;

    return {
      body: JSON.stringify({
        message: 'Unable to authenticate',
        statusCode: status,
      }),
      statusCode: status,
    };
  }
});
