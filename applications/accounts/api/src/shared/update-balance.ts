import gql from 'graphql-tag';
import type {
  TransactionBeaconMutation,
  TransactionBeaconMutationVariables,
} from '../graphql/graphql';
import createAppSyncClient from './appsync-client';

type IUpdateBalance = {
  balance?: NonNullable<TransactionBeaconMutationVariables['input']['balance']>;
  vat?: NonNullable<TransactionBeaconMutationVariables['input']['vat']>;
};

export const mutation = gql`
  mutation TransactionBeacon(
    $id: ID!
    $owner: String!
    $input: TransactionBeaconInput!
  ) {
    transactionBeacon(id: $id, owner: $owner, input: $input) {
      balance
      id
      owner
      vat {
        owed
        paid
      }
    }
  }
`;

async function updateBalance(id: string, owner: string, input: IUpdateBalance) {
  const variables: TransactionBeaconMutationVariables = {
    id,
    input,
    owner,
  };

  return createAppSyncClient().mutate<
    TransactionBeaconMutation,
    TransactionBeaconMutationVariables
  >({
    mutation,
    variables,
  });
}

export default updateBalance;
