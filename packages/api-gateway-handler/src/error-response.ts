import response from './response';

class ErrorResponse<T> extends Error {
  public body: string;

  public statusCode: number;

  constructor(body: T, statusCode: number) {
    super();

    const res = response(body, statusCode);

    this.body = res.body;

    this.statusCode = res.statusCode;
  }
}

export default ErrorResponse;
