import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const suggestionFields = ['purchases', 'sales', 'suppliers'] as const;

type StoredTypeahead = { owner: string } & Partial<
  Record<(typeof suggestionFields)[number], string[] | Set<string>>
>;

const updateCompanyTypeahead = async (
  documentClient: DynamoDBClient,
  tableName: string,
  records: ITransaction[],
): Promise<UpdateCommandOutput | undefined> => {
  const { companyId, owner } = records[0];
  const Key = { __typename: 'Typeahead', id: companyId };
  const { Item } = await documentClient.send(
    new GetCommand({ ConsistentRead: true, Key, TableName: tableName }),
  );

  const previous = Item as StoredTypeahead | undefined;

  if (previous && previous.owner !== owner) {
    throw new Error('Typeahead owner does not match transaction owner');
  }

  const suggestions = {
    purchases: new Set<string>(previous?.purchases ?? []),
    sales: new Set<string>(previous?.sales ?? []),
    suppliers: new Set<string>(previous?.suppliers ?? []),
  };

  records.forEach((record) => {
    if (record.category === 'Sales') {
      suggestions.sales.add(record.description);
    } else {
      suggestions.purchases.add(record.description);
      suggestions.suppliers.add(record.name);
    }
  });

  const values = {
    purchases: [...suggestions.purchases].sort((a, b) => a.localeCompare(b)),
    sales: [...suggestions.sales].sort((a, b) => a.localeCompare(b)),
    suppliers: [...suggestions.suppliers].sort((a, b) => a.localeCompare(b)),
  };

  if (
    suggestionFields.every((field) => {
      const stored = previous?.[field];

      return (
        Array.isArray(stored) &&
        stored.length === values[field].length &&
        values[field].every((value, index) => stored[index] === value)
      );
    })
  ) {
    return undefined;
  }

  const conditions = previous
    ? [
        '#owner = :owner',
        ...suggestionFields.map((field) =>
          previous[field] === undefined
            ? `attribute_not_exists(#${field})`
            : `#${field} = :old${field}`,
        ),
      ]
    : ['attribute_not_exists(#id)'];

  return documentClient.send(
    new UpdateCommand({
      ConditionExpression: conditions.join(' AND '),
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#groupsCanAccess': 'groupsCanAccess',
        ...(!previous ? { '#id': 'id' } : {}),
        '#owner': 'owner',
        '#purchases': 'purchases',
        '#sales': 'sales',
        '#suppliers': 'suppliers',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':data': `${owner}:${companyId}:Typeahead`,
        ':groupsCanAccess': ['Admin'],
        ':now': new Date().toISOString(),
        ...Object.fromEntries(
          suggestionFields
            .filter((field) => previous?.[field] !== undefined)
            .map((field) => [`:old${field}`, previous?.[field]]),
        ),
        ':owner': owner,
        ':purchases': values.purchases,
        ':sales': values.sales,
        ':suppliers': values.suppliers,
      },
      Key,
      TableName: tableName,
      UpdateExpression:
        'SET #createdAt = if_not_exists(#createdAt, :now), #data = :data, #groupsCanAccess = if_not_exists(#groupsCanAccess, :groupsCanAccess), #owner = :owner, #purchases = :purchases, #sales = :sales, #suppliers = :suppliers, #updatedAt = :now',
    }),
  );
};

const insertTypeahead = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput | undefined>[] => {
  const companies = new Map<string, ITransaction[]>();

  unmarshallNewRecords<ITransaction>(records, 'Transaction').forEach(
    ({ NewImage }) => {
      const transactions = companies.get(NewImage.companyId) ?? [];

      if (transactions.some(({ owner }) => owner !== NewImage.owner)) {
        throw new Error('Transactions for a company must have the same owner');
      }

      transactions.push(NewImage);
      companies.set(NewImage.companyId, transactions);
    },
  );

  return [...companies.values()].map((transactions) =>
    updateCompanyTypeahead(documentClient, tableName, transactions),
  );
};

export default insertTypeahead;
