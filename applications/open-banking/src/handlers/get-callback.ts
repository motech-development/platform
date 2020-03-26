import { Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';

export interface IEvent {
  bank: string;
  callback: string;
  user: string;
}

export const handler: Handler<IEvent> = async event => {
  const { bank, callback, user } = event;
  const endpoint = '/account-auth-requests';

  try {
    const { data } = await httpClient.post(endpoint, {
      callback,
      institutionId: bank,
      userUuid: user,
    });

    return {
      authorisationUrl: data.data.authorisationUrl,
    };
  } catch (e) {
    const { status } = e.response;

    throw new Error(`Unable to authenticate (${status})`);
  }
};
