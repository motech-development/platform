import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const now = new Date();
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords
    .filter(({ OldImage }) => OldImage.scheduled)
    .map(({ OldImage }) => {
      const { id } = OldImage;

      return documentClient
        .update({
          ConditionExpression: 'attribute_exists(id)',
          ExpressionAttributeNames: {
            '#active': 'active',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':active': false,
            ':updatedAt': now.toISOString(),
          },
          Key: {
            _typename: 'Typeahead',
            id,
          },
          TableName: tableName,
          UpdateExpression: 'SET #active = :active, #updatedAt = :updatedAt',
        })
        .promise();
    });

  return transactionItems;
};

export default removeScheduledTransactions;
