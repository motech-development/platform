import { AxiosError, ResponseType } from 'axios';

export interface IHeaders {
  [name: string]: string;
}

export interface IOptions<TData, TError> {
  headers?: IHeaders;
  responseType?: ResponseType;
  onCompleted?: (data: TData) => void;
  onError?: (error: AxiosError<TError>) => void;
}

export interface IResults<TData, TError> {
  data?: TData;
  error?: AxiosError<TError>;
  loading: boolean;
}

export type UseWithInput<TData, TBody, TError> = [
  (url: string, body: TBody, headers?: IHeaders) => Promise<TData | undefined>,
  IResults<TData, TError>,
];

export type UseWithoutInput<TData, TError> = [
  (url: string, headers?: IHeaders) => Promise<TData | undefined>,
  IResults<TData, TError>,
];

export type Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export type SetData<TData> = (data: TData) => void;

export type SetError<TError> = (error: AxiosError<TError>) => void;

export type SetLoading = (loading: boolean) => void;

export interface ISet<TData, TError> {
  setData: SetData<TData>;
  setError: SetError<TError>;
  setLoading: SetLoading;
}
