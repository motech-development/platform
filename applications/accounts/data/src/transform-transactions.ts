import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { unmarshallAllRecords } from './shared/unmarshall-records';
import transformTransactions, {
  IBalance,
  ITransactionItem,
} from './shared/transform-transactions';

const client = new DynamoDBClient({});

const getBalance = async (balance: IBalance) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { id, owner } = balance;

  logger.info({
    balance,
  });

  const queryCommand = new QueryCommand({
    ExpressionAttributeNames: {
      '#data': 'data',
      '#date': 'date',
      '#name': 'name',
      '#owner': 'owner',
      '#status': 'status',
      '#typename': '__typename',
    },
    ExpressionAttributeValues: {
      ':data': `${owner}:${id}:confirmed`,
      ':owner': owner,
      ':typename': 'Transaction',
    },
    FilterExpression: '#owner = :owner',
    IndexName: '__typename-data-index',
    KeyConditionExpression:
      '#typename = :typename AND begins_with(#data, :data)',
    ProjectionExpression:
      'amount, attachment, category, companyId, #date, description, id, #name, refund, scheduled, #status, vat',
    ScanIndexForward: false,
    TableName: TABLE,
  });

  const transactions = await client.send(queryCommand);

  const transactionsResult = transactions.Items as ITransactionItem[];

  const data = transformTransactions(balance, transactionsResult);

  const updateCommand = new UpdateCommand({
    ExpressionAttributeNames: {
      '#transactions': 'transactions',
    },
    ExpressionAttributeValues: {
      ':transactions': data,
    },
    Key: {
      __typename: 'Balance',
      id,
    },
    TableName: TABLE,
    UpdateExpression: 'SET #transactions = :transactions',
  });

  await client.send(updateCommand);
};

export const handler: DynamoDBStreamHandler = async (event) => {
  const unmarshalledRecords = unmarshallAllRecords<IBalance>(
    event.Records,
    'Balance',
  );

  const transactions = unmarshalledRecords
    .filter(
      ({ NewImage, OldImage }) => NewImage.updatedAt !== OldImage.updatedAt,
    )
    .map(({ NewImage }) => getBalance(NewImage));

  try {
    await Promise.all(transactions);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
