import gql from 'graphql-tag';
import createAppSyncClient from './appsync-client';

interface IUpdateBalance {
  balance?: number;
  vat?: {
    owed: number;
    paid: number;
  };
}

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
  return createAppSyncClient().mutate({
    mutation,
    variables: {
      id,
      input,
      owner,
    },
  });
}

export default updateBalance;
