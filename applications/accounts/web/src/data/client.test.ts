import { ApolloLink, gql, Observable } from '@apollo/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsWebConfig } from '../config';
import { captureGraphqlFailure } from '../observability';
import { createAccountsApolloClient } from './client';

const mocks = vi.hoisted(() => ({
  createAuthLink: vi.fn(),
  createSubscriptionHandshakeLink: vi.fn(),
}));

vi.mock('aws-appsync-auth-link', async (importOriginal) => ({
  ...(await importOriginal<typeof import('aws-appsync-auth-link')>()),
  createAuthLink: mocks.createAuthLink,
}));

vi.mock('aws-appsync-subscription-link', async (importOriginal) => ({
  ...(await importOriginal<typeof import('aws-appsync-subscription-link')>()),
  createSubscriptionHandshakeLink: mocks.createSubscriptionHandshakeLink,
}));

vi.mock('../observability', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../observability')>()),
  captureGraphqlFailure: vi.fn(),
}));

const config = {
  appsyncUrl: 'https://example.test/graphql',
  auth0Audience: 'https://example.test/api',
  auth0ClientId: 'client-id',
  auth0Domain: 'auth.example.test',
  commitSha: 'commit-sha',
  region: 'eu-west-2',
  stage: 'local',
} satisfies AccountsWebConfig;

describe('createAccountsApolloClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createAuthLink.mockReturnValue(
      new ApolloLink((operation, forward) => forward(operation)),
    );
  });

  it('executes authenticated GraphQL operations', async () => {
    mocks.createSubscriptionHandshakeLink.mockReturnValue(
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next({ data: { health: 'ok' } });
            observer.complete();
          }),
      ),
    );
    const client = createAccountsApolloClient(config);

    const result = await client.query<{ health: string }>({
      fetchPolicy: 'no-cache',
      query: gql`
        query ClientHealth {
          health
        }
      `,
    });

    expect(result.data).toEqual({ health: 'ok' });
  });

  it('resolves client pagination state from the cache', async () => {
    mocks.createSubscriptionHandshakeLink.mockReturnValue(
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next({
              data: {
                getClients: {
                  __typename: 'Clients',
                  id: 'company-id',
                  items: [],
                  nextToken: null,
                },
              },
            });
            observer.complete();
          }),
      ),
    );
    const client = createAccountsApolloClient(config);

    const result = await client.query<{
      getClients: {
        clientLoadedPageCount: number;
        clientRefreshGeneration: number;
        clientRequestedPageCount: number;
      };
    }>({
      fetchPolicy: 'network-only',
      query: gql`
        query ClientsWithPaginationState($id: ID!) {
          getClients(id: $id) {
            clientLoadedPageCount @client
            clientRefreshGeneration @client
            clientRequestedPageCount @client
            id
            items {
              id
            }
            nextToken
          }
        }
      `,
      variables: { id: 'company-id' },
    });

    expect(result.data?.getClients).toMatchObject({
      clientLoadedPageCount: 1,
      clientRefreshGeneration: 0,
      clientRequestedPageCount: 1,
    });
  });

  it('reports GraphQL transport failures with operation context', async () => {
    const transportError = new Error('Connection failed');
    mocks.createSubscriptionHandshakeLink.mockReturnValue(
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.error(transportError);
          }),
      ),
    );
    const client = createAccountsApolloClient(config);

    await expect(
      client.query({
        fetchPolicy: 'no-cache',
        query: gql`
          query Company($id: ID!) {
            getCompany(id: $id) {
              id
            }
          }
        `,
        variables: { id: 'company-id' },
      }),
    ).rejects.toThrow('Connection failed');

    expect(captureGraphqlFailure).toHaveBeenCalledWith({
      error: transportError,
      operationName: 'Company',
      result: undefined,
      variables: { id: 'company-id' },
    });
  });
});
