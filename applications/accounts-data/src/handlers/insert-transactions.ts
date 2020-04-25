import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const insertTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = records.map(
    record =>
      record.dynamodb?.NewImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
  );

  const now = new Date();

  const transactionItems = unmarshalledRecords.map(record =>
    record?.__typename === 'Transaction'
      ? {
          Update: {
            ExpressionAttributeNames: {
              '#balance': 'balance',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':balance': record.amount,
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

export default insertTransactions;
