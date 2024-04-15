/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import updateBalance, { ITransaction } from '../shared/update-balance';
import { isStreamModifyRecord } from '../shared/utils';

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

      logger.info('Balance', {
        balance: {
          __typename,
          balance,
          id,
          owner,
          transactions,
          vat,
        },
      });

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
    const result = await Promise.all(mutations);

    logger.info('Update balance result', {
      result,
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error('Unhandled exception', e);
    }
  }
};
