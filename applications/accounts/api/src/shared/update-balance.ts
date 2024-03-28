import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AWSAppSyncClient } from 'aws-appsync';
import gql from 'graphql-tag';

export interface ITransaction {
  balance: number;
  currency: string;
  date: string;
}

interface IUpdateBalance {
  balance?: number;
  transactions?: ITransaction;
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
      transactions {
        balance
        currency
        date
        items {
          amount
          attachment
          category
          companyId
          date
          description
          id
          name
          refund
          scheduled
          status
          vat
        }
      }
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
