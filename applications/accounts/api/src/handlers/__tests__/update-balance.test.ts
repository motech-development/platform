import { AWSAppSyncClient } from 'aws-appsync';
import type { Callback, Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { mutation } from '../../shared/update-balance';
import { handler } from '../update-balance';

describe('update-balance', () => {
  let callback: Callback;
  let context: Context;
  let event: DynamoDBStreamEvent;
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn<Callback>();

    event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              __typename: {
                S: 'Balance',
              },
              balance: {
                N: '0',
              },
              id: {
                S: 'balance-id',
              },
              owner: {
                S: 'owner-id',
              },
              transactions: {
                L: [],
              },
              vat: {
                M: {
                  owed: {
                    N: '0',
                  },
                  paid: {
                    N: '0',
                  },
                },
              },
            },
          },
          eventName: 'MODIFY',
        },
      ],
    };
  });

  it('should throw an error if no region is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No region set',
    );
  });

  describe('when region is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.AWS_REGION = 'eu-west-2';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no endpoint is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No endpoint set',
      );
    });
  });

  describe('when region, endpoint and credentials are set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.AWS_REGION = 'eu-west-2';
      process.env.ENDPOINT = 'https://my.api/graphql';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call the beacon with the correct params', async () => {
      await handler(event, context, callback);

      expect(AWSAppSyncClient.prototype.mutate).toHaveBeenCalledWith({
        mutation,
        variables: {
          id: 'balance-id',
          input: {
            balance: 0,
            vat: {
              owed: 0,
              paid: 0,
            },
          },
          owner: 'owner-id',
        },
      });
    });

    it('should fail the batch when a failed record has no sequence number', async () => {
      vi.mocked(AWSAppSyncClient.prototype.mutate).mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      await expect(handler(event, context, callback)).rejects.toThrow(
        'Something has gone wrong',
      );
    });
  });
});
