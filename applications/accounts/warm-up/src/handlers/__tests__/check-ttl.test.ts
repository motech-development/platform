import {
  DynamoDBClient,
  DynamoDBClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { handler, IEvent } from '../check-ttl';

describe('check-ttl', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsStub<
    ServiceInputTypes,
    ServiceOutputTypes,
    DynamoDBClientResolvedConfig
  >;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    ddb = mockClient(DynamoDBClient);

    event = {
      id: 'test-uuid',
    };
  });

  it('should throw an error if table is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
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
    });

    afterEach(() => {
      process.env = env;
    });

    it('should complete correctly when item exists', async () => {
      ddb.on(GetCommand).resolvesOnce({
        Item: {
          __typename: 'WarmUp',
          createdAt: '2021-04-11T19:45:00.000Z',
          data: 'WarmUp:2021-04-11T19:45:00.000Z',
          id: 'test-uuid',
          ttl: 1618170300,
        },
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        attempts: 1,
        complete: false,
        id: 'test-uuid',
      });
    });

    it('should complete correctly when item no longer exists', async () => {
      ddb.on(GetCommand).resolvesOnce({});

      event.attempts = 2;
      event.complete = false;

      await expect(handler(event, context, callback)).resolves.toEqual({
        attempts: 3,
        complete: true,
        id: 'test-uuid',
      });
    });
  });
});
