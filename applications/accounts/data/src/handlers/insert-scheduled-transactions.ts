import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const now = new Date();
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords
    .filter(({ NewImage }) => NewImage.scheduled)
    .map(({ NewImage }) => {
      const { companyId, date, id, owner } = NewImage;

      return documentClient
        .update({
          ConditionExpression: 'attribute_not_exists(id)',
          ExpressionAttributeNames: {
            '#active': 'active',
            '#createdAt': 'createdAt',
            '#data': 'data',
            '#ttl': 'ttl',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':active': true,
            ':createdAt': now.toISOString(),
            ':data': `${owner}:${companyId}:active:${date}`,
            ':ttl': aggregatedDay(date),
            ':updatedAt': now.toISOString(),
          },
          Key: {
            _typename: 'Typeahead',
            id,
          },
          TableName: tableName,
          UpdateExpression:
            'SET #active = :active, #createdAt = :createdAt, #data = :data, #ttl = :ttl, #updatedAt = :updatedAt',
        })
        .promise();
    });

  return transactionItems;
};

export default insertScheduledTransactions;
