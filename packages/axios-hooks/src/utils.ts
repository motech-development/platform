import axios, { AxiosError } from 'axios';

export const client = axios.create();

export const isAxiosError = <T>(payload: unknown): payload is AxiosError<T> =>
  typeof payload === 'object' && payload !== null && 'isAxiosError' in payload;
