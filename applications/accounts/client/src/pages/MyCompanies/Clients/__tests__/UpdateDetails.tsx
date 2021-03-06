import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import DELETE_CLIENT from '../../../../graphql/client/DELETE_CLIENT';
import GET_CLIENT from '../../../../graphql/client/GET_CLIENT';
import GET_CLIENTS from '../../../../graphql/client/GET_CLIENTS';
import UPDATE_CLIENT from '../../../../graphql/client/UPDATE_CLIENT';
import TestProvider, { add } from '../../../../utils/TestProvider';
import UpdateDetails from '../UpdateDetails';

describe('UpdateDetails', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/clients/company-id/update-details/client-id'],
    });

    jest.spyOn(history, 'push');
  });

  describe('when data is returned', () => {
    describe('success', () => {
      beforeEach(async () => {
        cache = new InMemoryCache();

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
                  companyId: 'company-id',
                  contact: {
                    email: 'info@contact.com',
                    telephone: '07712345678',
                  },
                  id: 'client-id',
                  name: 'New client',
                },
                {
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
                  id: 'client-id-2',
                  name: 'New client 2',
                },
              ],
            },
            getCompany: {
              id: 'company-id',
              name: 'Test Company',
            },
          },
          query: GET_CLIENTS,
          variables: {
            id: 'company-id',
          },
        });

        mocks = [
          {
            request: {
              query: DELETE_CLIENT,
              variables: {
                id: 'client-id',
              },
            },
            result: {
              data: {
                deleteClient: {
                  companyId: 'company-id',
                  id: 'client-id',
                  name: 'New client',
                },
              },
            },
          },
          {
            request: {
              query: GET_CLIENT,
              variables: {
                id: 'client-id',
              },
            },
            result: {
              data: {
                getClient: {
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
                  name: 'New client',
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_CLIENT,
              variables: {
                input: {
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
                  name: 'New client',
                },
              },
            },
            result: {
              data: {
                updateClient: {
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
                  name: 'New client',
                },
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider
              path="/clients/:companyId/update-details/:clientId"
              history={history}
            >
              <MockedProvider mocks={mocks} cache={cache}>
                <UpdateDetails />
              </MockedProvider>
            </TestProvider>,
          );
        });
      });

      it('should redirect you back to clients page on complete', async () => {
        const { findAllByRole, findByText } = component;

        await act(async () => {
          await findByText('New client');

          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(history.push).toHaveBeenCalledWith(
            '/my-companies/clients/company-id',
          ),
        );
      });

      it('should display a success toast', async () => {
        const { findAllByRole, findByText } = component;

        await act(async () => {
          await findByText('New client');

          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'update-details.success',
          }),
        );
      });

      it('should display delete confirmation modal', async () => {
        const { findByRole, findByText } = component;
        const button = await findByText('update-details.delete-client');

        fireEvent.click(button);

        await waitFor(() =>
          expect(findByRole('dialog')).resolves.toBeInTheDocument(),
        );
      });

      it('should hide the delete confirmation modal', async () => {
        const {
          findAllByRole,
          findByRole,
          findByText,
          queryByRole,
        } = component;

        await act(async () => {
          await findByText('New client');

          const [, button] = await findAllByRole('button');

          fireEvent.click(button);

          await findByRole('dialog');

          const [, , cancelButton] = await findAllByRole('button');

          fireEvent.click(cancelButton);
        });

        await waitFor(() =>
          expect(queryByRole('dialog')).not.toBeInTheDocument(),
        );
      });

      it('should delete a client', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          await findByText('New client');

          const [, button] = await findAllByRole('button');

          fireEvent.click(button);

          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });

          const [, , , deleteButton] = await findAllByRole('button');

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(history.push).toHaveBeenCalledWith(
            '/my-companies/clients/company-id',
          ),
        );
      });

      it('should display a success toast when deleting a client', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          await findByText('New client');

          const [, button] = await findAllByRole('button');

          fireEvent.click(button);

          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });

          const [, , , deleteButton] = await findAllByRole('button');

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'delete-client.success',
          }),
        );
      });
    });

    describe('failure', () => {
      beforeEach(async () => {
        mocks = [
          {
            error: new Error(),
            request: {
              query: DELETE_CLIENT,
              variables: {
                id: 'client-id-1',
              },
            },
          },
          {
            request: {
              query: GET_CLIENT,
              variables: {
                id: 'client-id',
              },
            },
            result: {
              data: {
                getClient: {
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
                  name: 'New client',
                },
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider
              path="/clients/:companyId/update-details/:clientId"
              history={history}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <UpdateDetails />
              </MockedProvider>
            </TestProvider>,
          );
        });
      });

      it('should display an error toast when deleting a client', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          await findByText('New client');

          const [, button] = await findAllByRole('button');

          fireEvent.click(button);

          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });

          const [, , , deleteButton] = await findAllByRole('button');

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'delete-client.error',
          }),
        );
      });
    });
  });

  describe('when data is not returned', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: DELETE_CLIENT,
            variables: {
              id: 'client-id',
            },
          },
          result: {
            data: {},
          },
        },
        {
          request: {
            query: GET_CLIENT,
            variables: {
              id: 'client-id',
            },
          },
          result: {
            data: {
              getClient: {
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
                name: 'New client',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_CLIENT,
            variables: {
              input: {
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
                name: 'New client',
              },
            },
          },
          result: {
            data: {},
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/clients/:companyId/update-details/:clientId"
            history={history}
          >
            <MockedProvider mocks={mocks}>
              <UpdateDetails />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should display a warning toast when updating a client', async () => {
      const { findAllByRole, findByText } = component;

      await act(async () => {
        await findByText('New client');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'update-details.retry',
        }),
      );
    });

    it('should redirect you to the right place when updating a client', async () => {
      const { findAllByRole, findByText } = component;

      await act(async () => {
        await findByText('New client');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/clients/company-id',
        ),
      );
    });

    it('should display a warning toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('New client');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'New client',
          },
        });

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'delete-client.retry',
        }),
      );
    });

    it('should redirect you to the right place when when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('New client');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: { focus: () => {}, value: 'New client' },
        });

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/clients/company-id',
        ),
      );
    });
  });
});
