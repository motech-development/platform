import { InMemoryCache } from '@apollo/client/cache';
import GET_TYPEAHEAD from '../../typeahead/GET_TYPEAHEAD';
import GET_TRANSACTIONS from '../GET_TRANSACTIONS';
import { updateCache } from '../UPDATE_TRANSACTION';

describe('UPDATE_TRANSACTION', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache({
      typePolicies: {
        Transactions: {
          keyFields: ['id', 'status'],
        },
      },
    });

    jest.spyOn(cache, 'modify');
  });

  describe('typeahead', () => {
    describe('with null data', () => {
      beforeEach(() => {
        cache.writeQuery({
          data: {
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: null,
              sales: null,
              suppliers: null,
            },
          },
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });
      });

      it('should add sale description to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Sales',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A sale',
              id: 'transaction-id',
              name: 'A client',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: [],
            sales: ['A sale'],
            suppliers: [],
          },
        });
      });

      it('should add purchase description and supplier to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Bills',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A purchase',
              id: 'transaction-id',
              name: 'Your favourite shop',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: ['A purchase'],
            sales: [],
            suppliers: ['Your favourite shop'],
          },
        });
      });
    });

    describe('without null data', () => {
      beforeEach(() => {
        cache.writeQuery({
          data: {
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['B Purchase'],
              sales: ['B Sale'],
              suppliers: ['B Supplier'],
            },
          },
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });
      });

      it('should add sale description to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Sales',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A sale',
              id: 'transaction-id',
              name: 'A client',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: ['B Purchase'],
            sales: ['A sale', 'B Sale'],
            suppliers: ['B Supplier'],
          },
        });
      });

      it('should add purchase description and supplier to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Bills',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A purchase',
              id: 'transaction-id',
              name: 'Your favourite shop',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: ['A purchase', 'B Purchase'],
            sales: ['B Sale'],
            suppliers: ['B Supplier', 'Your favourite shop'],
          },
        });
      });
    });

    describe('with set data', () => {
      beforeEach(() => {
        cache.writeQuery({
          data: {
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['A purchase'],
              sales: ['A sale'],
              suppliers: ['Your favourite shop'],
            },
          },
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });
      });

      it('should not add sale description to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Sales',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A sale',
              id: 'transaction-id',
              name: 'A client',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: ['A purchase'],
            sales: ['A sale'],
            suppliers: ['Your favourite shop'],
          },
        });
      });

      it('should not add purchase description and supplier to the typeahead', () => {
        const input = {
          data: {
            updateTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Bills',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A purchase',
              id: 'transaction-id',
              name: 'Your favourite shop',
              scheduled: false,
              status: 'confirmed',
              vat: 0,
            },
          },
        };

        updateCache(cache, input);

        const result = cache.readQuery({
          query: GET_TYPEAHEAD,
          variables: {
            id: 'company-id',
          },
        });

        expect(result).toEqual({
          getTypeahead: {
            __typename: 'Typeahead',
            id: 'company-id',
            purchases: ['A purchase'],
            sales: ['A sale'],
            suppliers: ['Your favourite shop'],
          },
        });
      });
    });
  });

  describe('transactions', () => {
    beforeEach(() => {
      cache.writeQuery({
        data: {
          getBalance: {
            __typename: 'Balance',
            currency: 'GBP',
            id: 'company-id',
            transactions: [],
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

      cache.writeQuery({
        data: {
          getBalance: {
            __typename: 'Balance',
            currency: 'GBP',
            id: 'company-id',
            transactions: [],
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
                description: 'A pending purchase',
                id: 'transaction-id-3',
                name: 'Your favourite shop',
                scheduled: false,
              },
              {
                __typename: 'Transaction',
                amount: 100,
                attachment: '',
                date: '2021-02-23',
                description: 'A pending purchase',
                id: 'transaction-id-4',
                name: 'Your favourite shop',
                scheduled: false,
              },
            ],
            status: 'pending',
          },
        },
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: 'pending',
        },
      });
    });

    it('should move a transation from confirmed to pending', () => {
      const input = {
        data: {
          updateTransaction: {
            __typename: 'Transaction',
            amount: 1000,
            attachment: '',
            category: 'Bills',
            companyId: 'company-id',
            date: '2021-02-22',
            description: 'A updated purchase',
            id: 'transaction-id-1',
            name: 'Your favourite shop',
            scheduled: false,
            status: 'pending',
            vat: 0,
          },
        },
      };

      updateCache(cache, input);

      const confirmed = cache.readQuery({
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: 'confirmed',
        },
      });
      const pending = cache.readQuery({
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: 'pending',
        },
      });

      expect(confirmed).toEqual({
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
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
          ],
          status: 'confirmed',
        },
      });

      expect(pending).toEqual({
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
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
              description: 'A pending purchase',
              id: 'transaction-id-3',
              name: 'Your favourite shop',
              scheduled: false,
            },
            {
              __typename: 'Transaction',
              amount: 1000,
              attachment: '',
              date: '2021-02-22',
              description: 'A updated purchase',
              id: 'transaction-id-1',
              name: 'Your favourite shop',
              scheduled: false,
            },
            {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              date: '2021-02-23',
              description: 'A pending purchase',
              id: 'transaction-id-4',
              name: 'Your favourite shop',
              scheduled: false,
            },
          ],
          status: 'pending',
        },
      });
    });

    it('should move a transation from pending to confirmed', () => {
      const input = {
        data: {
          updateTransaction: {
            __typename: 'Transaction',
            amount: 100,
            attachment: '',
            category: 'Bills',
            companyId: 'company-id',
            date: '2021-02-23',
            description: 'A pending purchase',
            id: 'transaction-id-4',
            name: 'Your favourite shop',
            scheduled: false,
            status: 'confirmed',
            vat: 0,
          },
        },
      };

      updateCache(cache, input);

      const confirmed = cache.readQuery({
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: 'confirmed',
        },
      });
      const pending = cache.readQuery({
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: 'pending',
        },
      });

      expect(confirmed).toEqual({
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
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
            {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              date: '2021-02-23',
              description: 'A pending purchase',
              id: 'transaction-id-4',
              name: 'Your favourite shop',
              scheduled: false,
            },
          ],
          status: 'confirmed',
        },
      });

      expect(pending).toEqual({
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
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
              description: 'A pending purchase',
              id: 'transaction-id-3',
              name: 'Your favourite shop',
              scheduled: false,
            },
          ],
          status: 'pending',
        },
      });
    });
  });

  it('should not modify cache if no data is passed', () => {
    updateCache(cache, {});

    expect(cache.modify).not.toHaveBeenCalled();
  });
});
