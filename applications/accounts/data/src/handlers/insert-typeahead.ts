import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTypeahead = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput>[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );
  const now = new Date();

  return unmarshalledRecords.map(({ NewImage }) => {
    const isSale = NewImage.category === 'Sales';

    const command = new UpdateCommand({
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
        ':descriptions': [NewImage.description],
        ':groupsCanAccess': ['Admin'],
        ':now': now.toISOString(),
        ':owner': NewImage.owner,
        ...(isSale
          ? {}
          : {
              ':suppliers': [NewImage.name],
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
    });

    return documentClient.send(command);
  });
};

export default insertTypeahead;
