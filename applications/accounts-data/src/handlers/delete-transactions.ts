import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const deleteTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = records.map(
    record =>
      record.dynamodb?.OldImage &&
      DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
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
              'SET #updatedAt = :updatedAt, #balance = #balance - :balance',
          },
        }
      : {},
  );

  return transactionItems;
};

export default deleteTransactions;
