import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { Decimal } from 'decimal.js';
import aggregatedDay from './aggregated-day';
import { ITransaction, TransactionStatus } from './transaction';
import transformTransactions, {
  IBalance,
  ITransactionItem,
} from './transform-transactions';

interface IVatUtility {
  name: 'amount' | 'vat';
  property: 'owed' | 'paid';
  value: number;
}

const vatUtility = (record: ITransaction): IVatUtility => {
  const value = record.category === 'VAT payment' ? record.amount : record.vat;
  const name = record.category === 'VAT payment' ? 'amount' : 'vat';

  let property: IVatUtility['property'];

  switch (record.category) {
    case 'VAT payment':
    case 'Sales':
      property = 'owed';
      break;
    default:
      property = 'paid';
  }

  return {
    name,
    property,
    value,
  };
};

const commonUpdate = (tableName: string, record: ITransaction) => {
  const now = new Date();
  const { property, value } = vatUtility(record);

  return {
    ExpressionAttributeNames: {
      '#balance': 'balance',
      '#itemProperty': aggregatedDay(record.date),
      '#items': 'items',
      '#updatedAt': 'updatedAt',
      '#vat': 'vat',
      '#vatProperty': property,
    },
    ExpressionAttributeValues: {
      ':balance': record.amount,
      ':updatedAt': now.toISOString(),
      ':vat': value,
    },
    Key: {
      __typename: 'Balance',
      id: record.companyId,
    },
    TableName: tableName,
  };
};

export const getBalance = async (
  documentClient: DynamoDBClient,
  tableName: string,
  balance: IBalance,
) => {
  const { id, owner } = balance;

  logger.info({
    balance,
  });

  const queryCommand = new QueryCommand({
    ExpressionAttributeNames: {
      '#data': 'data',
      '#date': 'date',
      '#name': 'name',
      '#owner': 'owner',
      '#status': 'status',
      '#typename': '__typename',
    },
    ExpressionAttributeValues: {
      ':data': `${owner}:${id}:confirmed`,
      ':owner': owner,
      ':typename': 'Transaction',
    },
    FilterExpression: '#owner = :owner',
    IndexName: '__typename-data-index',
    KeyConditionExpression:
      '#typename = :typename AND begins_with(#data, :data)',
    ProjectionExpression:
      'amount, attachment, category, companyId, #date, description, id, #name, refund, scheduled, #status, vat',
    ScanIndexForward: false,
    TableName: tableName,
  });

  const transactions = await documentClient.send(queryCommand);

  const transactionsResult = transactions.Items as ITransactionItem[];

  const data = transformTransactions(balance, transactionsResult);

  const updateCommand = new UpdateCommand({
    ExpressionAttributeNames: {
      '#transactions': 'transactions',
    },
    ExpressionAttributeValues: {
      ':transactions': data,
    },
    Key: {
      __typename: 'Balance',
      id,
    },
    TableName: tableName,
    UpdateExpression: 'SET #transactions = :transactions',
  });

  await documentClient.send(updateCommand);
};

export const insert = (
  documentClient: DynamoDBClient,
  tableName: string,
  record: ITransaction,
): Promise<UpdateCommandOutput> => {
  const command = new UpdateCommand({
    ...commonUpdate(tableName, record),
    UpdateExpression:
      'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
  });

  return documentClient.send(command);
};

export const remove = (
  documentClient: DynamoDBClient,
  tableName: string,
  record: ITransaction,
): Promise<UpdateCommandOutput> => {
  const command = new UpdateCommand({
    ...commonUpdate(tableName, record),
    UpdateExpression:
      'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
  });

  return documentClient.send(command);
};

export const update = (
  documentClient: DynamoDBClient,
  tableName: string,
  oldRecord: ITransaction,
  newRecord: ITransaction,
): Promise<UpdateCommandOutput> => {
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
  const { name, property } = vatUtility(newRecord);
  const isSameDate =
    aggregatedDay(newRecord.date) === aggregatedDay(oldRecord.date);
  const UpdateExpression = isSameDate
    ? 'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance'
    : 'SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemPropertyNew :itemPropertyNew';
  const command = new UpdateCommand({
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
      '#vatProperty': property,
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
      ':vat': new Decimal(newRecord[name]).minus(oldRecord[name]).toNumber(),
    },
    Key: {
      __typename: 'Balance',
      id: newRecord.companyId,
    },
    TableName: tableName,
    UpdateExpression,
  });

  return documentClient.send(command);
};
