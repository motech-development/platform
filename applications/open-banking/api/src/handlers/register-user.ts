import { Handler } from 'aws-lambda';
import httpClient, { getErrorStatus } from '../shared/http-client';

interface IEndpoint {
  uuid: string;
}

export interface IEvent {
  companyId: string;
  id: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { id, companyId } = event;
  const applicationUserId = `${id}:${companyId}`;
  const endpoint = '/users';

  try {
    const { data } = await httpClient.post<IEndpoint>(endpoint, {
      applicationUserId,
    });

    return {
      ...event,
      user: data.uuid,
    };
  } catch (e) {
    const status = getErrorStatus(e);

    throw new Error(`Unable to register (${status})`);
  }
};
