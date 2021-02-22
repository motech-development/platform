import { InMemoryCache } from '@apollo/client/cache';
import GET_TYPEAHEAD from '../../typeahead/GET_TYPEAHEAD';
import { updateCache } from '../UPDATE_TRANSACTION';

describe('UPDATE_TRANSACTION', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();

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

  it('should not modify cache if no data is passed', () => {
    updateCache(cache, {});

    expect(cache.modify).not.toHaveBeenCalled();
  });
});
