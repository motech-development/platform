import { gql } from '@apollo/client';
import { describe, expect, it } from 'vitest';
import { createAccountsCache } from '../../data/cache';
import { removeCompanyFromCache, upsertCompanyInCache } from './cache-updates';

const companiesQuery = gql`
  query CompanyCacheTest($owner: ID!) {
    getCompanies(id: $owner) {
      __typename
      id
      items {
        __typename
        id
        name
        companyNumber
      }
    }
  }
`;

function seedCache() {
  const cache = createAccountsCache();

  cache.writeQuery({
    data: {
      getCompanies: {
        __typename: 'Companies',
        id: 'owner-id',
        items: [
          {
            __typename: 'Company',
            companyNumber: '00000002',
            id: 'bravo',
            name: 'Bravo Limited',
          },
          {
            __typename: 'Company',
            companyNumber: '00000003',
            id: 'charlie',
            name: 'Charlie Limited',
          },
        ],
      },
    },
    query: companiesQuery,
    variables: { owner: 'owner-id' },
  });

  return cache;
}

function companyIds(cache: ReturnType<typeof createAccountsCache>) {
  return cache
    .readQuery<{ getCompanies: { items: { id: string }[] } }>({
      query: companiesQuery,
      variables: { owner: 'owner-id' },
    })
    ?.getCompanies.items.map(({ id }) => id);
}

describe('company collection reconciliation', () => {
  it('inserts new companies once in name order', () => {
    const cache = seedCache();
    const company = {
      __typename: 'Company' as const,
      companyNumber: '00000001',
      id: 'alpha',
      name: 'Alpha Limited',
    };

    upsertCompanyInCache(cache, 'owner-id', company);
    upsertCompanyInCache(cache, 'owner-id', company);

    expect(companyIds(cache)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('reorders an updated company and removes a deleted company', () => {
    const cache = seedCache();

    upsertCompanyInCache(cache, 'owner-id', {
      __typename: 'Company',
      companyNumber: '00000003',
      id: 'charlie',
      name: 'bravo limited',
    });

    expect(companyIds(cache)).toEqual(['bravo', 'charlie']);

    removeCompanyFromCache(cache, 'owner-id', 'bravo');

    expect(companyIds(cache)).toEqual(['charlie']);
  });
});
