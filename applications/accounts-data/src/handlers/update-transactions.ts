import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Decimal } from 'decimal.js';

const updateTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const oldUnmarshalledRecords = records.map(
    record =>
      record.dynamodb?.OldImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
  );

  const newUnmarshalledRecords = records.map(
    record =>
      record.dynamodb?.NewImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
  );

  const now = new Date();

  const transactionItems = newUnmarshalledRecords.map((record, i) =>
    record?.__typename === 'Transaction' &&
    oldUnmarshalledRecords[i]?.__typename === 'Transaction'
      ? {
          Update: {
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#updatedAt': 'updatedAt',
              '#vat': 'vat',
              '#vatProperty': record.category === 'Sales' ? 'owed' : 'paid',
            },
            ExpressionAttributeValues: {
              ':balance': new Decimal(record.amount)
                .minus(oldUnmarshalledRecords[i]?.amount)
                .toNumber(),
              ':updatedAt': now.toISOString(),
              ':vat': new Decimal(record.vat)
                .minus(oldUnmarshalledRecords[i]?.vat)
                .toNumber(),
            },
            Key: {
              __typename: 'Balance',
              id: record.companyId,
            },
            TableName: tableName,
            UpdateExpression:
              'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat',
          },
        }
      : {},
  );

  return transactionItems;
};

export default updateTransactions;
