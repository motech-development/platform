import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import delay from '../shared/delay';
import transformBalance from '../shared/transform-balance';

const client = new DocumentClient();

interface IEvent {
  id: string;
  owner: string;
}

const getBalance = async (event: IEvent) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  // TODO: Find a better solution than having an artificial delay
  await delay(1000);

  const { id, owner } = event;

  const balanceQuery = client
    .get({
      Key: {
        __typename: 'Balance',
        id,
      },
      TableName: TABLE,
    })
    .promise();
  const transactionsQuery = client
    .query({
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
    })
    .promise();

  const [balance, transactions] = await Promise.all([
    balanceQuery,
    transactionsQuery,
  ]);

  const result = transformBalance(balance.Item, transactions.Items);

  return result;
};

export default getBalance;
