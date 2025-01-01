import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AWSAppSyncClient } from 'aws-appsync';
import gql from 'graphql-tag';

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
  const credentials = fromNodeProviderChain({});

  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  const client = new AWSAppSyncClient({
    auth: {
      credentials,
      type: 'AWS_IAM',
    },
    disableOffline: true,
    region: AWS_REGION,
    url: ENDPOINT,
  });

  return client.mutate({
    mutation,
    variables: {
      id,
      input,
      owner,
    },
  });
}

export default updateBalance;
