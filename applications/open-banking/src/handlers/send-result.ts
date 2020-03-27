import { Handler } from 'aws-lambda';
import axios from 'axios';

export interface IEvent {
  authorisationUrl: string;
  id: string;
  token: string;
  url: string;
}

const SendBackCallbackMutation = `
  mutation SendBackCallback($input: BankCallbackInput!) {
    sendBackCallback(input: $input) {
      authorisationUrl
    }
  }
`;

export const handler: Handler<IEvent> = async event => {
  const { authorisationUrl, id, token, url } = event;
  const mutation = {
    operationName: 'SendBackCallback',
    query: SendBackCallbackMutation,
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
