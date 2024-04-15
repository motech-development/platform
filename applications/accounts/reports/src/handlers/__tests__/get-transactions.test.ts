import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import Status from '../../shared/status';
import { handler, IEvent } from '../get-transactions';

describe('get-transactions', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    ddb = mockClient(DynamoDBClient);

    ddb.on(QueryCommand).resolves({
      Items: [
        {
          amount: 1000,
          category: 'Sales',
          date: '08/04/2021',
          description: 'For work',
          name: 'Client',
          vat: 166.67,
        },
        {
          amount: 41.11,
          category: 'Bills',
          date: '09/04/2021',
          description: 'Mobile',
          name: 'EE',
          vat: 6.85,
        },
        {
          amount: 2.4,
          category: 'Bills',
          date: '10/04/2021',
          description: 'Domain',
          name: 'GoDaddy',
          vat: 0.4,
        },
      ],
    });

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      currency: '£',
      owner: 'OWNER-ID',
      status: Status.Confirmed,
      year: 2020,
      yearEnd: {
        day: 5,
        month: 3,
      },
    };
  });

  it('should throw an error if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('with table set', () => {
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

    it('should query DynamoDB with the correct params', async () => {
      await handler(event, context, callback);

      expect(ddb).toReceiveCommandWith(QueryCommand, {
        ExpressionAttributeNames: {
          '#data': 'data',
          '#owner': 'owner',
          '#typename': '__typename',
        },
        ExpressionAttributeValues: {
          ':lower': 'OWNER-ID:COMPANY-ID:confirmed:2020-04-06T00:00:00Z',
          ':owner': 'OWNER-ID',
          ':typename': 'Transaction',
          ':upper': 'OWNER-ID:COMPANY-ID:confirmed:2021-04-05T23:59:59Z',
        },
        FilterExpression: '#owner = :owner',
        IndexName: '__typename-data-index',
        KeyConditionExpression:
          '#typename = :typename AND #data BETWEEN :lower AND :upper',
        ScanIndexForward: false,
        TableName: 'TABLE-NAME',
      });
    });

    it('should return the correct data when items are returned', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        companyId: 'COMPANY-ID',
        complete: false,
        currency: '£',
        items: [
          {
            amount: 1000,
            category: 'Sales',
            date: '08/04/2021',
            description: 'For work',
            name: 'Client',
            vat: 166.67,
          },
          {
            amount: 41.11,
            category: 'Bills',
            date: '09/04/2021',
            description: 'Mobile',
            name: 'EE',
            vat: 6.85,
          },
          {
            amount: 2.4,
            category: 'Bills',
            date: '10/04/2021',
            description: 'Domain',
            name: 'GoDaddy',
            vat: 0.4,
          },
        ],
        owner: 'OWNER-ID',
      });
    });

    it('should return the correct data when no items are returned', async () => {
      ddb.on(QueryCommand).resolvesOnce({
        Items: [],
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
