import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import aggregatedDay from '../shared/aggregated-day';

const deleteTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = records.map(
    record =>
      record.dynamodb?.OldImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
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
                'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
            },
          }
        : {},
    )
    .filter(item => !!item.Update);

  return transactionItems;
};

export default deleteTransactions;
