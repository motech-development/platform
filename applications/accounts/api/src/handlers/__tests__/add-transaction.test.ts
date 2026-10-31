import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import type { AppSyncResolverEvent, Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import type {
  MutationAddTransactionArgs,
  TransactionInput,
} from '../../graphql/graphql';
import { handler } from '../add-transaction';

type ITransactWriteInput = ConstructorParameters<
  typeof TransactWriteCommand
>[0];

const input: TransactionInput = {
  amount: 100,
  attachment: '',
  category: 'Sales',
  companyId: 'company-id',
  date: '2026-10-30T00:00:00.000Z',
  description: 'Invoice',
  id: 'transaction-command-id',
  name: 'Customer',
  refund: false,
  scheduled: false,
  status: 'confirmed',
  vat: 20,
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const hasUuidId = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  uuidPattern.test(value.id);

type AddTransactionEvent = AppSyncResolverEvent<MutationAddTransactionArgs>;

const invoke = (
  transactionInput: TransactionInput = input,
  identity: unknown = {
    sub: 'owner-id',
  },
) =>
  handler(
    {
      arguments: {
        input: transactionInput,
      },
      identity,
    } as AddTransactionEvent,
    {} as Context,
    vi.fn(),
  );

const cancelledTransaction = (
  reasons: { Code?: string }[],
): Error & { CancellationReasons: { Code?: string }[] } =>
  Object.assign(new Error('Transaction cancelled'), {
    CancellationReasons: reasons,
    name: 'TransactionCanceledException',
  });

describe('add-transaction', () => {
  const ddb = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddb.reset();
    vi.stubEnv('TABLE', 'accounts-test-application');
    ddb.on(TransactWriteCommand).resolves({});
    ddb.on(GetCommand).resolves({});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    ddb.restore();
  });

  it('connects the GraphQL mutation to Lambda and maps handler errors', async () => {
    const requestTemplate = await readFile(
      join(
        process.cwd(),
        'mapping-templates/transaction/addTransaction/Mutation.addTransaction.req.vtl',
      ),
      'utf8',
    );
    const responseTemplate = await readFile(
      join(
        process.cwd(),
        'mapping-templates/transaction/addTransaction/Mutation.addTransaction.res.vtl',
      ),
      'utf8',
    );
    const serverlessConfig = await readFile(
      join(process.cwd(), 'serverless.yml'),
      'utf8',
    );

    expect(requestTemplate).toContain('"operation": "Invoke"');
    expect(responseTemplate).toContain(
      '$util.error($ctx.result.errorMessage, $ctx.result.errorType)',
    );
    expect(serverlessConfig).toMatch(
      /Mutation\.addTransaction:\s+dataSource: TransactionCreator/,
    );
    expect(serverlessConfig).toMatch(/TransactionCreator:\s+type: AWS_LAMBDA/);
    expect(serverlessConfig).toContain('dynamodb:ConditionCheckItem');
    expect(serverlessConfig).toContain('dynamodb:PutItem');
    expect(serverlessConfig).toContain('dynamodb:GetItem');
    expect(serverlessConfig).toContain('dynamodb:EnclosingOperation');
    expect(serverlessConfig).not.toContain('dynamodb:TransactWriteItems');
  });

  it('creates the transaction, receipt, and company lookup record atomically', async () => {
    const result = await invoke();

    expect(result).toMatchObject({
      __typename: 'Transaction',
      companyId: 'company-id',
      data: 'owner-id:company-id:confirmed:2026-10-30T00:00:00.000Z',
      owner: 'owner-id',
    });
    expect(hasUuidId(result)).toBe(true);

    const command = ddb.commandCalls(TransactWriteCommand)[0].args[0];
    const { TransactItems } = command.input;
    const transaction = TransactItems?.[1].Put?.Item as
      | Record<string, unknown>
      | undefined;
    const receipt = TransactItems?.[2].Put?.Item as
      | Record<string, unknown>
      | undefined;
    const receiptIndex = TransactItems?.[3].Put?.Item as
      | Record<string, unknown>
      | undefined;

    expect(TransactItems).toHaveLength(4);
    expect(TransactItems?.[0].ConditionCheck).toMatchObject({
      ConditionExpression: '#owner = :owner',
      Key: {
        __typename: 'Company',
        id: 'company-id',
      },
      TableName: 'accounts-test-application',
    });
    expect(TransactItems?.[1].Put).toMatchObject({
      ConditionExpression: 'attribute_not_exists(#id)',
      Item: {
        __typename: 'Transaction',
        owner: 'owner-id',
      },
    });
    expect(transaction?.id).toEqual(expect.stringMatching(uuidPattern));
    expect(transaction?.id).not.toBe(input.id);
    expect(receipt).toMatchObject({
      __typename: 'TransactionCreationReceipt',
      commandId: input.id,
      owner: 'owner-id',
    });
    expect(typeof receipt?.payloadHash).toBe('string');
    expect(receipt?.transaction).toMatchObject({
      id: transaction?.id,
    });
    expect(TransactItems?.[3].Put?.ConditionExpression).toBe(
      'attribute_not_exists(#id)',
    );
    expect(receiptIndex).toMatchObject({
      id: 'company-id',
      owner: 'owner-id',
    });
    const { __typename: receiptIndexType } = receiptIndex ?? {};

    expect(typeof receiptIndexType).toBe('string');
    expect(receiptIndexType).toMatch(
      /^TransactionCreationReceiptIndex:transaction-creation:/,
    );
  });

  it('preserves valid UUID command IDs as transaction IDs', async () => {
    const commandId = '51f1905d-9847-4373-96f8-a530d07a3c23';

    await expect(
      invoke({
        ...input,
        id: commandId,
      }),
    ).resolves.toMatchObject({
      id: commandId,
    });
  });

  it('creates distinct transactions for different command IDs', async () => {
    await invoke();
    await invoke({
      ...input,
      description: 'Another invoice',
      id: 'another-command-id',
    });

    const commands = ddb
      .commandCalls(TransactWriteCommand)
      .map(({ args }) => args[0].input.TransactItems?.[1].Put?.Item);

    expect(commands).toHaveLength(2);
    expect(commands[0]?.id).toEqual(expect.stringMatching(uuidPattern));
    expect(commands[1]?.id).toEqual(expect.stringMatching(uuidPattern));
    expect(commands[0]?.id).not.toBe(commands[1]?.id);
  });

  it('returns the stored transaction instead of recreating it after deletion', async () => {
    let receipt: unknown;
    let writes = 0;

    ddb
      .on(TransactWriteCommand)
      .callsFake((commandInput: ITransactWriteInput) => {
        writes += 1;

        if (writes === 1) {
          receipt = commandInput.TransactItems?.[2].Put?.Item;

          return Promise.resolve({});
        }

        return Promise.reject(
          cancelledTransaction([
            {
              Code: 'None',
            },
            {
              Code: 'None',
            },
            {
              Code: 'ConditionalCheckFailed',
            },
            {
              Code: 'None',
            },
          ]),
        );
      });
    ddb.on(GetCommand).callsFake(() =>
      Promise.resolve({
        Item: receipt as Record<string, unknown> | undefined,
      }),
    );

    const firstResult = await invoke();
    const retryResult = await invoke();

    expect(firstResult).toHaveProperty(
      'id',
      expect.stringMatching(uuidPattern),
    );
    expect(retryResult).toEqual(firstResult);
    const attemptedTransactionIds = ddb
      .commandCalls(TransactWriteCommand)
      .map(
        ({ args }) => args[0].input.TransactItems?.[1].Put?.Item?.id as unknown,
      );

    expect(attemptedTransactionIds).toEqual([
      firstResult && 'id' in firstResult ? firstResult.id : undefined,
      expect.any(String),
    ]);
    expect(hasUuidId({ id: attemptedTransactionIds[0] })).toBe(true);
    expect(hasUuidId({ id: attemptedTransactionIds[1] })).toBe(true);
    expect(attemptedTransactionIds[1]).not.toBe(attemptedTransactionIds[0]);
    expect(receipt).toMatchObject({
      transaction: {
        id: attemptedTransactionIds[0],
      },
    });
    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 2);
    expect(ddb).toReceiveCommandTimes(GetCommand, 1);
  });

  it('returns the same transaction to concurrent requests with the same command ID', async () => {
    let receipt: unknown;
    let writes = 0;

    ddb
      .on(TransactWriteCommand)
      .callsFake((commandInput: ITransactWriteInput) => {
        writes += 1;

        if (writes === 1) {
          receipt = commandInput.TransactItems?.[2].Put?.Item;

          return Promise.resolve({});
        }

        return Promise.reject(
          cancelledTransaction([
            {
              Code: 'None',
            },
            {
              Code: 'TransactionConflict',
            },
            {
              Code: 'TransactionConflict',
            },
            {
              Code: 'TransactionConflict',
            },
          ]),
        );
      });
    ddb.on(GetCommand).callsFake(() =>
      Promise.resolve({
        Item: receipt as Record<string, unknown> | undefined,
      }),
    );

    const results = await Promise.all([invoke(), invoke()]);

    expect(results[0]).toEqual(results[1]);
    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 2);
    expect(ddb).toReceiveCommandTimes(GetCommand, 1);
  });

  it('retries a transaction conflict before the concurrent receipt is committed', async () => {
    ddb
      .on(TransactWriteCommand)
      .rejectsOnce(
        cancelledTransaction([
          {
            Code: 'None',
          },
          {
            Code: 'TransactionConflict',
          },
          {
            Code: 'TransactionConflict',
          },
          {
            Code: 'TransactionConflict',
          },
        ]),
      )
      .resolvesOnce({});

    expect(hasUuidId(await invoke())).toBe(true);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 2);
    expect(ddb).toReceiveCommandTimes(GetCommand, 1);
  });

  it('rejects a repeated command ID when the payload differs', async () => {
    let receipt: unknown;
    let writes = 0;

    ddb
      .on(TransactWriteCommand)
      .callsFake((commandInput: ITransactWriteInput) => {
        writes += 1;

        if (writes === 1) {
          receipt = commandInput.TransactItems?.[2].Put?.Item;

          return Promise.resolve({});
        }

        return Promise.reject(
          cancelledTransaction([
            {
              Code: 'None',
            },
            {
              Code: 'ConditionalCheckFailed',
            },
            {
              Code: 'ConditionalCheckFailed',
            },
            {
              Code: 'ConditionalCheckFailed',
            },
          ]),
        );
      });
    ddb.on(GetCommand).callsFake(() =>
      Promise.resolve({
        Item: receipt as Record<string, unknown> | undefined,
      }),
    );

    await invoke();

    await expect(
      invoke({
        ...input,
        description: 'Different invoice',
      }),
    ).resolves.toEqual({
      errorMessage: 'Transaction ID is already in use',
      errorType: 'ConflictException',
    });
  });

  it('allows a later retry to commit after a pre-commit failure', async () => {
    ddb
      .on(TransactWriteCommand)
      .rejectsOnce(new Error('DynamoDB unavailable'))
      .resolvesOnce({});

    await expect(invoke()).rejects.toThrow('DynamoDB unavailable');

    expect(hasUuidId(await invoke())).toBe(true);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 2);
  });

  it('preserves the transaction and recovery errors when receipt lookup fails', async () => {
    const transactionError = new Error('Transaction failed');
    const receiptError = new Error('Receipt lookup failed');
    ddb.on(TransactWriteCommand).rejects(transactionError);
    ddb.on(GetCommand).rejects(receiptError);

    await expect(invoke()).rejects.toMatchObject({
      cause: transactionError,
      errors: [transactionError, receiptError],
      message:
        'Transaction failed and its idempotency receipt could not be checked',
    });
  });

  it('rejects transaction creation after its company and receipt are deleted', async () => {
    ddb.on(TransactWriteCommand).rejects(
      cancelledTransaction([
        {
          Code: 'ConditionalCheckFailed',
        },
        {
          Code: 'None',
        },
        {
          Code: 'None',
        },
        {
          Code: 'None',
        },
      ]),
    );

    await expect(invoke()).resolves.toEqual({
      errorMessage: 'Unauthorized',
      errorType: 'UnauthorizedException',
    });
  });

  it('keeps legacy empty IDs working without a durable command receipt', async () => {
    const result = await invoke({
      ...input,
      id: '',
    });

    if (!result || !('id' in result)) {
      throw new Error('Expected a created transaction');
    }

    expect(typeof result.id).toBe('string');
    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
    const command = ddb.commandCalls(TransactWriteCommand)[0].args[0];

    expect(command.input.TransactItems).toHaveLength(2);
  });

  it('maps transaction cancellations for legacy empty IDs', async () => {
    ddb.on(TransactWriteCommand).rejects(
      cancelledTransaction([
        {
          Code: 'ConditionalCheckFailed',
        },
        {
          Code: 'None',
        },
      ]),
    );

    await expect(invoke({ ...input, id: '' })).resolves.toEqual({
      errorMessage: 'Unauthorized',
      errorType: 'UnauthorizedException',
    });

    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
  });

  it('maps transaction item conflicts for legacy empty IDs', async () => {
    ddb.on(TransactWriteCommand).rejects(
      cancelledTransaction([
        {
          Code: 'None',
        },
        {
          Code: 'ConditionalCheckFailed',
        },
      ]),
    );

    await expect(invoke({ ...input, id: '' })).resolves.toEqual({
      errorMessage: 'Transaction ID is already in use',
      errorType: 'ConflictException',
    });

    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
  });

  it('retries transient transaction cancellations for legacy empty IDs', async () => {
    ddb
      .on(TransactWriteCommand)
      .rejectsOnce(
        cancelledTransaction([
          {
            Code: 'None',
          },
          {
            Code: 'TransactionConflict',
          },
        ]),
      )
      .resolvesOnce({});

    expect(hasUuidId(await invoke({ ...input, id: '' }))).toBe(true);

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 2);
    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
  });

  it('propagates non-cancellation failures for legacy empty IDs without receipt reads', async () => {
    const error = new Error('DynamoDB unavailable');
    ddb.on(TransactWriteCommand).rejects(error);

    await expect(invoke({ ...input, id: '' })).rejects.toBe(error);

    expect(ddb).toReceiveCommandTimes(GetCommand, 0);
  });

  it('rejects an invalid identity before accessing DynamoDB', async () => {
    await expect(invoke(input, {})).resolves.toEqual({
      errorMessage: 'Unauthorized',
      errorType: 'UnauthorizedException',
    });

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 0);
  });

  it('fails without a configured table before accessing DynamoDB', async () => {
    vi.stubEnv('TABLE', undefined);

    await expect(invoke()).resolves.toEqual({
      errorMessage: 'Transaction creation is unavailable',
      errorType: 'ConfigurationError',
    });

    expect(ddb).toReceiveCommandTimes(TransactWriteCommand, 0);
  });
});
