import { createHash, randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import type { AppSyncResolverHandler } from 'aws-lambda';
import type {
  MutationAddTransactionArgs,
  TransactionInput,
} from '../graphql/graphql';

type TTransaction = Record<string, unknown>;

interface IErrorResult {
  errorMessage: string;
  errorType: string;
}

interface ITransactionCreationReceipt {
  commandId: string;
  owner: string;
  payloadHash: string;
  transaction: TTransaction;
}

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const maxTransactionConflictAttempts = 3;

const payloadFor = ({
  amount,
  attachment,
  category,
  companyId,
  date,
  description,
  name,
  refund,
  scheduled,
  status,
  vat,
}: TransactionInput) => ({
  amount,
  attachment,
  category,
  companyId,
  date,
  description,
  name,
  refund,
  scheduled,
  status,
  vat,
});

const payloadHashFor = (input: TransactionInput): string =>
  createHash('sha256')
    .update(JSON.stringify(payloadFor(input)))
    .digest('hex');

const transactionFor = (
  input: TransactionInput,
  owner: string,
  transactionId: string,
): TTransaction => {
  const attributes = Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => key !== 'id' && value !== '',
    ),
  );

  return {
    __typename: 'Transaction',
    createdAt: new Date().toISOString(),
    data: `${owner}:${input.companyId}:${input.status}:${input.date}`,
    groupsCanAccess: ['Admin'],
    ...attributes,
    id: transactionId,
    owner,
  };
};

const receiptFor = (
  input: TransactionInput,
  owner: string,
  payloadHash: string,
  transaction: TTransaction,
): ITransactionCreationReceipt | undefined =>
  input.id
    ? {
        commandId: input.id,
        owner,
        payloadHash,
        transaction,
      }
    : undefined;

const receiptIdFor = (owner: string, commandId: string): string => {
  const commandKey = JSON.stringify([owner, commandId]);
  const digest = createHash('sha256').update(commandKey).digest('hex');

  return `transaction-creation:${digest}`;
};

const isTransactionCancelled = (
  error: unknown,
): error is Error & { CancellationReasons?: { Code?: string }[] } =>
  error instanceof Error && error.name === 'TransactionCanceledException';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const transactionItemsFor = (
  transaction: TTransaction,
  tableName: string,
  owner: string,
  companyId: string,
  receipt: ITransactionCreationReceipt | undefined,
) => [
  {
    ConditionCheck: {
      ConditionExpression: '#owner = :owner',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':owner': owner,
      },
      Key: {
        __typename: 'Company',
        id: companyId,
      },
      TableName: tableName,
    },
  },
  {
    Put: {
      ConditionExpression: 'attribute_not_exists(#id)',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      Item: transaction,
      TableName: tableName,
    },
  },
  ...(receipt
    ? [
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            Item: {
              __typename: 'TransactionCreationReceipt',
              id: receiptIdFor(owner, receipt.commandId),
              ...receipt,
            },
            TableName: tableName,
          },
        },
      ]
    : []),
];

const readReceiptAfterFailure = async (
  receipt: ITransactionCreationReceipt,
  tableName: string,
  transactionError: unknown,
): Promise<ITransactionCreationReceipt | undefined> => {
  try {
    const { Item } = await documentClient.send(
      new GetCommand({
        ConsistentRead: true,
        Key: {
          __typename: 'TransactionCreationReceipt',
          id: receiptIdFor(receipt.owner, receipt.commandId),
        },
        TableName: tableName,
      }),
    );

    return Item as ITransactionCreationReceipt | undefined;
  } catch (receiptError) {
    const recoveryError = new Error(
      'Transaction failed and its idempotency receipt could not be checked',
    );

    Object.assign(recoveryError, {
      cause: transactionError,
      errors: [transactionError, receiptError],
    });

    throw recoveryError;
  }
};

const existingReceiptResult = (
  existingReceipt: ITransactionCreationReceipt,
  receipt: ITransactionCreationReceipt,
): TTransaction | IErrorResult => {
  if (
    existingReceipt.owner !== receipt.owner ||
    existingReceipt.commandId !== receipt.commandId ||
    existingReceipt.payloadHash !== receipt.payloadHash
  ) {
    return {
      errorMessage: 'Transaction ID is already in use',
      errorType: 'ConflictException',
    };
  }

  return existingReceipt.transaction;
};

const retryTransactionConflict = async (
  attempt: number,
  retry: () => Promise<TTransaction | IErrorResult>,
): Promise<TTransaction | IErrorResult> => {
  if (attempt + 1 >= maxTransactionConflictAttempts) {
    return {
      errorMessage: 'Transaction creation is temporarily unavailable',
      errorType: 'TransactionConflictException',
    };
  }

  await wait(10 * 2 ** attempt);

  return retry();
};

const resolveTransactionCancellation = async (
  error: Error & { CancellationReasons?: { Code?: string }[] },
  attempt: number,
  retry: () => Promise<TTransaction | IErrorResult>,
): Promise<TTransaction | IErrorResult> => {
  const reasons = error.CancellationReasons ?? [];

  if (reasons[0]?.Code === 'ConditionalCheckFailed') {
    return {
      errorMessage: 'Unauthorized',
      errorType: 'UnauthorizedException',
    };
  }

  if (reasons.some(({ Code }) => Code === 'TransactionConflict')) {
    return retryTransactionConflict(attempt, retry);
  }

  if (reasons.some(({ Code }) => Code === 'ConditionalCheckFailed')) {
    return {
      errorMessage: 'Transaction ID is already in use',
      errorType: 'ConflictException',
    };
  }

  throw error;
};

const resolveTransactionFailure = async (
  error: unknown,
  tableName: string,
  receipt: ITransactionCreationReceipt | undefined,
  attempt: number,
  retry: () => Promise<TTransaction | IErrorResult>,
): Promise<TTransaction | IErrorResult> => {
  if (!receipt) {
    throw error;
  }

  const existingReceipt = await readReceiptAfterFailure(
    receipt,
    tableName,
    error,
  );

  if (existingReceipt) {
    return existingReceiptResult(existingReceipt, receipt);
  }

  if (!isTransactionCancelled(error)) {
    throw error;
  }

  return resolveTransactionCancellation(error, attempt, retry);
};

const createTransaction = async (
  transaction: TTransaction,
  tableName: string,
  owner: string,
  companyId: string,
  receipt: ITransactionCreationReceipt | undefined,
  attempt = 0,
): Promise<TTransaction | IErrorResult> => {
  const transactItems = transactionItemsFor(
    transaction,
    tableName,
    owner,
    companyId,
    receipt,
  );

  try {
    await documentClient.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      }),
    );

    return transaction;
  } catch (error) {
    return resolveTransactionFailure(error, tableName, receipt, attempt, () =>
      createTransaction(
        transaction,
        tableName,
        owner,
        companyId,
        receipt,
        attempt + 1,
      ),
    );
  }
};

export const handler: AppSyncResolverHandler<
  MutationAddTransactionArgs,
  TTransaction | IErrorResult
> = async ({ arguments: { input }, identity }) => {
  if (
    !identity ||
    !('sub' in identity) ||
    typeof identity.sub !== 'string' ||
    !identity.sub
  ) {
    return {
      errorMessage: 'Unauthorized',
      errorType: 'UnauthorizedException',
    };
  }

  const { TABLE } = process.env;

  if (!TABLE) {
    return {
      errorMessage: 'Transaction creation is unavailable',
      errorType: 'ConfigurationError',
    };
  }

  const owner = identity.sub;
  const transactionId = input.id || randomUUID();
  const transaction = transactionFor(input, owner, transactionId);
  const receipt = receiptFor(input, owner, payloadHashFor(input), transaction);

  return createTransaction(transaction, TABLE, owner, input.companyId, receipt);
};

export default handler;
