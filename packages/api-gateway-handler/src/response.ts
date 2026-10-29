import type { APIGatewayProxyResult } from 'aws-lambda';

type IResponse = Pick<APIGatewayProxyResult, 'body' | 'statusCode'>;

const response = <T>(body: T, statusCode: number): IResponse => ({
  body: typeof body === 'string' ? body : JSON.stringify(body),
  statusCode,
});

export default response;
