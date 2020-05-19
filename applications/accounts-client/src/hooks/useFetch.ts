import { useEffect, useState } from 'react';

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
  (url: string, input: TBody, headers?: Headers) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: Error;
    loading: boolean;
  },
];

const useFetch = <TData, TBody>(method: string): UseFetch<TData, TBody> => {
  const [data, setData] = useState<TData>();
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
      const result: TData = await response.json();

      setData(result);
    } catch (e) {
      setError(e);
    }

    return data;
  };

  useEffect(complete, [data, error]);

  return [
    execute,
    {
      data,
      error,
      loading,
    },
  ];
};

export const usePost = <TData, TBody>() => useFetch<TData, TBody>('POST');

export const usePut = <TData, TBody>() => useFetch<TData, TBody>('PUT');
