import { AxiosError, ResponseType } from 'axios';

export interface IHeaders {
  [name: string]: string;
}

export interface IOptions<TData> {
  headers?: IHeaders;
  responseType?: ResponseType;
  onCompleted?(data: TData): void;
  onError?(error: AxiosError): void;
}

export type UseWithInput<TData, TBody> = [
  (url: string, body: TBody, headers?: IHeaders) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: AxiosError;
    loading: boolean;
  },
];

export type UseWithoutInput<TData> = [
  (url: string, headers?: IHeaders) => Promise<TData | undefined>,
  {
    data?: TData;
    error?: AxiosError;
    loading: boolean;
  },
];

export type Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export type SetData<TData> = (data: TData) => void;

export type SetError = (error: AxiosError) => void;

export type SetLoading = (loading: boolean) => void;
