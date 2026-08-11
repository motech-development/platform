import { type ApolloCache, gql } from '@apollo/client';
import {
  removeEntityFromCache,
  upsertNamedEntityInCache,
} from '../collection-cache';

export interface CompanyCacheValue {
  readonly __typename?: 'Company';
  readonly companyNumber: string;
  readonly id: string;
  readonly name: string;
}

const companyFragment = gql`
  fragment CompanyCacheValue on Company {
    id
    name
    companyNumber
  }
`;

export function upsertCompanyInCache(
  cache: ApolloCache,
  owner: string,
  company: CompanyCacheValue,
) {
  upsertNamedEntityInCache({
    cache,
    collectionId: owner,
    collectionTypeName: 'Companies',
    entity: company,
    entityFragment: companyFragment,
    entityTypeName: 'Company',
  });
}

export function removeCompanyFromCache(
  cache: ApolloCache,
  owner: string,
  companyId: string,
) {
  removeEntityFromCache({
    cache,
    collectionId: owner,
    collectionTypeName: 'Companies',
    entityId: companyId,
    entityTypeName: 'Company',
  });
}
