import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';

type Handler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

const apiGatewayHandler =
  (handler: Handler) =>
  async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>,
  ) => {
    try {
      const result = await handler(event, context);

      callback(null, result);
    } catch (e) {
      callback(null, e);
    }
  };

export default apiGatewayHandler;
