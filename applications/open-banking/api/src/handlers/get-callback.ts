import { Handler } from 'aws-lambda';
import httpClient, { getErrorStatus } from '../shared/http-client';

interface IEndpoint {
  data: {
    authorisationUrl: string;
  };
}

export interface IEvent {
  bank: string;
  callback: string;
  user: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { bank, callback, user } = event;
  const endpoint = '/account-auth-requests';

  try {
    const { data } = await httpClient.post<IEndpoint>(endpoint, {
      callback,
      institutionId: bank,
      userUuid: user,
    });

    return {
      ...event,
      authorisationUrl: data.data.authorisationUrl,
    };
  } catch (e) {
    const status = getErrorStatus(e);

    throw new Error(`Unable to authenticate (${status})`);
  }
};
