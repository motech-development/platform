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

type UsePut<T, X = FormData> = [
  (url: string, input: X, headers?: IHeaders) => Promise<void>,
  {
    data?: T;
    error?: Error;
    loading: boolean;
  },
];

export const usePut = <T, X = FormData>(): UsePut<T, X> => {
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
        method: 'PUT',
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
