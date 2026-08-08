import { type ApolloCache, gql, type Reference } from '@apollo/client';

export interface CompanyCacheValue {
  readonly __typename?: 'Company';
  readonly companyNumber: string;
  readonly id: string;
  readonly name: string;
}

const companyFragment = gql`
  fragment AccountsWebCompanyCacheValue on Company {
    id
    name
    companyNumber
  }
`;

function companiesCacheId(cache: ApolloCache, owner: string) {
  return cache.identify({ __typename: 'Companies', id: owner });
}

export function upsertCompanyInCache(
  cache: ApolloCache,
  owner: string,
  company: CompanyCacheValue,
) {
  const companyReference = cache.writeFragment({
    data: { ...company, __typename: 'Company' },
    fragment: companyFragment,
  });
  const collectionId = companiesCacheId(cache, owner);

  if (!companyReference || !collectionId) {
    return;
  }

  cache.modify({
    fields: {
      items(existing: readonly Reference[] | undefined, { readField }) {
        const current = existing ?? [];
        const next = [
          ...current.filter(
            (reference) => readField<string>('id', reference) !== company.id,
          ),
          companyReference,
        ];

        return next.sort((left, right) =>
          (readField<string>('name', left) ?? '').localeCompare(
            readField<string>('name', right) ?? '',
          ),
        );
      },
    },
    id: collectionId,
  });
}

export function removeCompanyFromCache(
  cache: ApolloCache,
  owner: string,
  companyId: string,
) {
  const collectionId = companiesCacheId(cache, owner);

  if (collectionId) {
    cache.modify({
      fields: {
        items(existing: readonly Reference[] | undefined, { readField }) {
          return (existing ?? []).filter(
            (reference) => readField<string>('id', reference) !== companyId,
          );
        },
      },
      id: collectionId,
    });
  }

  cache.evict({ id: cache.identify({ __typename: 'Company', id: companyId }) });
  cache.gc();
}
