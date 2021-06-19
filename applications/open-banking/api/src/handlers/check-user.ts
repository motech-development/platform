import { Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';

export interface IEvent {
  user: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { user } = event;
  const endpoint = `/users/${user}`;

  try {
    const { data } = await httpClient.get(endpoint);

    return {
      ...event,
      register: false,
      user: data.uuid,
    };
  } catch (e) {
    return {
      ...event,
      register: true,
    };
  }
};
