import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import ErrorResponse from './error-response';

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
  ): Promise<void> => {
    try {
      const result = await handler(event, context);

      callback(null, result);
    } catch (e) {
      if (e instanceof ErrorResponse) {
        callback(null, {
          body: e.body,
          statusCode: e.statusCode,
        });
      } else {
        callback(null, e);
      }
    }
  };

export default apiGatewayHandler;
