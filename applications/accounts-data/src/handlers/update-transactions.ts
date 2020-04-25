import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

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
            },
            ExpressionAttributeValues: {
              ':balance': record.amount - oldUnmarshalledRecords[i]?.amount,
              ':updatedAt': now.toISOString(),
            },
            Key: {
              __typename: 'Balance',
              id: record.companyId,
            },
            TableName: tableName,
            UpdateExpression:
              'SET #updatedAt = :updatedAt ADD #balance :balance',
          },
        }
      : {},
  );

  return transactionItems;
};

export default updateTransactions;
