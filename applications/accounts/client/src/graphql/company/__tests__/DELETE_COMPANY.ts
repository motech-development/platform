import { InMemoryCache } from '@apollo/client/cache';
import { updateCache } from '../DELETE_COMPANY';
import GET_COMPANIES from '../GET_COMPANIES';

describe('DELETE_COMPANY', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeQuery({
      data: {
        getCompanies: {
          __typename: 'Companies',
          id: 'user-id',
          items: [
            {
              __typename: 'Company',
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              bank: {
                accountNumber: '12345678',
                sortCode: '12-34-56',
              },
              companyNumber: '12345678',
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'company-uuid-1',
              name: 'New company',
            },
          ],
        },
      },
      query: GET_COMPANIES,
      variables: {
        id: 'user-id',
      },
    });

    jest.spyOn(cache, 'modify');
  });

  it('should remove company from cache if item exists', () => {
    const input = {
      data: {
        deleteCompany: {
          id: 'company-uuid-1',
          name: 'New company',
          owner: 'user-id',
        },
      },
    };

    updateCache(cache, input);

    const result = cache.readQuery({
      query: GET_COMPANIES,
      variables: {
        id: 'user-id',
      },
    });

    expect(result).toEqual({
      getCompanies: {
        __typename: 'Companies',
        id: 'user-id',
        items: [],
      },
    });
  });

  it('should not remove company from cache if item does not exist', () => {
    const input = {
      data: {
        deleteCompany: {
          id: 'company-uuid-2',
          name: 'New company',
          owner: 'user-id',
        },
      },
    };

    updateCache(cache, input);

    const result = cache.readQuery({
      query: GET_COMPANIES,
      variables: {
        id: 'user-id',
      },
    });

    expect(result).toEqual({
      getCompanies: {
        __typename: 'Companies',
        id: 'user-id',
        items: [
          {
            __typename: 'Company',
            address: {
              line1: '1 Street',
              line2: '',
              line3: 'Town',
              line4: 'County',
              line5: 'KT1 1NE',
            },
            bank: {
              accountNumber: '12345678',
              sortCode: '12-34-56',
            },
            companyNumber: '12345678',
            contact: {
              email: 'info@contact.com',
              telephone: '07712345678',
            },
            id: 'company-uuid-1',
            name: 'New company',
          },
        ],
      },
    });
  });

  it('should not modify cache if no data is passed', () => {
    updateCache(cache, {});

    expect(cache.modify).not.toHaveBeenCalled();
  });
});
