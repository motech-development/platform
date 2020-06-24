import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

// TODO: CreatedAt
// TODO: UpdatedAt
// TODO: Unique values only
const typeahead = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords(records, 'Transaction');
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
            '#data': 'data',
            '#descriptions': 'descriptions',
            '#suppliers': 'suppliers',
          },
          ExpressionAttributeValues: {
            ':data': `${NewImage.owner}:${NewImage.companyId}:Typeahead`,
            ':descriptions': [NewImage.description],
            ':empty': [],
            ':suppliers': [NewImage.name],
          },
          Key: {
            __typename: 'Typeahead',
            id: NewImage.companyId,
          },
          TableName: tableName,
          UpdateExpression:
            'SET #data = :data, #descriptions = list_append(if_not_exists(#descriptions, :empty), :descriptions), #suppliers = list_append(if_not_exists(#suppliers, :empty), :suppliers) ',
        })
        .promise(),
    );

  return insert;
};

export default typeahead;
