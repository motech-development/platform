/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError, ResponseType } from 'axios';
import { useEffect, useState } from 'react';

interface IOptions<TData> {
  onCompleted?(data: TData): void;
  onError?(error: Error): void;
  responseType?: ResponseType;
}

interface IHeaders {
  [name: string]: string;
}

type UseAxiosWithBody<TData, TBody> = [
  (url: string, input: TBody, headers?: IHeaders) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: Error;
    loading: boolean;
  },
];

type UseAxiosWithoutBody<TData> = [
  (url: string, headers?: IHeaders) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: Error;
    loading: boolean;
  },
];

type Method = 'GET' | 'POST' | 'PUT';

const client = axios.create();

export const useGet = <T>(url: string, headers?: IHeaders) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await client.get<T>(url, {
          headers,
        });

        setData(response.data);
      } catch (e) {
        setError(e);
      }
    })();
  }, [url]);

  useEffect(complete, [data, error]);

  return {
    data,
    error,
    loading,
  };
};

export const useLazyGet = <TData>(
  options?: IOptions<TData>,
): UseAxiosWithoutBody<TData> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };
  const execute = async (url: string, headers?: IHeaders) => {
    try {
      const { onCompleted, onError, ...rest } = options!;
      const response = await client.get<TData>(url, {
        ...rest,
        headers,
      });

      setData(response.data);
    } catch (e) {
      setError(e);
    }

    return data;
  };

  useEffect(complete, [data, error]);

  useEffect(() => {
    if (options) {
      const { onCompleted } = options;

      if (onCompleted && data !== undefined) {
        onCompleted(data);
      }
    }
  }, [data]);

  useEffect(() => {
    if (options) {
      const { onError } = options;

      if (onError && error) {
        onError(error);
      }
    }
  }, [error]);

  return [
    execute,
    {
      data,
      error,
      loading,
    },
  ];
};

const useAxios = <TData, TBody>(
  method: Method,
  options?: IOptions<TData>,
): UseAxiosWithBody<TData, TBody> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };
  const execute = async (url: string, body?: TBody, headers?: IHeaders) => {
    try {
      const response = await client.request<TData>({
        data: body,
        headers,
        method,
        url,
      });

      setData(response.data);
    } catch (e) {
      setError(e);
    }

    return data;
  };

  useEffect(complete, [data, error]);

  useEffect(() => {
    if (options) {
      const { onCompleted } = options;

      if (onCompleted && data !== undefined) {
        onCompleted(data);
      }
    }
  }, [data]);

  useEffect(() => {
    if (options) {
      const { onError } = options;

      if (onError && error) {
        onError(error);
      }
    }
  }, [error]);

  return [
    execute,
    {
      data,
      error,
      loading,
    },
  ];
};

export const usePost = <TData, TBody>(options?: IOptions<TData>) =>
  useAxios<TData, TBody>('POST', options);

export const usePut = <TData, TBody>(options?: IOptions<TData>) =>
  useAxios<TData, TBody>('PUT', options);
