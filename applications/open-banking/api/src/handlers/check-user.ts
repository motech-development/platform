import { Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';

interface IEndpoint {
  uuid: string;
}

export interface IEvent {
  user: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { user } = event;
  const endpoint = `/users/${user}`;

  try {
    const { data } = await httpClient.get<IEndpoint>(endpoint);

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
