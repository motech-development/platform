import { gql } from '@apollo/client';
import { describe, expect, it } from 'vitest';
import { createAccountsCache } from '../../data/cache';
import { removeClientFromCache, upsertClientInCache } from './cache-updates';

const clientsQuery = gql`
  query ClientCacheTest($companyId: ID!) {
    getClients(id: $companyId) {
      __typename
      id
      items {
        __typename
        id
        name
      }
    }
  }
`;

function seedCache() {
  const cache = createAccountsCache();

  cache.writeQuery({
    data: {
      getClients: {
        __typename: 'Clients',
        id: 'company-id',
        items: [
          { __typename: 'Client', id: 'bravo', name: 'Bravo Limited' },
          { __typename: 'Client', id: 'charlie', name: 'Charlie Limited' },
        ],
      },
    },
    query: clientsQuery,
    variables: { companyId: 'company-id' },
  });

  return cache;
}

function clientIds(cache: ReturnType<typeof createAccountsCache>) {
  return cache
    .readQuery<{ getClients: { items: { id: string }[] } }>({
      query: clientsQuery,
      variables: { companyId: 'company-id' },
    })
    ?.getClients.items.map(({ id }) => id);
}

describe('client collection reconciliation', () => {
  it('inserts new clients once in name order', () => {
    const cache = seedCache();
    const client = {
      __typename: 'Client' as const,
      id: 'alpha',
      name: 'Alpha Limited',
    };

    upsertClientInCache(cache, 'company-id', client);
    upsertClientInCache(cache, 'company-id', client);

    expect(clientIds(cache)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('reorders an updated client and removes a deleted client', () => {
    const cache = seedCache();

    upsertClientInCache(cache, 'company-id', {
      __typename: 'Client',
      id: 'charlie',
      name: 'alpha limited',
    });

    expect(clientIds(cache)).toEqual(['charlie', 'bravo']);

    removeClientFromCache(cache, 'company-id', 'bravo');

    expect(clientIds(cache)).toEqual(['charlie']);
  });
});
