import { Handler } from 'aws-lambda';
import axios from 'axios';

export interface IEvent {
  authorisationUrl: string;
  id: string;
  token: string;
  url: string;
}

const SendBankCallbackMutation = `
  mutation SendBankCallback($input: BankCallbackInput!) {
    sendBankCallback(input: $input) {
      authorisationUrl
    }
  }
`;

export const handler: Handler<IEvent> = async event => {
  const { authorisationUrl, id, token, url } = event;
  const mutation = {
    operationName: 'SendBankCallback',
    query: SendBankCallbackMutation,
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
