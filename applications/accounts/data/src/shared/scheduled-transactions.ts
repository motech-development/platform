import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import aggregatedDay from './aggregated-day';
import { ITransaction, TransactionStatus } from './transaction';

export interface IScheduledTransaction {
  __typename: string;
  active: boolean;
  id: string;
}

const commonUpdate = (tableName: string, record: ITransaction) => {
  const { id } = record;

  return {
    Key: {
      __typename: 'ScheduledTransaction',
      id,
    },
    TableName: tableName,
  };
};

export const confirm = (
  documentClient: DocumentClient,
  tableName: string,
  record: IScheduledTransaction,
) => {
  const now = new Date();
  const { id } = record;

  return documentClient
    .update({
      ExpressionAttributeNames: {
        '#scheduled': 'scheduled',
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':scheduled': false,
        ':status': 'confirmed',
        ':updatedAt': now.toISOString(),
      },
      Key: {
        __typename: 'Transaction',
        id,
      },
      TableName: tableName,
      UpdateExpression:
        'SET #scheduled = :scheduled, #status = :status, #updatedAt = :updatedAt',
    })
    .promise();
};

export const insert = (
  documentClient: DocumentClient,
  tableName: string,
  record: ITransaction,
) => {
  const now = new Date();
  const { companyId, date, owner } = record;
  const startOfDay = aggregatedDay(date);
  const timestamp = Math.floor(new Date(startOfDay).getTime() / 1000);

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
        ':data': `${owner}:${companyId}:active:${timestamp}`,
        ':ttl': timestamp,
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

  return documentClient
    .update({
      ...commonUpdate(tableName, record),
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#active': 'active',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':active': false,
        ':updatedAt': now.toISOString(),
      },
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
  if (newRecord.status === TransactionStatus.Confirmed) {
    return remove(documentClient, tableName, newRecord);
  }

  if (newRecord.scheduled) {
    return insert(documentClient, tableName, newRecord);
  }

  if (oldRecord.scheduled) {
    return remove(documentClient, tableName, newRecord);
  }

  return Promise.resolve();
};
