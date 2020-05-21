/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface IOptions<TData> {
  onCompleted?(data?: TData | string): void;
  onError?(error: Error): void;
}

interface IHeaders {
  [name: string]: string;
}

const client = axios.create();

export const useGet = <T>(url: string) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await client.get<T>(url);

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

type UseAxios<TData, TBody> = [
  (url: string, input: TBody, headers?: IHeaders) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: Error;
    loading: boolean;
  },
];

type Method = 'POST' | 'PUT';

const useAxios = <TData, TBody>(
  method: Method,
  options?: IOptions<TData>,
): UseAxios<TData, TBody> => {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };
  const execute = async (url: string, body: TBody, headers?: IHeaders) => {
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
