import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import axios from 'axios';
import { handler, IEvent } from '../send-result';

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const BankCallbackMutation = `
  mutation BankCallback($input: BankCallbackInput!) {
    bankCallback(input: $input) {
      authorisationUrl
    }
  }
`;

describe('send-result', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      authorisationUrl: 'https://auth.url',
      id: 'id',
      token: 'gql-auth-token',
      url: 'https://gql.endpoint/graphql',
    };
  });

  it('should send the correct mutation', async () => {
    await handler(event, context, callback);

    expect(axios).toHaveBeenCalledWith({
      data: JSON.stringify({
        operationName: 'BankCallback',
        query: BankCallbackMutation,
        variables: {
          input: {
            authorisationUrl: 'https://auth.url',
            id: 'id',
          },
        },
      }),
      headers: {
        Authorization: 'gql-auth-token',
      },
      method: 'POST',
      url: 'https://gql.endpoint/graphql',
    });
  });

  it('should return the success response', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      complete: true,
    });
  });
});
