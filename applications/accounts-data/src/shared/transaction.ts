import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Decimal } from 'decimal.js';
import aggregatedDay from './aggregated-day';

export enum TransactionStatus {
  Confirmed = 'confirmed',
  Pending = 'pending',
}

export interface ITransaction {
  __typename: string;
  amount: number;
  attachment: string;
  category: string;
  companyId: string;
  date: string;
  id: string;
  owner: string;
  status: TransactionStatus;
  vat: number;
}

const commonUpdate = (tableName: string, record: ITransaction) => {
  const now = new Date();

  return {
    ExpressionAttributeNames: {
      '#balance': 'balance',
      '#itemProperty': aggregatedDay(record.date),
      '#items': 'items',
      '#updatedAt': 'updatedAt',
      '#vat': 'vat',
      '#vatProperty': record.category === 'Sales' ? 'owed' : 'paid',
    },
    ExpressionAttributeValues: {
      ':balance': record.amount,
      ':updatedAt': now.toISOString(),
      ':vat': record.vat,
    },
    Key: {
      __typename: 'Balance',
      id: record.companyId,
    },
    TableName: tableName,
  };
};

export const insert = (
  documentClient: DocumentClient,
  tableName: string,
  record: ITransaction,
) =>
  documentClient
    .update({
      ...commonUpdate(tableName, record),
      UpdateExpression:
        'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
    })
    .promise();

export const remove = (
  documentClient: DocumentClient,
  tableName: string,
  record: ITransaction,
) =>
  documentClient
    .update({
      ...commonUpdate(tableName, record),
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
    })
    .promise();

export const update = (
  documentClient: DocumentClient,
  tableName: string,
  oldRecord: ITransaction,
  newRecord: ITransaction,
) => {
  if (
    oldRecord.status === TransactionStatus.Pending &&
    newRecord.status === TransactionStatus.Confirmed
  ) {
    return insert(documentClient, tableName, newRecord);
  }

  if (
    oldRecord.status === TransactionStatus.Confirmed &&
    newRecord.status === TransactionStatus.Pending
  ) {
    return remove(documentClient, tableName, newRecord);
  }

  const now = new Date();
  const isSameDate =
    aggregatedDay(newRecord.date) === aggregatedDay(oldRecord.date);
  const UpdateExpression = isSameDate
    ? 'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance'
    : 'SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemPropertyNew :itemPropertyNew';

  return documentClient
    .update({
      ExpressionAttributeNames: {
        '#balance': 'balance',
        ...(isSameDate
          ? {
              '#itemProperty': aggregatedDay(newRecord.date),
            }
          : {
              '#itemPropertyNew': aggregatedDay(newRecord.date),
              '#itemPropertyOld': aggregatedDay(oldRecord.date),
            }),
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': newRecord.category === 'Sales' ? 'owed' : 'paid',
      },
      ExpressionAttributeValues: {
        ':balance': new Decimal(newRecord.amount)
          .minus(oldRecord.amount)
          .toNumber(),
        ...(isSameDate
          ? {}
          : {
              ':itemPropertyNew': newRecord.amount,
              ':itemPropertyOld': oldRecord.amount,
            }),
        ':updatedAt': now.toISOString(),
        ':vat': new Decimal(newRecord.vat).minus(oldRecord.vat).toNumber(),
      },
      Key: {
        __typename: 'Balance',
        id: newRecord.companyId,
      },
      TableName: tableName,
      UpdateExpression,
    })
    .promise();
};
