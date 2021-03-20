import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  IHeaders,
  IOptions,
  Method,
  SetData,
  SetError,
  SetLoading,
  UseWithInput,
  UseWithoutInput,
} from './types';

const client = axios.create();

const executeGet = async <TData>(
  isMounted: boolean,
  url: string,
  setData: SetData<TData>,
  setError: SetError,
  setLoading: SetLoading,
  options: IOptions<TData> = {},
  additionalHeaders: IHeaders = {},
) => {
  if (isMounted) {
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
  }

  return undefined;
};

const executeForm = async <TData, TBody>(
  isMounted: boolean,
  method: Method,
  url: string,
  body: TBody,
  setData: SetData<TData>,
  setError: SetError,
  setLoading: SetLoading,
  options: IOptions<TData> = {},
  additionalHeaders: IHeaders = {},
) => {
  if (isMounted) {
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
  }

  return undefined;
};

const complete = (setLoading: SetLoading) => {
  setLoading(false);
};

const useCallbacks = <TData>(
  data?: TData,
  error?: AxiosError,
  options?: IOptions<TData>,
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

export const useGet = <TData>(url: string, options?: IOptions<TData>) => {
  const isMounted = useRef(true);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  useEffect(() => {
    (async () => {
      await executeGet(
        isMounted.current,
        url,
        setData,
        setError,
        setLoading,
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

export const useLazyGet = <TData>(
  options?: IOptions<TData>,
): UseWithoutInput<TData> => {
  const isMounted = useRef(true);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false);
  const execute = async (url: string, headers?: IHeaders) =>
    executeGet(
      isMounted.current,
      url,
      setData,
      setError,
      setLoading,
      options,
      headers,
    );

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
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

const useFormAction = <TData, TBody>(
  method: Method,
  options?: IOptions<TData>,
): UseWithInput<TData, TBody> => {
  const isMounted = useRef(true);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false);
  const execute = async (url: string, body: TBody, headers?: IHeaders) =>
    executeForm(
      isMounted.current,
      method,
      url,
      body,
      setData,
      setError,
      setLoading,
      options,
      headers,
    );

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
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

export const usePost = <TData, TBody>(options?: IOptions<TData>) =>
  useFormAction<TData, TBody>('POST', options);

export const usePut = <TData, TBody>(options?: IOptions<TData>) =>
  useFormAction<TData, TBody>('PUT', options);
