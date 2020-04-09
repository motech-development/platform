import { APIGatewayEvent, Handler } from 'aws-lambda';

const proxyHandler = (
  handler: Handler<APIGatewayEvent>,
): Handler<APIGatewayEvent> => async (event, context, callback) => {
  try {
    const result = await handler(event, context, callback);

    callback(null, result);
  } catch (e) {
    callback(null, e);
  }
};

export default proxyHandler;
