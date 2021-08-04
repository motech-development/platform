import { Handler } from 'aws-lambda';
import axios from 'axios';

export interface IEvent {
  authorisationUrl: string;
  id: string;
  token: string;
  url: string;
}

const BankCallbackMutation = `
  mutation BankCallback($input: BankCallbackInput!) {
    bankCallback(input: $input) {
      authorisationUrl
    }
  }
`;

export const handler: Handler<IEvent> = async (event) => {
  const { authorisationUrl, id, token, url } = event;
  const mutation = {
    operationName: 'BankCallback',
    query: BankCallbackMutation,
    variables: {
      input: {
        authorisationUrl,
        id,
      },
    },
  };

  await axios({
    data: JSON.stringify(mutation),
    headers: {
      Authorization: token,
    },
    method: 'POST',
    url,
  });

  return {
    complete: true,
  };
};
