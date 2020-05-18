import { useEffect, useState } from 'react';

interface IHeaders {
  [name: string]: string;
}

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

type UseFetch<T, X = FormData> = [
  (url: string, input: X, headers?: IHeaders) => Promise<void>,
  {
    data?: T;
    error?: Error;
    loading: boolean;
  },
];

const useFetch = <T, X = FormData>(method: string): UseFetch<T, X> => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const complete = () => {
    setLoading(false);
  };
  const execute = async (url: string, input: X, headers?: IHeaders) => {
    try {
      const body = input instanceof FormData ? input : JSON.stringify(input);
      const response = await fetch(url, {
        body,
        headers,
        method,
      });
      const result = await response.json();

      setData(result);
    } catch (e) {
      setError(e);
    }
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

export const usePost = <T, X = FormData>() => useFetch<T, X>('POST');

export const usePut = <T, X = FormData>() => useFetch<T, X>('PUT');
