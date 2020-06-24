import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const typeahead = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords(records, 'Transaction');
  const now = new Date();
  const insert = unmarshalledRecords
    .filter(
      ({ NewImage }) =>
        NewImage.status === TransactionStatus.Confirmed &&
        NewImage.category !== 'Sales',
    )
    .map(({ NewImage }) =>
      documentClient
        .update({
          ExpressionAttributeNames: {
            '#createdAt': 'createdAt',
            '#data': 'data',
            '#descriptions': 'descriptions',
            '#suppliers': 'suppliers',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':data': `${NewImage.owner}:${NewImage.companyId}:Typeahead`,
            ':descriptions': documentClient.createSet([NewImage.description]),
            ':now': now.toISOString(),
            ':suppliers': documentClient.createSet([NewImage.name]),
          },
          Key: {
            __typename: 'Typeahead',
            id: NewImage.companyId,
          },
          TableName: tableName,
          UpdateExpression:
            'ADD #descriptions :descriptions, #suppliers :suppliers SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #updatedAt = :now',
        })
        .promise(),
    );

  return insert;
};

export default typeahead;
