import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  IHeaders,
  IOptions,
  ISet,
  Method,
  SetLoading,
  UseWithInput,
  UseWithoutInput,
} from './types';

const client = axios.create();

const executeGet = async <TData, TError>(
  url: string,
  { setData, setError, setLoading }: ISet<TData, TError>,
  options: IOptions<TData, TError> = {},
  additionalHeaders: IHeaders = {},
) => {
  try {
    setLoading(true);

    const { headers, onCompleted, onError, ...rest } = options;
    const opts = {
      ...rest,
      headers: {
        ...headers,
        ...additionalHeaders,
      },
    };
    const { data } = await client.request<TData>({
      ...opts,
      method: 'GET',
      url,
    });

    setData(data);

    return data;
  } catch (e) {
    setError(e);

    return undefined;
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

    const { headers, onCompleted, onError, ...rest } = options;
    const opts = {
      ...rest,
      headers: {
        ...headers,
        ...additionalHeaders,
      },
    };
    const { data } = await client.request<TData>({
      ...opts,
      data: body,
      method,
      url,
    });

    setData(data);

    return data;
  } catch (e) {
    setError(e);

    return undefined;
  }
};

const complete = (setLoading: SetLoading) => {
  setLoading(false);
};

const useCallbacks = <TData, TError>(
  data?: TData,
  error?: AxiosError<TError>,
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
) => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError<TError>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await executeGet(
        url,
        {
          setData,
          setError,
          setLoading,
        },
        options,
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => complete(setLoading), [data, error]);

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
  const [error, setError] = useState<AxiosError<TError>>();
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

  useEffect(() => complete(setLoading), [data, error]);

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
  const [error, setError] = useState<AxiosError<TError>>();
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

  useEffect(() => complete(setLoading), [data, error]);

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
) => useFormAction<TData, TBody, TError>('POST', options);

export const usePut = <TData = unknown, TBody = unknown, TError = unknown>(
  options?: IOptions<TData, TError>,
) => useFormAction<TData, TBody, TError>('PUT', options);
