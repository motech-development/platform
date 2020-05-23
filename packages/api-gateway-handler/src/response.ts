const response = <T>(body: T, statusCode: number) => ({
  body: typeof body === 'string' ? body : JSON.stringify(body),
  statusCode,
});

export default response;
