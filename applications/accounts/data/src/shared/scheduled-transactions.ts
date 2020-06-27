import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import aggregatedDay from './aggregated-day';
import { ITransaction } from './transaction';

const commonUpdate = (tableName: string, record: ITransaction) => {
  const { id } = record;

  return {
    Key: {
      _typename: 'Typeahead',
      id,
    },
    TableName: tableName,
  };
};

export const insert = (
  documentClient: DocumentClient,
  tableName: string,
  record: ITransaction,
) => {
  const now = new Date();
  const { companyId, date, owner } = record;

  return documentClient
    .update({
      ...commonUpdate(tableName, record),
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
      UpdateExpression:
        'SET #active = :active, #createdAt = if_not_exists(#createdAt, :createdAt), #data = :data, #ttl = :ttl, #updatedAt = :updatedAt',
    })
    .promise();
};

export const remove = (
  documentClient: DocumentClient,
  tableName: string,
  record: ITransaction,
) => {
  const now = new Date();
  const { id } = record;

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
};

export const update = (
  documentClient: DocumentClient,
  tableName: string,
  oldRecord: ITransaction,
  newRecord: ITransaction,
) => {
  if (newRecord.scheduled) {
    return insert(documentClient, tableName, newRecord);
  }

  if (oldRecord.scheduled) {
    return remove(documentClient, tableName, newRecord);
  }

  return Promise.resolve();
};
