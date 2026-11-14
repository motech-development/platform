import {
  DynamoDBClient,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import {
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Decimal } from 'decimal.js';
import aggregatedDay from './aggregated-day';
import { ITransaction, TransactionStatus } from './transaction';

type IBalanceUpdate = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Update']
>;

interface IVatUtility {
  property: 'owed' | 'paid';
  value: number;
}

const applyOnce = async (
  documentClient: DynamoDBClient,
  eventId: string,
  balanceUpdate: IBalanceUpdate,
): Promise<void> => {
  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          ConditionExpression: 'attribute_not_exists(id)',
          Item: {
            __typename: 'BalanceEvent',
            id: eventId,
            ttl: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          },
          TableName: balanceUpdate.TableName,
        },
      },
      {
        Update: {
          ...balanceUpdate,
          ConditionExpression: 'attribute_exists(id)',
        },
      },
    ],
  });

  try {
    await documentClient.send(command);
  } catch (e) {
    if (
      e instanceof TransactionCanceledException &&
      e.CancellationReasons?.some(
        ({ Code }) => Code === 'ConditionalCheckFailed',
      )
    ) {
      return;
    }

    throw e;
  }
};

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
  eventId: string,
): Promise<void> => {
  const balanceUpdate = {
    ...commonUpdate(tableName, record),
    UpdateExpression:
      'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
  };

  return applyOnce(documentClient, eventId, balanceUpdate);
};

export const remove = (
  documentClient: DynamoDBClient,
  tableName: string,
  record: ITransaction,
  eventId: string,
): Promise<void> => {
  const balanceUpdate = {
    ...commonUpdate(tableName, record),
    UpdateExpression:
      'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
  };

  return applyOnce(documentClient, eventId, balanceUpdate);
};

export const update = (
  documentClient: DynamoDBClient,
  tableName: string,
  oldRecord: ITransaction,
  newRecord: ITransaction,
  eventId: string,
): Promise<void> => {
  if (
    oldRecord.status === TransactionStatus.Pending &&
    newRecord.status === TransactionStatus.Confirmed
  ) {
    return insert(documentClient, tableName, newRecord, eventId);
  }

  if (
    oldRecord.status === TransactionStatus.Confirmed &&
    newRecord.status === TransactionStatus.Pending
  ) {
    return remove(documentClient, tableName, oldRecord, eventId);
  }

  const now = new Date();
  const oldVat = vatUtility(oldRecord);
  const newVat = vatUtility(newRecord);
  const isSameVatProperty = oldVat.property === newVat.property;
  const isSameDate =
    aggregatedDay(newRecord.date) === aggregatedDay(oldRecord.date);

  const setExpressions = ['#updatedAt = :updatedAt'];

  if (!isSameVatProperty) {
    setExpressions.push(
      '#vat.#vatPropertyOld = #vat.#vatPropertyOld - :vatOld',
    );
  }

  if (!isSameDate) {
    setExpressions.push(
      '#items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld',
    );
  }

  const addExpressions = [
    '#balance :balance',
    isSameVatProperty
      ? '#vat.#vatProperty :vat'
      : '#vat.#vatPropertyNew :vatNew',
    isSameDate
      ? '#items.#itemProperty :balance'
      : '#items.#itemPropertyNew :itemPropertyNew',
  ];

  const balanceUpdate = {
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
      ...(isSameVatProperty
        ? {
            '#vatProperty': newVat.property,
          }
        : {
            '#vatPropertyNew': newVat.property,
            '#vatPropertyOld': oldVat.property,
          }),
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
      ...(isSameVatProperty
        ? {
            ':vat': new Decimal(newVat.value).minus(oldVat.value).toNumber(),
          }
        : {
            ':vatNew': newVat.value,
            ':vatOld': oldVat.value,
          }),
    },
    Key: {
      __typename: 'Balance',
      id: newRecord.companyId,
    },
    TableName: tableName,
    UpdateExpression: `SET ${setExpressions.join(', ')} ADD ${addExpressions.join(', ')}`,
  };

  return applyOnce(documentClient, eventId, balanceUpdate);
};
