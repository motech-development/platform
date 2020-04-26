import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import aggregatedDay from '../shared/aggregated-day';

const insertTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = records.map(
    record =>
      record.dynamodb?.NewImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
  );

  const now = new Date();

  const transactionItems = unmarshalledRecords
    .map(record =>
      record?.__typename === 'Transaction'
        ? {
            Update: {
              ExpressionAttributeNames: {
                '#balance': 'balance',
                '#itemProperty': aggregatedDay(record.date),
                '#items': 'items',
                '#updatedAt': 'updatedAt',
                '#vat': 'vat',
                '#vatProperty': record.category === 'Sales' ? 'owed' : 'paid',
              },
              ExpressionAttributeValues: {
                ':balance': record.amount,
                ':updatedAt': now.toISOString(),
                ':vat': record.vat,
              },
              Key: {
                __typename: 'Balance',
                id: record.companyId,
              },
              TableName: tableName,
              UpdateExpression:
                'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
            },
          }
        : {},
    )
    .filter(item => !!item.Update);

  return transactionItems;
};

export default insertTransactions;
