import { type ApolloCache, gql } from '@apollo/client';
import {
  removeEntityFromCache,
  upsertNamedEntityInCache,
} from '../collection-cache';

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

export function upsertClientInCache(
  cache: ApolloCache,
  companyId: string,
  client: ClientCacheValue,
) {
  upsertNamedEntityInCache({
    cache,
    collectionId: companyId,
    collectionTypeName: 'Clients',
    entity: client,
    entityFragment: clientFragment,
    entityTypeName: 'Client',
  });
}

export function removeClientFromCache(
  cache: ApolloCache,
  companyId: string,
  clientId: string,
) {
  removeEntityFromCache({
    cache,
    collectionId: companyId,
    collectionTypeName: 'Clients',
    entityId: clientId,
    entityTypeName: 'Client',
  });
}
