import type {
  ApolloCache,
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import type { DocumentNode } from 'graphql';

interface NamedCacheEntity {
  readonly id: string;
  readonly name: string;
}

interface CollectionCacheIdentity {
  cache: ApolloCache;
  collectionFieldName?: string;
  collectionId: string;
  collectionTypeName: string;
  entityTypeName: string;
}

type ModifyCollectionItems = (
  existing: readonly Reference[],
  readField: FieldFunctionOptions['readField'],
) => readonly Reference[];

function modifyCollectionItems(
  {
    cache,
    collectionFieldName,
    collectionId,
    collectionTypeName,
  }: CollectionCacheIdentity,
  modifyItems: ModifyCollectionItems,
) {
  const cacheCollectionId = cache.identify({
    __typename: collectionTypeName,
    id: collectionId,
  });

  if (cacheCollectionId) {
    cache.modify({
      fields: {
        items(existing: readonly Reference[] | undefined, { readField }) {
          return modifyItems(existing ?? [], readField);
        },
      },
      id: cacheCollectionId,
    });
    return;
  }

  if (!collectionFieldName) return;

  cache.modify({
    fields: {
      [collectionFieldName](
        existing: Reference | StoreObject | undefined,
        { readField },
      ) {
        if (
          !existing ||
          '__ref' in existing ||
          readField<string>('id', existing) !== collectionId
        ) {
          return existing;
        }

        return {
          ...existing,
          items: modifyItems(
            readField<readonly Reference[]>('items', existing) ?? [],
            readField,
          ),
        };
      },
    },
    id: 'ROOT_QUERY',
  });
}

export function upsertNamedEntityInCache<T extends NamedCacheEntity>({
  cache,
  collectionFieldName,
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

  if (!entityReference) return;

  modifyCollectionItems(
    {
      cache,
      collectionFieldName,
      collectionId,
      collectionTypeName,
      entityTypeName,
    },
    (existing, readField) => {
      const next = [
        ...existing.filter(
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
  );
}

export function removeEntityFromCache({
  cache,
  collectionFieldName,
  collectionId,
  collectionTypeName,
  entityId,
  entityTypeName,
}: CollectionCacheIdentity & Readonly<{ entityId: string }>) {
  modifyCollectionItems(
    {
      cache,
      collectionFieldName,
      collectionId,
      collectionTypeName,
      entityTypeName,
    },
    (existing, readField) =>
      existing.filter(
        (reference) => readField<string>('id', reference) !== entityId,
      ),
  );

  cache.evict({
    id: cache.identify({ __typename: entityTypeName, id: entityId }),
  });
  cache.gc();
}
