import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import getBalance, { IEvent } from '../get-balance';
import delay from '../../shared/delay';
import transformBalance, {
  IBalanceItem,
  ITransactionItem,
} from '../../shared/transform-balance';

jest.mock('../../shared/delay', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../shared/transform-balance', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('get-balance', () => {
  let event: IEvent;

  beforeEach(() => {
    event = {
      id: 'id',
      owner: 'owner',
    };
  });

  it('should throw an error if no table is set', async () => {
    await expect(getBalance(event)).rejects.toThrow('No table set');
  });

  describe('with a table set', () => {
    let env: NodeJS.ProcessEnv;
    let balance: IBalanceItem;
    let transactions: ITransactionItem[];

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';

      balance = {
        balance: 2419.71,
        currency: 'GBP',
        id: 'company-id',
        items: {
          '2019-11-25T00:00:00.000Z': -190,
          '2019-12-04T00:00:00.000Z': -2.2,
          '2019-12-15T00:00:00.000Z': -349,
          '2019-12-31T00:00:00.000Z': 2960.91,
        },
        vat: {
          owed: 493.48,
          paid: 98.54,
        },
      };

      transactions = [
        {
          amount: -2.2,
          category: '',
          companyId: 'company-id',
          date: '2019-12-04T00:00:00.000Z',
          description: 'Food',
          id: 'transaction-1',
          name: 'Canteen',
          status: 'confirmed',
          vat: 0.37,
        },
        {
          amount: -190,
          category: 'Accommodation',
          companyId: 'company-id',
          date: '2019-11-25T00:00:00.000Z',
          description: 'Room',
          id: 'transaction-2',
          name: 'Hotel',
          status: 'confirmed',
          vat: 31.67,
        },
        {
          amount: -349,
          category: 'Equipment',
          companyId: 'company-id',
          date: '2019-12-15T00:00:00.000Z',
          description: 'iPad',
          id: 'transaction-3',
          name: 'Apple',
          status: 'confirmed',
          vat: 66.5,
        },
        {
          amount: 2960.91,
          category: 'Sales',
          companyId: 'company-id',
          date: '2019-12-31T00:00:00.000Z',
          description: 'Invoice #1',
          id: 'transaction-1',
          name: 'Client',
          status: 'confirmed',
          vat: 493.48,
        },
      ];

      DocumentClient.prototype.get = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({
          Item: balance,
        }),
      });
      DocumentClient.prototype.query = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({
          Items: transactions,
        }),
      });
    });

    afterEach(() => {
      process.env = env;
    });

    it('should have the correct delay', async () => {
      await getBalance(event);

      expect(delay).toHaveBeenCalledWith(1000);
    });

    it('should call get with the correct params', async () => {
      await getBalance(event);

      expect(DocumentClient.prototype.get).toHaveBeenCalledWith({
        Key: {
          __typename: 'Balance',
          id: 'id',
        },
        TableName: 'app-table',
      });
    });

    it('should call query with the correct params', async () => {
      await getBalance(event);

      expect(DocumentClient.prototype.query).toHaveBeenCalledWith({
        ExpressionAttributeNames: {
          '#data': 'data',
          '#owner': 'owner',
          '#typename': '__typename',
        },
        ExpressionAttributeValues: {
          ':data': 'owner:id:confirmed',
          ':owner': 'owner',
          ':typename': 'Transaction',
        },
        FilterExpression: '#owner = :owner',
        IndexName: '__typename-data-index',
        KeyConditionExpression:
          '#typename = :typename AND begins_with(#data, :data)',
        ScanIndexForward: false,
        TableName: 'app-table',
      });
    });

    it('should call transformBalance with the correct params', async () => {
      await getBalance(event);

      expect(transformBalance).toHaveBeenCalledWith(balance, transactions);
    });
  });
});
