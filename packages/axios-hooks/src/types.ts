export interface IHeaders {
  [name: string]: string;
}

export type ResponseType = 'arrayBuffer' | 'blob' | 'json' | 'text';

export interface IFetchErrorResponse<TError> {
  data: TError;
  status: number;
  statusText: string;
}

export interface IFetchError<TError> extends Error {
  response?: IFetchErrorResponse<TError>;
  status?: number;
}

export interface IOptions<TData, TError> {
  headers?: IHeaders;
  responseType?: ResponseType;
  onCompleted?: (data: TData) => void;
  onError?: (error: IFetchError<TError>) => void;
}

export interface IResults<TData, TError> {
  data?: TData;
  error?: IFetchError<TError>;
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

export type SetError<TError> = (error: IFetchError<TError>) => void;

export type SetLoading = (loading: boolean) => void;

export interface ISet<TData, TError> {
  setData: SetData<TData>;
  setError: SetError<TError>;
  setLoading: SetLoading;
}
