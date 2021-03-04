import { InMemoryCache } from '@apollo/client/cache';
import { updateCache } from '../ADD_CLIENT';
import GET_CLIENTS from '../GET_CLIENTS';

describe('ADD_CLIENT', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-id',
          items: [
            {
              __typename: 'Client',
              address: {
                line1: '1 Street',
                line2: '',
                line3: 'Town',
                line4: 'County',
                line5: 'KT1 1NE',
              },
              contact: {
                email: 'info@contact.com',
                telephone: '07712345678',
              },
              id: 'client-1',
              name: 'Client 1',
            },
          ],
        },
        getCompany: {
          __typename: 'Company',
          id: 'company-id',
          name: 'Test company',
        },
      },
      query: GET_CLIENTS,
      variables: {
        id: 'company-id',
      },
    });

    jest.spyOn(cache, 'modify');
  });

  it('should add new client to the cache', () => {
    const input = {
      data: {
        createClient: {
          __typename: 'Client',
          address: {
            line1: '1 Street',
            line2: '',
            line3: 'Town',
            line4: 'County',
            line5: 'KT1 1NE',
          },
          companyId: 'company-id',
          contact: {
            email: 'info@contact.com',
            telephone: '07712345678',
          },
          id: 'client-2',
          name: 'Client 2',
        },
      },
    };

    updateCache(cache, input);

    const result = cache.readQuery({
      query: GET_CLIENTS,
      variables: {
        id: 'company-id',
      },
    });

    expect(result).toEqual({
      getClients: {
        __typename: 'Clients',
        id: 'company-id',
        items: [
          {
            __typename: 'Client',
            address: {
              line1: '1 Street',
              line2: '',
              line3: 'Town',
              line4: 'County',
              line5: 'KT1 1NE',
            },
            contact: {
              email: 'info@contact.com',
              telephone: '07712345678',
            },
            id: 'client-1',
            name: 'Client 1',
          },
          {
            __typename: 'Client',
            address: {
              line1: '1 Street',
              line2: '',
              line3: 'Town',
              line4: 'County',
              line5: 'KT1 1NE',
            },
            contact: {
              email: 'info@contact.com',
              telephone: '07712345678',
            },
            id: 'client-2',
            name: 'Client 2',
          },
        ],
      },
      getCompany: {
        __typename: 'Company',
        id: 'company-id',
        name: 'Test company',
      },
    });
  });

  it('should not update cache if id already exists', () => {
    const input = {
      data: {
        createClient: {
          __typename: 'Client',
          address: {
            line1: '1 Street',
            line2: '',
            line3: 'Town',
            line4: 'County',
            line5: 'KT1 1NE',
          },
          companyId: 'company-id',
          contact: {
            email: 'info@contact.com',
            telephone: '07712345678',
          },
          id: 'client-1',
          name: 'Client 2',
        },
      },
    };

    updateCache(cache, input);

    const result = cache.readQuery({
      query: GET_CLIENTS,
      variables: {
        id: 'company-id',
      },
    });

    expect(result).toEqual({
      getClients: {
        __typename: 'Clients',
        id: 'company-id',
        items: [
          {
            __typename: 'Client',
            address: {
              line1: '1 Street',
              line2: '',
              line3: 'Town',
              line4: 'County',
              line5: 'KT1 1NE',
            },
            contact: {
              email: 'info@contact.com',
              telephone: '07712345678',
            },
            id: 'client-1',
            name: 'Client 1',
          },
        ],
      },
      getCompany: {
        __typename: 'Company',
        id: 'company-id',
        name: 'Test company',
      },
    });
  });

  it('should not modify cache if no data is passed', () => {
    updateCache(cache, {});

    expect(cache.modify).not.toHaveBeenCalled();
  });
});
