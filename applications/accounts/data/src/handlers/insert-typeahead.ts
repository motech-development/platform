import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTypeahead = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );
  const now = new Date();
  const insert = unmarshalledRecords.map(({ NewImage }) => {
    const isSale = NewImage.category === 'Sales';

    return documentClient
      .update({
        ExpressionAttributeNames: {
          '#createdAt': 'createdAt',
          '#data': 'data',
          '#descriptions': isSale ? 'sales' : 'purchases',
          '#groupsCanAccess': 'groupsCanAccess',
          '#owner': 'owner',
          '#updatedAt': 'updatedAt',
          ...(isSale
            ? {}
            : {
                '#suppliers': 'suppliers',
              }),
        },
        ExpressionAttributeValues: {
          ':data': `${NewImage.owner}:${NewImage.companyId}:Typeahead`,
          ':descriptions': documentClient.createSet([NewImage.description]),
          ':groupsCanAccess': ['Admin'],
          ':now': now.toISOString(),
          ':owner': NewImage.owner,
          ...(isSale
            ? {}
            : {
                ':suppliers': documentClient.createSet([NewImage.name]),
              }),
        },
        Key: {
          __typename: 'Typeahead',
          id: NewImage.companyId,
        },
        TableName: tableName,
        UpdateExpression: `ADD ${
          isSale
            ? '#descriptions :descriptions'
            : '#descriptions :descriptions, #suppliers :suppliers'
        } SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #updatedAt = :now`,
      })
      .promise();
  });

  return insert;
};

export default insertTypeahead;
