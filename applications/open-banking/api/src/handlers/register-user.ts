import { Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';

export interface IEvent {
  companyId: string;
  id: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { id, companyId } = event;
  const applicationUserId = `${id}:${companyId}`;
  const endpoint = '/users';

  try {
    const { data } = await httpClient.post(endpoint, {
      applicationUserId,
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
