import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { ITransaction } from './shared/transaction';
import { unmarshallNewRecords } from './shared/unmarshall-records';
import transformBalance, {
  IBalanceItem,
  ITransactionItem,
} from './shared/transform-balance';

const client = new DynamoDBClient({});

const getBalance = async (id: string, owner: string) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const getCommand = new GetCommand({
    Key: {
      __typename: 'Balance',
      id,
    },
    TableName: TABLE,
  });

  const queryCommand = new QueryCommand({
    ExpressionAttributeNames: {
      '#data': 'data',
      '#owner': 'owner',
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
    ScanIndexForward: false,
    TableName: TABLE,
  });

  const balanceQuery = client.send(getCommand);

  const transactionsQuery = client.send(queryCommand);

  const [balance, transactions] = await Promise.all([
    balanceQuery,
    transactionsQuery,
  ]);

  const balanceResult = balance.Item as IBalanceItem;

  const transactionsResult = transactions.Items as ITransactionItem[];

  const data = transformBalance(balanceResult, transactionsResult);

  const now = new Date();

  const updateCommand = new UpdateCommand({
    ExpressionAttributeNames: {
      '#balance': 'balance',
      '#createdAt': 'createdAt',
      '#currency': 'currency',
      '#data': 'data',
      '#groupsCanAccess': 'groupsCanAccess',
      '#owner': 'owner',
      '#transactions': 'transactions',
      '#updatedAt': 'updatedAt',
      '#vat': 'vat',
    },
    ExpressionAttributeValues: {
      ':balance': data.balance,
      ':currency': data.currency,
      ':data': `${owner}:${id}:Typeahead`,
      ':groupsCanAccess': ['Admin'],
      ':now': now.toISOString(),
      ':owner': owner,
      ':transactions': data.transactions,
      ':vat': data.vat,
    },
    Key: {
      __typename: 'Balance',
      id,
    },
    TableName: TABLE,
    UpdateExpression:
      'SET #balance = :balance, #currency = :currency, #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #transactions = :transactions, #updatedAt = :now, #vat = :vat',
  });

  await client.send(updateCommand);

  // TODO: Subscription to update UI
};

export const handler: DynamoDBStreamHandler = async (event) => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    event.Records,
    'Transaction',
  );

  const transactions = unmarshalledRecords.map(({ NewImage }) => ({
    id: NewImage.id,
    owner: NewImage.owner,
  }));

  try {
    await Promise.all(
      transactions.map(({ id, owner }) => getBalance(id, owner)),
    );
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
