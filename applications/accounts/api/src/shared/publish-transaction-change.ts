import gql from 'graphql-tag';
import createAppSyncClient from './appsync-client';

export const mutation = gql`
  mutation TransactionChangeBeacon($id: ID!, $owner: String!) {
    transactionChangeBeacon(id: $id, owner: $owner) {
      id
      owner
    }
  }
`;

const publishTransactionChange = async (id: string, owner: string) =>
  createAppSyncClient().mutate({
    mutation,
    variables: { id, owner },
  });

export default publishTransactionChange;
