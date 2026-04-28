import { useEffect, useState } from 'react';
import {
  IFetchError,
  IHeaders,
  IOptions,
  IResults,
  ISet,
  Method,
  UseWithInput,
  UseWithoutInput,
} from './types';
import request from './utils';

const normalizeFetchError = <TError>(error: unknown): IFetchError<TError> => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
};

const executeGet = async <TData, TError>(
  url: string,
  { setData, setError, setLoading }: ISet<TData, TError>,
  options: IOptions<TData, TError> = {},
  additionalHeaders: IHeaders = {},
) => {
  try {
    setLoading(true);

    const { headers, responseType } = options;
    const data = await request<TData, TError>({
      headers: {
        ...headers,
        ...additionalHeaders,
      },
      method: 'GET',
      responseType,
      url,
    });

    setData(data);

    return data;
  } catch (error) {
    setError(normalizeFetchError<TError>(error));

    return undefined;
  } finally {
    setLoading(false);
  }
};

const executeForm = async <TData, TBody, TError>(
  method: Method,
  url: string,
  body: TBody,
  { setData, setError, setLoading }: ISet<TData, TError>,
  options: IOptions<TData, TError> = {},
  additionalHeaders: IHeaders = {},
) => {
  try {
    setLoading(true);

    const { headers, responseType } = options;
    const data = await request<TData, TError>({
      body,
      headers: {
        ...headers,
        ...additionalHeaders,
      },
      method,
      responseType,
      url,
    });

    setData(data);

    return data;
  } catch (error) {
    setError(normalizeFetchError<TError>(error));

    return undefined;
  } finally {
    setLoading(false);
  }
};

const useCallbacks = <TData, TError>(
  data?: TData,
  error?: IFetchError<TError>,
  options?: IOptions<TData, TError>,
) => {
  useEffect(() => {
    if (options) {
      const { onCompleted } = options;

      if (onCompleted && data !== undefined) {
        onCompleted(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (options) {
      const { onError } = options;

      if (onError && error) {
        onError(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
};

export const useGet = <TData = unknown, TError = unknown>(
  url: string,
  options?: IOptions<TData, TError>,
): IResults<TData, TError> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<IFetchError<TError>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    executeGet(
      url,
      {
        setData,
        setError,
        setLoading,
      },
      options,
    ).then(
      () => {},
      () => {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCallbacks(data, error, options);

  return {
    data,
    error,
    loading,
  };
};

export const useLazyGet = <TData = unknown, TError = unknown>(
  options?: IOptions<TData, TError>,
): UseWithoutInput<TData, TError> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<IFetchError<TError>>();
  const [loading, setLoading] = useState(false);
  const execute = async (url: string, headers?: IHeaders) =>
    executeGet(
      url,
      {
        setData,
        setError,
        setLoading,
      },
      options,
      headers,
    );

  useCallbacks(data, error, options);

  return [
    execute,
    {
      data,
      error,
      loading,
    },
  ];
};

const useFormAction = <TData, TBody, TError>(
  method: Method,
  options?: IOptions<TData, TError>,
): UseWithInput<TData, TBody, TError> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<IFetchError<TError>>();
  const [loading, setLoading] = useState(false);
  const execute = async (url: string, body: TBody, headers?: IHeaders) =>
    executeForm(
      method,
      url,
      body,
      {
        setData,
        setError,
        setLoading,
      },
      options,
      headers,
    );

  useCallbacks(data, error, options);

  return [
    execute,
    {
      data,
      error,
      loading,
    },
  ];
};

export const usePost = <TData = unknown, TBody = unknown, TError = unknown>(
  options?: IOptions<TData, TError>,
): UseWithInput<TData, TBody, TError> =>
  useFormAction<TData, TBody, TError>('POST', options);

export const usePut = <TData = unknown, TBody = unknown, TError = unknown>(
  options?: IOptions<TData, TError>,
): UseWithInput<TData, TBody, TError> =>
  useFormAction<TData, TBody, TError>('PUT', options);
