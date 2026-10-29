import gql from 'graphql-tag';
import type {
  TransactionChangeBeaconMutation,
  TransactionChangeBeaconMutationVariables,
} from '../graphql/graphql';
import createAppSyncClient from './appsync-client';

export const mutation = gql`
  mutation TransactionChangeBeacon(
    $id: ID!
    $owner: String!
    $transactionId: ID!
  ) {
    transactionChangeBeacon(
      id: $id
      owner: $owner
      transactionId: $transactionId
    ) {
      id
      owner
      transactionId
    }
  }
`;

const publishTransactionChange = async (
  id: string,
  owner: string,
  transactionId: string,
): ReturnType<ReturnType<typeof createAppSyncClient>['mutate']> =>
  createAppSyncClient().mutate<
    TransactionChangeBeaconMutation,
    TransactionChangeBeaconMutationVariables
  >({
    mutation,
    variables: {
      id,
      owner,
      transactionId,
    },
  });

export default publishTransactionChange;
