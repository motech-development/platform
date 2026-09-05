import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSchema, execute, parse, validate } from 'graphql';
import { mutation } from '../publish-transaction-change';

const schemaDirectory = resolve(__dirname, '../../../schema');
const schema = buildSchema(
  [
    'directive @aws_iam on OBJECT | FIELD_DEFINITION',
    'directive @aws_oidc on OBJECT | FIELD_DEFINITION',
    'directive @aws_subscribe(mutations: [String!]!) on FIELD_DEFINITION',
    ...readdirSync(schemaDirectory)
      .filter((file) => file.endsWith('.graphql'))
      .map((file) => readFileSync(resolve(schemaDirectory, file), 'utf8')),
  ].join('\n'),
);

describe('transaction subscription contract', () => {
  it('selects the company and owner needed for subscription filtering', async () => {
    expect(validate(schema, mutation)).toEqual([]);
    const result = await execute({
      document: mutation,
      rootValue: {
        transactionChangeBeacon: (scope: { id: string; owner: string }) =>
          scope,
      },
      schema,
      variableValues: { id: 'company-id', owner: 'owner-id' },
    });

    expect(result).toEqual({
      data: {
        transactionChangeBeacon: { id: 'company-id', owner: 'owner-id' },
      },
    });
  });

  it('requires both subscription scope arguments', () => {
    const subscription =
      'subscription { onTransactionChange(id: "company-id", owner: "owner-id") { id owner } }';
    expect(validate(schema, parse(subscription))).toEqual([]);
    expect(
      validate(
        schema,
        parse('subscription { onTransactionChange(id: "company-id") { id } }'),
      ),
    ).not.toEqual([]);
    expect(
      validate(
        schema,
        parse('subscription { onTransactionChange(owner: "owner-id") { id } }'),
      ),
    ).not.toEqual([]);
  });

  it('binds the invalidation subscription to its IAM-only publisher', () => {
    const publisher = schema
      .getMutationType()
      ?.getFields().transactionChangeBeacon;
    const subscription = schema
      .getSubscriptionType()
      ?.getFields().onTransactionChange;

    expect(
      publisher?.astNode?.directives?.map(({ name }) => name.value),
    ).toEqual(['aws_iam']);
    expect(subscription?.astNode?.directives).toMatchObject([
      {
        arguments: [
          { value: { values: [{ value: 'transactionChangeBeacon' }] } },
        ],
        name: { value: 'aws_subscribe' },
      },
    ]);
    expect(String(subscription?.type)).toBe('TransactionChange');
  });
});
