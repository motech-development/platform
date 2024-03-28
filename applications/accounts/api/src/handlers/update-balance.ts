/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { isStreamModifyRecord } from '../shared/utils';
import updateBalance, { ITransaction } from '../shared/update-balance';

export interface IBalance {
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
