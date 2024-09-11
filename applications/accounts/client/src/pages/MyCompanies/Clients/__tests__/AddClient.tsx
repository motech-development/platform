import { ApolloCache, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Client,
  Clients,
  CreateClientMutation,
} from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import AddClient, { ADD_CLIENT, update } from '../AddClient';
import { GET_CLIENTS } from '../Clients';

describe('AddClient', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/clients/company-id/add-client'];
  });

  describe('when data is returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: ADD_CLIENT,
            variables: {
              input: {
                address: {
                  line1: '1 Street',
                  line3: 'Town',
                  line4: 'County',
                  line5: 'KT1 1NE',
                },
                companyId: 'company-id',
                contact: {
                  email: 'info@contact.com',
                  telephone: '07712345678',
                },
                id: '',
                name: 'New company',
              },
            },
          },
          result: {
            data: {
              createClient: {
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
                id: 'client-id',
                name: 'New company',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/clients/:companyId/add-client" history={history}>
            <MockedProvider mocks={mocks}>
              <AddClient />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should redirect you back to clients page on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await userEvent.type(line1, '1 Street');

      await userEvent.type(line3, 'Town');

      await userEvent.type(line4, 'County');

      await userEvent.type(line5, 'KT1 1NE');

      await userEvent.type(email, 'info@contact.com');

      await userEvent.type(telephone, '07712345678');

      await userEvent.type(name, 'New company');

      const [button] = await findAllByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      fireEvent.click(button);

      await act(async () => {
        await Promise.resolve();
      });

      await expect(
        findByTestId('/my-companies/clients/company-id'),
      ).resolves.toBeInTheDocument();
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await userEvent.type(line1, '1 Street');

      await userEvent.type(line3, 'Town');

      await userEvent.type(line4, 'County');

      await userEvent.type(line5, 'KT1 1NE');

      await userEvent.type(email, 'info@contact.com');

      await userEvent.type(telephone, '07712345678');

      await userEvent.type(name, 'New company');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'add-client.success',
        }),
      );
    });
  });

  describe('when data is not returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: ADD_CLIENT,
            variables: {
              input: {
                address: {
                  line1: '1 Street',
                  line3: 'Town',
                  line4: 'County',
                  line5: 'KT1 1NE',
                },
                companyId: 'company-id',
                contact: {
                  email: 'info@contact.com',
                  telephone: '07712345678',
                },
                id: '',
                name: 'New company',
              },
            },
          },
          result: {
            data: {
              createClient: null,
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/clients/:companyId/add-client" history={history}>
            <MockedProvider mocks={mocks}>
              <AddClient />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a warning toast', async () => {
      const { findAllByRole, findByLabelText } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await userEvent.type(line1, '1 Street');

      await userEvent.type(line3, 'Town');

      await userEvent.type(line4, 'County');

      await userEvent.type(line5, 'KT1 1NE');

      await userEvent.type(email, 'info@contact.com');

      await userEvent.type(telephone, '07712345678');

      await userEvent.type(name, 'New company');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'add-client.retry',
        }),
      );
    });

    it('should redirect you back to company page', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      const line1 = await findByLabelText('address.line1');
      const line3 = await findByLabelText('address.line3');
      const line4 = await findByLabelText('address.line4');
      const line5 = await findByLabelText('address.line5');
      const email = await findByLabelText('contact-details.email');
      const telephone = await findByLabelText('contact-details.telephone');
      const name = await findByLabelText(
        'client-form.client-details.name.label',
      );

      await userEvent.type(line1, '1 Street');

      await userEvent.type(line3, 'Town');

      await userEvent.type(line4, 'County');

      await userEvent.type(line5, 'KT1 1NE');

      await userEvent.type(email, 'info@contact.com');

      await userEvent.type(telephone, '07712345678');

      await userEvent.type(name, 'New company');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await act(async () => {
        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/clients/company-id'),
      ).resolves.toBeInTheDocument();
    });
  });

  describe('cache', () => {
    let cache: ApolloCache<CreateClientMutation>;

    beforeEach(() => {
      cache =
        new InMemoryCache() as unknown as ApolloCache<CreateClientMutation>;

      cache.writeQuery({
        data: {
          getClients: {
            __typename: 'Clients',
            id: 'company-id',
            items: [
              {
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
          } as unknown as Clients,
          getCompany: {
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
          } as Client,
        },
      };

      update(cache, input, {});

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
          id: 'company-id',
          name: 'Test company',
        },
      });
    });

    it('should not update cache if id already exists', () => {
      const input = {
        data: {
          createClient: {
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

      update(cache, input, {});

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
          id: 'company-id',
          name: 'Test company',
        },
      });
    });

    it('should not modify cache if no data is passed', () => {
      update(cache, {}, {});

      expect(cache.modify).not.toHaveBeenCalled();
    });
  });
});
