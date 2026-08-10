import type { ApolloCache, Reference } from '@apollo/client';
import type { DocumentNode } from 'graphql';

interface NamedCacheEntity {
  readonly id: string;
  readonly name: string;
}

interface CollectionCacheIdentity {
  cache: ApolloCache;
  collectionId: string;
  collectionTypeName: string;
  entityTypeName: string;
}

export function upsertNamedEntityInCache<T extends NamedCacheEntity>({
  cache,
  collectionId,
  collectionTypeName,
  entity,
  entityFragment,
  entityTypeName,
}: CollectionCacheIdentity &
  Readonly<{ entity: T; entityFragment: DocumentNode }>) {
  const entityReference = cache.writeFragment({
    data: { ...entity, __typename: entityTypeName },
    fragment: entityFragment,
  });
  const cacheCollectionId = cache.identify({
    __typename: collectionTypeName,
    id: collectionId,
  });

  if (!entityReference || !cacheCollectionId) return;

  cache.modify({
    fields: {
      items(existing: readonly Reference[] | undefined, { readField }) {
        const next = [
          ...(existing ?? []).filter(
            (reference) => readField<string>('id', reference) !== entity.id,
          ),
          entityReference,
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
    id: cacheCollectionId,
  });
}

export function removeEntityFromCache({
  cache,
  collectionId,
  collectionTypeName,
  entityId,
  entityTypeName,
}: CollectionCacheIdentity & Readonly<{ entityId: string }>) {
  const cacheCollectionId = cache.identify({
    __typename: collectionTypeName,
    id: collectionId,
  });

  if (cacheCollectionId) {
    cache.modify({
      fields: {
        items(existing: readonly Reference[] | undefined, { readField }) {
          return (existing ?? []).filter(
            (reference) => readField<string>('id', reference) !== entityId,
          );
        },
      },
      id: cacheCollectionId,
    });
  }

  cache.evict({
    id: cache.identify({ __typename: entityTypeName, id: entityId }),
  });
  cache.gc();
}
