import { createHash } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  TransactWriteCommand,
  TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb';
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

const commonRemovalUpdate = (tableName: string, record: ITransaction) => {
  const common = commonUpdate(tableName, record);

  return {
    ...common,
    ConditionExpression: 'attribute_exists(#id)',
    ExpressionAttributeNames: {
      ...common.ExpressionAttributeNames,
      '#id': 'id',
    },
    UpdateExpression:
      'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
  };
};

interface IStreamIdentity {
  eventID?: string;
  eventSourceARN?: string;
}

interface IBalanceUpdate {
  ConditionExpression?: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, unknown>;
  Key: { __typename: string; id: string };
  TableName: string;
  UpdateExpression: string;
}

type TProjectionEvent = 'INSERT' | 'MODIFY' | 'REMOVE';

const markerType = 'BalanceProjectionEvent';

class BalanceProjectionRecoveryError extends Error {
  constructor(readonly failures: unknown[]) {
    super('Failed to confirm balance projection recovery');

    this.name = 'BalanceProjectionRecoveryError';
  }
}

const getMarkerId = (eventSourceARN: string, eventID: string) =>
  createHash('sha256')
    .update(JSON.stringify([eventSourceARN, eventID]))
    .digest('hex');

const markMissingBalanceEvent = async (
  documentClient: DynamoDBClient,
  tableName: string,
  putMarker: {
    ConditionExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    Item: Record<string, unknown>;
    TableName: string;
  },
  key: IBalanceUpdate['Key'],
): Promise<boolean> => {
  const { Item } = await documentClient.send(
    new GetCommand({
      ConsistentRead: true,
      Key: key,
      TableName: tableName,
    }),
  );

  if (Item) {
    return false;
  }

  const { Item: company } = await documentClient.send(
    new GetCommand({
      ConsistentRead: true,
      Key: {
        __typename: 'Company',
        id: key.id,
      },
      TableName: tableName,
    }),
  );

  if (company) {
    return false;
  }

  await documentClient.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: putMarker,
        },
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            Key: key,
            TableName: tableName,
          },
        },
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
            Key: {
              __typename: 'Company',
              id: key.id,
            },
            TableName: tableName,
          },
        },
      ],
    }),
  );

  return true;
};

const recoverProjectionFailure = async (
  getMarker: () => Promise<boolean>,
  documentClient: DynamoDBClient,
  tableName: string,
  putMarker: {
    ConditionExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    Item: Record<string, unknown>;
    TableName: string;
  },
  key: IBalanceUpdate['Key'],
): Promise<boolean> => {
  if (await getMarker()) return true;

  return markMissingBalanceEvent(documentClient, tableName, putMarker, key);
};

const applyOnce = async (
  documentClient: DynamoDBClient,
  tableName: string,
  identity: IStreamIdentity,
  eventName: TProjectionEvent,
  update: IBalanceUpdate,
): Promise<TransactWriteCommandOutput | undefined> => {
  const { eventID, eventSourceARN } = identity;

  if (!eventID || !eventSourceARN) {
    throw new Error('Missing DynamoDB stream event identity');
  }

  const id = getMarkerId(eventSourceARN, eventID);

  const marker = {
    __typename: markerType,
    eventID,
    eventName,
    eventSourceARN,
    id,
  };

  const putMarker = {
    ConditionExpression: 'attribute_not_exists(#id)',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    Item: marker,
    TableName: tableName,
  };

  const getMarker = async () => {
    const { Item } = await documentClient.send(
      new GetCommand({
        ConsistentRead: true,
        Key: {
          __typename: markerType,
          id,
        },
        TableName: tableName,
      }),
    );

    return (
      Item?.eventID === eventID &&
      Item?.eventName === eventName &&
      Item?.eventSourceARN === eventSourceARN
    );
  };

  try {
    return await documentClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: putMarker,
          },
          {
            Update: update,
          },
        ],
      }),
    );
  } catch (error) {
    try {
      if (
        await recoverProjectionFailure(
          getMarker,
          documentClient,
          tableName,
          putMarker,
          update.Key,
        )
      ) {
        return undefined;
      }
    } catch (recoveryError) {
      try {
        if (await getMarker()) {
          return undefined;
        }
      } catch (markerReadError) {
        throw new BalanceProjectionRecoveryError([
          error,
          recoveryError,
          markerReadError,
        ]);
      }

      throw new BalanceProjectionRecoveryError([error, recoveryError]);
    }

    throw error;
  }
};

export const insert = (
  documentClient: DynamoDBClient,
  tableName: string,
  identity: IStreamIdentity,
  record: ITransaction,
): Promise<TransactWriteCommandOutput | undefined> => {
  const common = commonUpdate(tableName, record);

  return applyOnce(documentClient, tableName, identity, 'INSERT', {
    ...common,
    ExpressionAttributeValues: {
      ...common.ExpressionAttributeValues,
      ':zero': 0,
    },
    UpdateExpression:
      'SET #updatedAt = :updatedAt, #vat.#vatProperty = if_not_exists(#vat.#vatProperty, :zero) + :vat, #items.#itemProperty = if_not_exists(#items.#itemProperty, :zero) + :balance ADD #balance :balance',
  });
};

export const remove = (
  documentClient: DynamoDBClient,
  tableName: string,
  identity: IStreamIdentity,
  record: ITransaction,
): Promise<TransactWriteCommandOutput | undefined> =>
  applyOnce(
    documentClient,
    tableName,
    identity,
    'REMOVE',
    commonRemovalUpdate(tableName, record),
  );

export const update = (
  documentClient: DynamoDBClient,
  tableName: string,
  identity: IStreamIdentity,
  oldRecord: ITransaction,
  newRecord: ITransaction,
): Promise<TransactWriteCommandOutput | undefined> => {
  if (
    oldRecord.status === TransactionStatus.Pending &&
    newRecord.status === TransactionStatus.Confirmed
  ) {
    const common = commonUpdate(tableName, newRecord);

    return applyOnce(documentClient, tableName, identity, 'MODIFY', {
      ...common,
      ExpressionAttributeValues: {
        ...common.ExpressionAttributeValues,
        ':zero': 0,
      },
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #vat.#vatProperty = if_not_exists(#vat.#vatProperty, :zero) + :vat, #items.#itemProperty = if_not_exists(#items.#itemProperty, :zero) + :balance ADD #balance :balance',
    });
  }

  if (
    oldRecord.status === TransactionStatus.Confirmed &&
    newRecord.status === TransactionStatus.Pending
  ) {
    return applyOnce(
      documentClient,
      tableName,
      identity,
      'MODIFY',
      commonRemovalUpdate(tableName, oldRecord),
    );
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

  setExpressions.push(
    isSameVatProperty
      ? '#vat.#vatProperty = if_not_exists(#vat.#vatProperty, :zero) + :vat'
      : '#vat.#vatPropertyNew = if_not_exists(#vat.#vatPropertyNew, :zero) + :vatNew',
  );

  if (!isSameDate) {
    setExpressions.push(
      '#items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld',
    );
  }

  setExpressions.push(
    isSameDate
      ? '#items.#itemProperty = if_not_exists(#items.#itemProperty, :zero) + :balance'
      : '#items.#itemPropertyNew = if_not_exists(#items.#itemPropertyNew, :zero) + :itemPropertyNew',
  );

  const common = commonUpdate(tableName, newRecord);

  const updateInput = {
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
      ':updatedAt': now.toISOString(),
      ':zero': 0,
      ...(isSameDate
        ? {}
        : {
            ':itemPropertyNew': newRecord.amount,
            ':itemPropertyOld': oldRecord.amount,
          }),
      ...(isSameVatProperty
        ? {
            ':vat': new Decimal(newVat.value).minus(oldVat.value).toNumber(),
          }
        : {
            ':vatNew': newVat.value,
            ':vatOld': oldVat.value,
          }),
    },
    Key: common.Key,
    TableName: common.TableName,
    UpdateExpression: `SET ${setExpressions.join(', ')} ADD #balance :balance`,
  };

  return applyOnce(documentClient, tableName, identity, 'MODIFY', updateInput);
};
