import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import delay from '../shared/delay';
import transformBalance, {
  IBalanceItem,
  ITransactionItem,
  ITransformedBalance,
} from '../shared/transform-balance';

const client = new DynamoDBClient({});

export interface IEvent {
  id: string;
  owner: string;
}

const getBalance = async (event: IEvent): Promise<ITransformedBalance> => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  // TODO: Find a better solution than having an artificial delay
  await delay(1250);

  const { id, owner } = event;

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

  return transformBalance(balanceResult, transactionsResult);
};

export default getBalance;
