import { Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../get-transactions';
import Status from '../../shared/status';

describe('get-transactions', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    DocumentClient.prototype.query = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [],
      }),
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

      expect(DocumentClient.prototype.query).toHaveBeenCalledWith({
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

    it('should return the correct data', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        companyId: 'COMPANY-ID',
        currency: '£',
        items: [],
        owner: 'OWNER-ID',
      });
    });
  });
});
