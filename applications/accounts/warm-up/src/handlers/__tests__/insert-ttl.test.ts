import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import { handler } from '../insert-ttl';

describe('insert-ttl', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;

  beforeAll(() => {
    advanceTo('2021-04-11T19:45:00+00:00');
  });

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    ddb = mockClient(DynamoDBClient);
  });

  afterAll(clear);

  it('should throw an error if table is not set', async () => {
    await expect(handler({}, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('when table is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'TABLE-NAME';

      ddb
        .on(GetCommand)
        .resolvesOnce({
          Item: {
            __typename: 'WarmUp',
            createdAt: '2021-04-11T19:45:00.000Z',
            data: 'WarmUp:2021-04-11T19:45:00.000Z',
            id: 'test-uuid',
            ttl: 1618170300,
          },
        })
        .resolvesOnce({});
    });

    afterEach(() => {
      process.env = env;
    });

    it('should input the correct data into the database', async () => {
      await handler({}, context, callback);

      expect(ddb).toReceiveCommandWith(PutCommand, {
        Item: {
          __typename: 'WarmUp',
          createdAt: '2021-04-11T19:45:00.000Z',
          data: 'WarmUp:2021-04-11T19:45:00.000Z',
          id: 'test-uuid',
          ttl: 1618170300,
        },
        TableName: 'TABLE-NAME',
      });
    });

    it('should complete correctly', async () => {
      await expect(handler({}, context, callback)).resolves.toEqual({
        id: 'test-uuid',
      });
    });
  });
});
