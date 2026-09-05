import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import type {
  DynamoDBBatchResponse,
  DynamoDBRecord,
  DynamoDBStreamHandler,
} from 'aws-lambda';
import publishTransactionChange from '../shared/publish-transaction-change';
import updateBalance from '../shared/update-balance';

export interface IBalance {
  __typename: 'Balance';
  balance: number;
  id: string;
  owner: string;
  vat: {
    owed: number;
    paid: number;
  };
}

interface ITransactionScope {
  __typename: 'Transaction';
  companyId: string;
  owner: string;
}

const publishRecord = async ({ eventName, dynamodb }: DynamoDBRecord) => {
  const image =
    eventName === 'REMOVE' ? dynamodb?.OldImage : dynamodb?.NewImage;

  if (!image) return;

  const item = unmarshall(image as Record<string, AttributeValue>) as
    | IBalance
    | ITransactionScope;

  const { __typename: typename } = item;

  if (typename === 'Balance' && eventName === 'MODIFY') {
    const { balance, id, owner, vat } = item;
    await updateBalance(id, owner, { balance, vat });
  }

  if (typename === 'Transaction') {
    const { companyId, owner } = item;

    if (!companyId || !owner) {
      throw new Error('Transaction is missing its company or owner');
    }

    // Also invalidate the former scope if a record moves between companies.
    if (eventName === 'MODIFY' && dynamodb?.OldImage) {
      const previous = unmarshall(
        dynamodb.OldImage as Record<string, AttributeValue>,
      ) as ITransactionScope;

      if (
        previous.companyId &&
        previous.owner &&
        (previous.companyId !== companyId || previous.owner !== owner)
      ) {
        await publishTransactionChange(previous.companyId, previous.owner);
      }
    }

    await publishTransactionChange(companyId, owner);
  }
};

export const handler: DynamoDBStreamHandler = async (event) => {
  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  return event.Records.reduce<Promise<DynamoDBBatchResponse>>(
    async (previous, record) => {
      const result = await previous;
      if (result.batchItemFailures.length > 0) return result;

      try {
        await publishRecord(record);
        return { batchItemFailures: [] };
      } catch (error) {
        logger.error('Failed to publish transaction stream record', { error });

        const sequenceNumber = record.dynamodb?.SequenceNumber;
        if (!sequenceNumber) throw error;

        // Stop here: Lambda retries from this checkpoint, including later records.
        return { batchItemFailures: [{ itemIdentifier: sequenceNumber }] };
      }
    },
    Promise.resolve({ batchItemFailures: [] }),
  );
};
