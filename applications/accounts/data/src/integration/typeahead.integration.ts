import { randomUUID } from 'node:crypto';
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue, DynamoDBRecord } from 'aws-lambda';
import insertTypeahead from '../handlers/insert-typeahead';

const endpoint = process.env.DYNAMODB_ENDPOINT;

if (
  !endpoint ||
  !['localhost', '127.0.0.1'].includes(new URL(endpoint).hostname)
) {
  throw new Error('Set DYNAMODB_ENDPOINT to a running local DynamoDB instance');
}

const configuration = {
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  endpoint,
  region: 'eu-west-1',
};
const documentClient = new DynamoDBClient(configuration);
const tableName = `typeahead-${randomUUID()}`;
const key = (id: string) => ({ __typename: 'Typeahead', id });
const transaction = (
  companyId: string,
  description: string,
  category = 'Expenses',
  name = 'Supplier',
  owner = 'owner',
): DynamoDBRecord => ({
  dynamodb: {
    NewImage: marshall({
      __typename: 'Transaction',
      category,
      companyId,
      description,
      name,
      owner,
      status: 'pending',
    }) as Record<string, AttributeValue>,
  },
});

// A separate client reads only persisted state, without an application cache.
const read = async (id: string) => {
  const client = new DynamoDBClient(configuration);

  try {
    const { Item } = await client.send(
      new GetCommand({
        ConsistentRead: true,
        Key: key(id),
        TableName: tableName,
      }),
    );

    return Item;
  } finally {
    client.destroy();
  }
};

beforeAll(async () => {
  await documentClient.send(
    new CreateTableCommand({
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: '__typename', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: '__typename', KeyType: 'RANGE' },
      ],
      TableName: tableName,
    }),
  );
});

afterAll(async () => {
  await documentClient.send(new DeleteTableCommand({ TableName: tableName }));
  documentClient.destroy();
});

it('reproduces the rejected list ADD at the real DynamoDB boundary', async () => {
  await expect(
    documentClient.send(
      new UpdateCommand({
        ExpressionAttributeNames: { '#purchases': 'purchases' },
        ExpressionAttributeValues: { ':purchases': ['Description'] },
        Key: key('broken-add'),
        TableName: tableName,
        UpdateExpression: 'ADD #purchases :purchases',
      }),
    ),
  ).rejects.toMatchObject({ name: 'ValidationException' });
});

it.each([
  ['new company', { purchases: [], sales: [], suppliers: [] }],
  [
    'populated lists',
    {
      purchases: ['Older purchase', 'Alpha', 'Alpha'],
      sales: ['Older sale'],
      suppliers: ['Older supplier'],
    },
  ],
  [
    'legacy sets',
    {
      purchases: new Set(['Older purchase']),
      sales: new Set(['Older sale']),
      suppliers: new Set(['Older supplier']),
    },
  ],
  ['missing fields', {}],
])('persists unique sorted suggestions for %s', async (id, existing) => {
  await documentClient.send(
    new PutCommand({
      Item: {
        ...key(id),
        ...existing,
        createdAt: '2019-01-01T00:00:00.000Z',
        groupsCanAccess: ['Admin', 'Accountant'],
        owner: 'owner',
      },
      TableName: tableName,
    }),
  );
  const records = [
    transaction(id, 'Zulu', 'Expenses', 'Zulu supplier'),
    transaction(id, 'Beta', 'Sales', 'Client is not a supplier'),
    transaction(id, 'Alpha', 'Expenses', 'Alpha supplier'),
    transaction(id, 'Alpha', 'Expenses', 'Alpha supplier'),
    transaction(id, 'Alpha', 'Sales'),
  ];

  await Promise.all(insertTypeahead(documentClient, tableName, records));

  const result = await read(id);
  const hasHistory = id === 'populated lists' || id === 'legacy sets';

  expect(result).toMatchObject({
    createdAt: '2019-01-01T00:00:00.000Z',
    data: `owner:${id}:Typeahead`,
    groupsCanAccess: ['Admin', 'Accountant'],
    owner: 'owner',
    purchases: hasHistory
      ? ['Alpha', 'Older purchase', 'Zulu']
      : ['Alpha', 'Zulu'],
    sales: hasHistory ? ['Alpha', 'Beta', 'Older sale'] : ['Alpha', 'Beta'],
    suppliers: hasHistory
      ? ['Alpha supplier', 'Older supplier', 'Zulu supplier']
      : ['Alpha supplier', 'Zulu supplier'],
  });

  await Promise.all(insertTypeahead(documentClient, tableName, records));
  expect(await read(id)).toEqual(result);

  const { Item } = await documentClient.send(
    new GetItemCommand({ Key: marshall(key(id)), TableName: tableName }),
  );

  expect(Item?.purchases.L).toBeDefined();
  expect(Item?.sales.L).toBeDefined();
  expect(Item?.suppliers.L).toBeDefined();
});

it('creates missing records and keeps suggestions scoped to the company and owner', async () => {
  await Promise.all(
    insertTypeahead(documentClient, tableName, [
      transaction('first-company', 'First purchase'),
      transaction('second-company', 'Second sale', 'Sales'),
      transaction(
        'third-company',
        'Third purchase',
        'Expenses',
        'Other supplier',
        'other-owner',
      ),
    ]),
  );

  expect(await read('first-company')).toMatchObject({
    purchases: ['First purchase'],
    sales: [],
    suppliers: ['Supplier'],
  });
  expect(await read('second-company')).toMatchObject({
    purchases: [],
    sales: ['Second sale'],
    suppliers: [],
  });
  expect(await read('third-company')).toMatchObject({
    owner: 'other-owner',
    purchases: ['Third purchase'],
    sales: [],
    suppliers: ['Other supplier'],
  });

  await expect(
    Promise.all(
      insertTypeahead(documentClient, tableName, [
        transaction('third-company', 'Wrong owner'),
      ]),
    ),
  ).rejects.toThrow('Typeahead owner does not match transaction owner');
  expect((await read('third-company'))?.purchases).toEqual(['Third purchase']);
});

it('rejects a conflicting write and preserves both updates when the event is retried', async () => {
  const id = 'concurrent-company';
  await documentClient.send(
    new PutCommand({
      Item: {
        ...key(id),
        owner: 'owner',
        purchases: [],
        sales: [],
        suppliers: [],
      },
      TableName: tableName,
    }),
  );
  let reads = 0;
  let release: () => void;
  const bothReads = new Promise<void>((resolve) => {
    release = resolve;
  });

  // Synchronise two actual reads so both conditional writes start from the same item.
  documentClient.middlewareStack.add(
    (next, context) => async (args) => {
      const result = await next(args);
      if (context.commandName === 'GetCommand') {
        reads += 1;
        if (reads === 2) release();
        await bothReads;
      }
      return result;
    },
    { name: 'concurrentReads', step: 'initialize' },
  );
  const first = [transaction(id, 'First')];
  const second = [transaction(id, 'Second')];

  try {
    const results = await Promise.allSettled([
      ...insertTypeahead(documentClient, tableName, first),
      ...insertTypeahead(documentClient, tableName, second),
    ]);
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(
      1,
    );
    expect(results.find(({ status }) => status === 'rejected')).toMatchObject({
      reason: { name: 'ConditionalCheckFailedException' },
    });
  } finally {
    documentClient.middlewareStack.remove('concurrentReads');
  }

  await Promise.all(insertTypeahead(documentClient, tableName, first));
  await Promise.all(insertTypeahead(documentClient, tableName, second));
  expect((await read(id))?.purchases).toEqual(['First', 'Second']);
});
