import response from './response';

const paramCheck = <T>(
  envVar: T | null | undefined,
  message: string,
  statusCode: number,
) => {
  if (!envVar) {
    throw response(
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
