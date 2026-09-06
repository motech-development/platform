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
  id: string;
  companyId: string;
  owner: string;
}

const publishBalance = async (
  { id, owner, balance, vat }: IBalance,
  dynamodb: DynamoDBRecord['dynamodb'],
) => {
  if (
    typeof id !== 'string' ||
    id.length === 0 ||
    typeof owner !== 'string' ||
    owner.length === 0 ||
    !Number.isFinite(balance) ||
    !Number.isFinite(vat?.owed) ||
    !Number.isFinite(vat?.paid)
  ) {
    logger.error('Skipping balance without a valid ID, owner, balance or VAT', {
      keys: dynamodb?.Keys,
      sequenceNumber: dynamodb?.SequenceNumber,
    });
    return;
  }

  await updateBalance(id, owner, {
    balance,
    vat: { owed: vat.owed, paid: vat.paid },
  });
};

const hasTransactionScope = (
  item: IBalance | ITransactionScope | undefined,
): item is ITransactionScope => {
  if (!item) return false;
  const { __typename: typename } = item;
  if (typename !== 'Transaction') return false;
  const { companyId, owner, id } = item;

  return (
    typeof id === 'string' &&
    id.length > 0 &&
    typeof companyId === 'string' &&
    companyId.length > 0 &&
    typeof owner === 'string' &&
    owner.length > 0
  );
};

const publishRecord = async ({ eventName, dynamodb }: DynamoDBRecord) => {
  const image =
    eventName === 'REMOVE' ? dynamodb?.OldImage : dynamodb?.NewImage;

  const item = image
    ? (unmarshall(image as Record<string, AttributeValue>) as
        | IBalance
        | ITransactionScope)
    : undefined;

  // Invalidate the former scope even when the new image cannot be published.
  if (eventName === 'MODIFY' && dynamodb?.OldImage) {
    const previous = unmarshall(
      dynamodb.OldImage as Record<string, AttributeValue>,
    ) as ITransactionScope;

    if (
      hasTransactionScope(previous) &&
      (!hasTransactionScope(item) ||
        previous.companyId !== item.companyId ||
        previous.owner !== item.owner ||
        previous.id !== item.id)
    ) {
      await publishTransactionChange(
        previous.companyId,
        previous.owner,
        previous.id,
      );
    }
  }

  if (!item) return;
  const { __typename: typename } = item;

  if (typename === 'Balance' && eventName === 'MODIFY') {
    await publishBalance(item, dynamodb);
  }

  if (typename === 'Transaction') {
    const { companyId, owner, id } = item;

    if (!hasTransactionScope(item)) {
      // Retrying an immutable malformed stream image cannot recover its scope.
      logger.error(
        'Skipping transaction without a valid transaction ID, company or owner',
        {
          keys: dynamodb?.Keys,
          sequenceNumber: dynamodb?.SequenceNumber,
        },
      );
      return;
    }

    await publishTransactionChange(companyId, owner, id);
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
