import { type ApolloCache, gql, type Reference } from '@apollo/client';

export interface ClientCacheValue {
  readonly __typename?: 'Client';
  readonly id: string;
  readonly name: string;
}

const clientFragment = gql`
  fragment AccountsWebClientCacheValue on Client {
    id
    name
  }
`;

function clientsCacheId(cache: ApolloCache, companyId: string) {
  return cache.identify({ __typename: 'Clients', id: companyId });
}

export function upsertClientInCache(
  cache: ApolloCache,
  companyId: string,
  client: ClientCacheValue,
) {
  const clientReference = cache.writeFragment({
    data: { ...client, __typename: 'Client' },
    fragment: clientFragment,
  });
  const collectionId = clientsCacheId(cache, companyId);

  if (!clientReference || !collectionId) return;

  cache.modify({
    fields: {
      items(existing: readonly Reference[] | undefined, { readField }) {
        const current = existing ?? [];
        const next = [
          ...current.filter(
            (reference) => readField<string>('id', reference) !== client.id,
          ),
          clientReference,
        ];

        return next.sort((left, right) =>
          (readField<string>('name', left) ?? '').localeCompare(
            readField<string>('name', right) ?? '',
            'en-GB',
            { sensitivity: 'base' },
          ),
        );
      },
    },
    id: collectionId,
  });
}

export function removeClientFromCache(
  cache: ApolloCache,
  companyId: string,
  clientId: string,
) {
  const collectionId = clientsCacheId(cache, companyId);

  if (collectionId) {
    cache.modify({
      fields: {
        items(existing: readonly Reference[] | undefined, { readField }) {
          return (existing ?? []).filter(
            (reference) => readField<string>('id', reference) !== clientId,
          );
        },
      },
      id: collectionId,
    });
  }

  cache.evict({ id: cache.identify({ __typename: 'Client', id: clientId }) });
  cache.gc();
}
