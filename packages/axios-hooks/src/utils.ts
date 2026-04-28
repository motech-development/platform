import { IHeaders, Method, ResponseType } from './types';

interface IRequestOptions {
  body?: unknown;
  headers?: IHeaders;
  method: Method;
  responseType?: ResponseType;
  url: string;
}

const isBodyInit = (body: unknown): body is BodyInit =>
  typeof body === 'string' ||
  body instanceof Blob ||
  body instanceof FormData ||
  body instanceof URLSearchParams ||
  body instanceof ArrayBuffer ||
  ArrayBuffer.isView(body) ||
  (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream);

const createBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  if (isBodyInit(body)) {
    return body;
  }

  return JSON.stringify(body);
};

const createHeaders = (headers: IHeaders = {}, body?: unknown): IHeaders => {
  if (body === undefined || isBodyInit(body)) {
    return headers;
  }

  const hasContentType = Object.keys(headers).some(
    (header) => header.toLowerCase() === 'content-type',
  );

  if (hasContentType) {
    return headers;
  }

  return {
    ...headers,
    'Content-Type': 'application/json',
  };
};

const parseJson = <TData>(value: string): TData => {
  if (!value) {
    return null as TData;
  }

  return JSON.parse(value) as TData;
};

const parseResponse = async <TData>(
  response: Response,
  responseType?: ResponseType,
): Promise<TData> => {
  if (responseType === 'arrayBuffer') {
    return response.arrayBuffer() as Promise<TData>;
  }

  if (responseType === 'blob') {
    return response.blob() as Promise<TData>;
  }

  if (responseType === 'text') {
    return response.text() as Promise<TData>;
  }

  const text = await response.text();

  if (responseType === 'json') {
    return parseJson<TData>(text);
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return parseJson<TData>(text);
  }

  return (text || null) as TData;
};

const request = async <TData>({
  body,
  headers,
  method,
  responseType,
  url,
}: IRequestOptions): Promise<TData> => {
  const response = await fetch(url, {
    body: createBody(body),
    headers: createHeaders(headers, body),
    method,
  });

  if (!response.ok) {
    let data = null as TData;

    try {
      data = await parseResponse<TData>(response, responseType);
    } catch {
      data = null as TData;
    }

    throw Object.assign(new Error(response.statusText), {
      response: {
        data,
        status: response.status,
        statusText: response.statusText,
      },
      status: response.status,
    });
  }

  const data = await parseResponse<TData>(response, responseType);

  return data;
};

export default request;
