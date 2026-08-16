import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Decimal } from 'decimal.js';
import aggregatedDay from './aggregated-day';
import { ITransaction, TransactionStatus } from './transaction';

interface IVatUtility {
  property: 'owed' | 'paid';
  value: number;
}

const vatUtility = (record: ITransaction): IVatUtility => {
  const value = record.category === 'VAT payment' ? record.amount : record.vat;
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
    return remove(documentClient, tableName, oldRecord);
  }

  const now = new Date();
  const oldVat = vatUtility(oldRecord);
  const newVat = vatUtility(newRecord);
  const vatPropertyChanged = oldVat.property !== newVat.property;
  const isSameDate =
    aggregatedDay(newRecord.date) === aggregatedDay(oldRecord.date);
  const vatUpdateExpression = vatPropertyChanged
    ? '#vat.#vatPropertyOld :vatOld, #vat.#vatPropertyNew :vatNew'
    : '#vat.#vatProperty :vat';
  const UpdateExpression = isSameDate
    ? `SET #updatedAt = :updatedAt ADD #balance :balance, ${vatUpdateExpression}, #items.#itemProperty :balance`
    : `SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, ${vatUpdateExpression}, #items.#itemPropertyNew :itemPropertyNew`;
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
      ...(vatPropertyChanged
        ? {
            '#vatPropertyNew': newVat.property,
            '#vatPropertyOld': oldVat.property,
          }
        : { '#vatProperty': newVat.property }),
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
      ...(vatPropertyChanged
        ? {
            ':vatNew': newVat.value,
            ':vatOld': new Decimal(oldVat.value).negated().toNumber(),
          }
        : {
            ':vat': new Decimal(newVat.value).minus(oldVat.value).toNumber(),
          }),
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
