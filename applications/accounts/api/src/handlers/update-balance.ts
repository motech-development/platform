/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import { DynamoDBStreamHandler } from 'aws-lambda';
import gql from 'graphql-tag';
import { isStreamModifyRecord } from '../shared/utils';

interface ITransaction {
  balance: number;
  currency: string;
  date: string;
}

interface IBalance {
  __typename: string;
  balance: number;
  id: string;
  owner: string;
  transactions: ITransaction;
  vat: {
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

interface IUpdateBalance {
  balance?: number;
  transactions?: ITransaction;
  vat?: {
    owed: number;
    paid: number;
  };
}

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

export const handler: DynamoDBStreamHandler = async (event) => {
  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  const { Records } = event;

  const mutations = Records.filter(isStreamModifyRecord)
    .map(({ dynamodb }) => {
      const { NewImage } = dynamodb;

      const { __typename, balance, id, owner, transactions, vat } = unmarshall(
        NewImage as Record<string, AttributeValue>,
      ) as IBalance;

      return {
        __typename,
        balance,
        id,
        owner,
        transactions,
        vat,
      };
    })
    .filter(({ __typename }) => __typename === 'Balance')
    .map(({ balance, id, owner, transactions, vat }) =>
      updateBalance(id, owner, {
        balance,
        transactions,
        vat,
      }),
    );

  try {
    await Promise.all(mutations);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error('Unhandled exception', e);
    }
  }
};
