import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import ErrorResponse from './error-response';
import response from './response';

type Handler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

const apiGatewayHandler =
  (handler: Handler) =>
  async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event, context);
    } catch (e) {
      if (e instanceof ErrorResponse) {
        return {
          body: e.body,
          statusCode: e.statusCode,
        };
      }

      return response(
        {
          message: 'Unhandled exception.',
          statusCode: 500,
        },
        500,
      );
    }
  };

export default apiGatewayHandler;
