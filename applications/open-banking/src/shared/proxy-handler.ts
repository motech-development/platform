import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

const proxyHandler = (handler: Handler<APIGatewayEvent>) => async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    const result = await handler(event, context, callback);

    callback(null, result);
  } catch (e) {
    callback(null, e);
  }
};

export default proxyHandler;
