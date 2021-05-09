import aws4 from 'aws4';
import { Handler } from 'aws-lambda';
import axios from 'axios';
import { stringify } from 'qs';
import { number, object, string } from 'yup';

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
  const host = ENDPOINT.replace('https://', '');
  const path = `/${STAGE}/api/v1/notifications`;
  const url = ENDPOINT + path;
  const data = {
    message: 'REPORT_READY_TO_DOWNLOAD',
    owner,
    payload: stringify(payload),
  };
  const opts = {
    body: JSON.stringify(data),
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    host,
    method: 'POST',
    path,
    url,
  };

  const request = aws4.sign(opts);

  delete request.headers.Host;
  delete request.headers['Content-Length'];

  await axios(request);

  return {
    complete: true,
  };
};
