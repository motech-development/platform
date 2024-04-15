import { Handler } from 'aws-lambda';
import { aws4Interceptor } from 'aws4-axios';
import axios from 'axios';
import { stringify } from 'qs';
import { number, object, string } from 'yup';

const instance = axios.create();

const interceptor = aws4Interceptor({});

instance.interceptors.request.use(interceptor);

const schema = object({
  owner: string().required(),
  payload: object({
    createdAt: string().required(),
    downloadUrl: string().required(),
    id: string().required(),
    ttl: number().required(),
  }).required(),
}).required();

export interface IEvent {
  owner: string;
  payload: {
    createdAt: string;
    downloadUrl: string;
    id: string;
    ttl: number;
  };
}

export const handler: Handler<IEvent> = async (event) => {
  const { ENDPOINT, STAGE } = process.env;

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  if (!STAGE) {
    throw new Error('No stage set');
  }

  const { owner, payload } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const path = `/${STAGE}/api/v1/notifications`;
  const url = ENDPOINT + path;
  const data = {
    message: 'REPORT_READY_TO_DOWNLOAD',
    owner,
    payload: stringify(payload),
  };

  await instance.request({
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url,
  });

  return {
    complete: true,
  };
};
