import { Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';

export interface IEvent {
  id: string;
}

export const handler: Handler<IEvent> = async event => {
  const { id } = event;
  const endpoint = '/users';

  try {
    const { data } = await httpClient.post(endpoint, {
      applicationUserId: id,
    });

    return {
      ...event,
      user: data.uuid,
    };
  } catch (e) {
    const { status } = e.response;

    throw new Error(`Unable to register (${status})`);
  }
};
