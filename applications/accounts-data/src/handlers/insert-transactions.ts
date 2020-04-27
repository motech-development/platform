import { DynamoDBRecord } from 'aws-lambda';
import aggregatedDay from '../shared/aggregated-day';
import unmarshallRecords from '../shared/unmarshall-records';

const insertTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = unmarshallRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords.map(({ NewImage }) => ({
    Update: {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemProperty': aggregatedDay(NewImage.date),
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': NewImage.category === 'Sales' ? 'owed' : 'paid',
      },
      ExpressionAttributeValues: {
        ':balance': NewImage.amount,
        ':updatedAt': now.toISOString(),
        ':vat': NewImage.vat,
      },
      Key: {
        __typename: 'Balance',
        id: NewImage.companyId,
      },
      TableName: tableName,
      UpdateExpression:
        'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
    },
  }));

  return transactionItems;
};

export default insertTransactions;
