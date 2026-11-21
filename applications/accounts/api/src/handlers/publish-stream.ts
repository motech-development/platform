import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type {
  DynamoDBBatchResponse,
  DynamoDBRecord,
  DynamoDBStreamHandler,
  StreamRecord,
} from 'aws-lambda';
import type { Balance, Transaction } from '../graphql/graphql';
import applyBalance from '../shared/apply-balance';
import publishNotification, {
  isNotificationRecord,
} from '../shared/publish-notification';
import publishTransactionChange from '../shared/publish-transaction-change';
import transactionCompanyId from '../shared/transaction-company-id';
import updateBalance from '../shared/update-balance';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const documentClient = new DynamoDBClient({});

export type IBalance = Pick<Balance, 'balance' | 'id' | 'owner' | 'vat'> & {
  __typename: 'Balance';
};

type ITransactionScope = Pick<Transaction, 'companyId' | 'id'> & {
  __typename: 'Transaction';
  owner: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isBalanceRecord = (item: Record<string, unknown>): item is IBalance => {
  const { __typename: typename, balance, id, owner, vat } = item;

  return (
    typename === 'Balance' &&
    typeof id === 'string' &&
    id.length > 0 &&
    typeof owner === 'string' &&
    owner.length > 0 &&
    typeof balance === 'number' &&
    Number.isFinite(balance) &&
    typeof vat === 'object' &&
    vat !== null &&
    'owed' in vat &&
    typeof vat.owed === 'number' &&
    Number.isFinite(vat.owed) &&
    'paid' in vat &&
    typeof vat.paid === 'number' &&
    Number.isFinite(vat.paid)
  );
};

const publishBalance = async (
  tableName: string,
  companyId: string,
  dynamodb: DynamoDBRecord['dynamodb'],
) => {
  const { Item: item } = await documentClient.send(
    new GetCommand({
      ConsistentRead: true,
      Key: {
        __typename: 'Balance',
        id: companyId,
      },
      TableName: tableName,
    }),
  );

  if (!item || !isBalanceRecord(item)) {
    logger.error('Skipping balance without a valid ID, owner, balance or VAT', {
      keys: dynamodb?.Keys,
      sequenceNumber: dynamodb?.SequenceNumber,
    });

    return;
  }

  const { id, owner, balance, vat } = item;

  await updateBalance(id, owner, {
    balance,
    vat: {
      owed: vat.owed,
      paid: vat.paid,
    },
  });
};

const hasTransactionScope = (
  item: Record<string, unknown> | undefined,
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

const readImage = (image: StreamRecord['NewImage']) => {
  if (!image) return undefined;

  const item: unknown = unmarshall(image as Record<string, AttributeValue>);

  if (!isRecord(item)) return undefined;

  const { __typename: typename } = item;

  if (typename === 'Transaction') {
    item.companyId = transactionCompanyId(item);
  }

  return item;
};

const publishRecord = async (tableName: string, record: DynamoDBRecord) => {
  const { eventName, dynamodb } = record;
  const companyIds = await applyBalance(documentClient, tableName, record);

  await Promise.all(
    companyIds.map((companyId) =>
      publishBalance(tableName, companyId, dynamodb),
    ),
  );

  const image =
    eventName === 'REMOVE' ? dynamodb?.OldImage : dynamodb?.NewImage;

  const item = readImage(image);

  // Invalidate the former scope even when the new image cannot be published.
  if (eventName === 'MODIFY' && dynamodb?.OldImage) {
    const previous = readImage(dynamodb.OldImage);

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

  if (eventName === 'INSERT' && isNotificationRecord(item)) {
    await publishNotification(item);
  }

  if (typename === 'Transaction') {
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

    await publishTransactionChange(item.companyId, item.owner, item.id);
  }
};

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { AWS_REGION, ENDPOINT, TABLE } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  if (!TABLE) {
    throw new Error('No table set');
  }

  return event.Records.reduce<Promise<DynamoDBBatchResponse>>(
    async (previous, record) => {
      const result = await previous;

      if (result.batchItemFailures.length > 0) return result;

      try {
        await publishRecord(TABLE, record);

        return {
          batchItemFailures: [],
        };
      } catch (error) {
        logger.error('Failed to publish stream record', {
          error,
        });

        const sequenceNumber = record.dynamodb?.SequenceNumber;

        if (!sequenceNumber) throw error;

        captureException(error);

        // Stop here: Lambda retries from this checkpoint, including later records.
        return {
          batchItemFailures: [
            {
              itemIdentifier: sequenceNumber,
            },
          ],
        };
      }
    },
    Promise.resolve({
      batchItemFailures: [],
    }),
  );
});
