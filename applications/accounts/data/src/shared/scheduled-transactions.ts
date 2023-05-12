import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import aggregatedDay from './aggregated-day';
import { ITransaction, TransactionStatus } from './transaction';

export interface IScheduledTransaction {
  __typename: string;
  active: boolean;
  companyId: string;
  date: string;
  id: string;
  owner: string;
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
  documentClient: DynamoDBClient,
  tableName: string,
  record: IScheduledTransaction,
): Promise<UpdateCommandOutput> => {
  const now = new Date();
  const { companyId, date, id, owner } = record;
  const command = new UpdateCommand({
    ExpressionAttributeNames: {
      '#data': 'data',
      '#scheduled': 'scheduled',
      '#status': 'status',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':data': `${owner}:${companyId}:confirmed:${date}`,
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
      'SET #data = :data, #scheduled = :scheduled, #status = :status, #updatedAt = :updatedAt',
  });

  return documentClient.send(command);
};

export const insert = (
  documentClient: DynamoDBClient,
  tableName: string,
  record: ITransaction,
): Promise<UpdateCommandOutput> => {
  const now = new Date();
  const { companyId, date, owner } = record;
  const startOfDay = aggregatedDay(date);
  const timestamp = Math.floor(new Date(startOfDay).getTime() / 1000);
  const command = new UpdateCommand({
    ...commonUpdate(tableName, record),
    ExpressionAttributeNames: {
      '#active': 'active',
      '#companyId': 'companyId',
      '#createdAt': 'createdAt',
      '#data': 'data',
      '#date': 'date',
      '#owner': 'owner',
      '#ttl': 'ttl',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':active': true,
      ':companyId': companyId,
      ':createdAt': now.toISOString(),
      ':data': `${owner}:${companyId}:active:${timestamp}`,
      ':date': date,
      ':owner': owner,
      ':ttl': timestamp,
      ':updatedAt': now.toISOString(),
    },
    UpdateExpression:
      'SET #active = :active, #companyId = :companyId, #createdAt = if_not_exists(#createdAt, :createdAt), #data = :data, #date = :date, #owner = :owner, #ttl = :ttl, #updatedAt = :updatedAt',
  });

  return documentClient.send(command);
};

export const remove = (
  documentClient: DynamoDBClient,
  tableName: string,
  record: ITransaction,
): Promise<UpdateCommandOutput> => {
  const { companyId, owner } = record;
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  const command = new UpdateCommand({
    ...commonUpdate(tableName, record),
    ConditionExpression: 'attribute_exists(id)',
    ExpressionAttributeNames: {
      '#active': 'active',
      '#data': 'data',
      '#ttl': 'ttl',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':active': false,
      ':data': `${owner}:${companyId}:active:${timestamp}`,
      ':ttl': timestamp,
      ':updatedAt': now.toISOString(),
    },
    UpdateExpression:
      'SET #active = :active, #data = :data, #ttl = :ttl, #updatedAt = :updatedAt',
  });

  return documentClient.send(command);
};

export const update = (
  documentClient: DynamoDBClient,
  tableName: string,
  oldRecord: ITransaction,
  newRecord: ITransaction,
): Promise<UpdateCommandOutput | void> => {
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
