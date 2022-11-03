interface IResponse {
  body: string;
  statusCode: number;
}

const response = <T>(body: T, statusCode: number): IResponse => ({
  body: typeof body === 'string' ? body : JSON.stringify(body),
  statusCode,
});

export default response;
