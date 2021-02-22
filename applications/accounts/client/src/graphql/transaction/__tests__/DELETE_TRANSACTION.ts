import { InMemoryCache } from '@apollo/client/cache';
import GET_BALANCE from '../../balance/GET_BALANCE';
import { updateCache } from '../DELETE_TRANSACTION';
import GET_TRANSACTIONS from '../GET_TRANSACTIONS';

describe('DELETE_TRANSACTION', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [
            {
              items: [
                {
                  id: 'transaction-id-0',
                },
              ],
            },
            {
              items: [
                {
                  id: 'transaction-id-1',
                },
              ],
            },
          ],
        },
      },
      query: GET_BALANCE,
      variables: {
        id: 'company-id',
      },
    });

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [
            {
              items: [
                {
                  id: 'transaction-id-0',
                },
              ],
            },
            {
              items: [
                {
                  id: 'transaction-id-1',
                },
              ],
            },
          ],
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [
            {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              date: '2021-02-21',
              description: 'A purchase',
              id: 'transaction-id-0',
              name: 'Your favourite shop',
              scheduled: false,
            },
            {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              date: '2021-02-23',
              description: 'A purchase',
              id: 'transaction-id-1',
              name: 'Your favourite shop',
              scheduled: false,
            },
          ],
          status: 'confirmed',
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        id: 'company-id',
        status: 'confirmed',
      },
    });

    jest.spyOn(cache, 'modify');
  });

  it('should remove transaction from the transaction cache', () => {
    const input = {
      data: {
        deleteTransaction: {
          companyId: 'company-id',
          id: 'transaction-id-0',
          status: 'confirmed',
        },
      },
    };

    updateCache(cache, input);

    const result = cache.readQuery({
      query: GET_TRANSACTIONS,
      variables: {
        id: 'company-id',
        status: 'confirmed',
      },
    });

    expect(result).toEqual({
      getBalance: {
        __typename: 'Balance',
        currency: 'GBP',
        id: 'company-id',
        transactions: [
          {
            items: [
              {
                id: 'transaction-id-1',
              },
            ],
          },
        ],
      },
      getTransactions: {
        __typename: 'Transactions',
        id: 'company-id',
        items: [
          {
            __typename: 'Transaction',
            amount: 100,
            attachment: '',
            date: '2021-02-23',
            description: 'A purchase',
            id: 'transaction-id-1',
            name: 'Your favourite shop',
            scheduled: false,
          },
        ],
        status: 'confirmed',
      },
    });
  });

  it('should not modify cache if no data is passed', () => {
    updateCache(cache, {});

    expect(cache.modify).not.toHaveBeenCalled();
  });
});
