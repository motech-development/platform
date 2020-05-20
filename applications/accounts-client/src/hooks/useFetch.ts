/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface IUseFetchOptions<TData> {
  onCompleted?(data?: TData | string): void;
  onError?(error: Error): void;
}

const parseResponse = <T>(text: string) => {
  try {
    const response = JSON.parse(text) as T;

    return response;
  } catch {
    return text;
  }
};

export const useGet = <T>(url: string) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();

        setData(result);
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

type UseFetch<TData, TBody> = [
  (
    url: string,
    input: TBody,
    headers?: Headers,
  ) => Promise<TData | string | undefined>,
  {
    data?: TData | string;
    error?: Error;
    loading: boolean;
  },
];

const useFetch = <TData, TBody>(
  method: string,
  options?: IUseFetchOptions<TData>,
): UseFetch<TData, TBody> => {
  const [data, setData] = useState<string | TData>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };
  const execute = async (url: string, input: TBody, headers?: Headers) => {
    try {
      const body = input instanceof FormData ? input : JSON.stringify(input);
      const response = await fetch(url, {
        body,
        headers,
        method,
      });
      const text = await response.text();
      const result = parseResponse<TData>(text);

      setData(result);
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

export const usePost = <TData, TBody>(options?: IUseFetchOptions<TData>) =>
  useFetch<TData, TBody>('POST', options);

export const usePut = <TData, TBody>(options?: IUseFetchOptions<TData>) =>
  useFetch<TData, TBody>('PUT', options);
