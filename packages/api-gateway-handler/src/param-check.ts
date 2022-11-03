import ErrorResponse from './error-response';

const paramCheck = <T>(
  envVar: T | null | undefined,
  message: string,
  statusCode: number,
): T => {
  if (!envVar) {
    throw new ErrorResponse(
      {
        message,
        statusCode,
      },
      statusCode,
    );
  }

  return envVar;
};

export default paramCheck;
