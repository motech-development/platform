import transformBalance, { ITransactionItem } from '../transform-balance';

describe('transform-balance', () => {
  it('should throw if balance is undefined', () => {
    expect(() => {
      transformBalance();
    }).toThrow('Balance not found');
  });

  it('should throw if transactions are undefined', () => {
    const balance = {
      balance: 0,
      currency: 'GBP',
      id: 'company-id',
      items: {},
      vat: {
        owed: 0,
        paid: 0,
      },
    };

    expect(() => {
      transformBalance(balance);
    }).toThrow('No transactions returned');
  });

  it('should return balance when there are no transactions', () => {
    const balance = {
      balance: 0,
      currency: 'GBP',
      id: 'company-id',
      items: {},
      vat: {
        owed: 0,
        paid: 0,
      },
    };
    const transactions: ITransactionItem[] = [];

    expect(transformBalance(balance, transactions)).toEqual({
      balance: 0,
      currency: 'GBP',
      id: 'company-id',
      transactions: [],
      vat: {
        owed: 0,
        paid: 0,
      },
    });
  });

  it('should return balance when there are transactions', () => {
    const balance = {
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
    const transactions = [
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

    expect(transformBalance(balance, transactions)).toEqual({
      balance: 2419.71,
      currency: 'GBP',
      id: 'company-id',
      transactions: [
        {
          balance: 2419.71,
          currency: 'GBP',
          date: '2019-12-31T00:00:00.000Z',
          items: [
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
          ],
        },
        {
          balance: -541.2,
          currency: 'GBP',
          date: '2019-12-15T00:00:00.000Z',
          items: [
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
          ],
        },
        {
          balance: -192.2,
          currency: 'GBP',
          date: '2019-12-04T00:00:00.000Z',
          items: [
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
          ],
        },
        {
          balance: -190,
          currency: 'GBP',
          date: '2019-11-25T00:00:00.000Z',
          items: [
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
          ],
        },
      ],
      vat: {
        owed: 493.48,
        paid: 98.54,
      },
    });
  });
});
