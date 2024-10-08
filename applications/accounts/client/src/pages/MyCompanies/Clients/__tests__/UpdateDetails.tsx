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
import { Clients, DeleteClientMutation } from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import { GET_CLIENTS } from '../Clients';
import UpdateDetails, {
  DELETE_CLIENT,
  GET_CLIENT,
  update,
  UPDATE_CLIENT,
} from '../UpdateDetails';

describe('UpdateDetails', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/clients/company-id/update-details/client-id'];
  });

  describe('when data is returned', () => {
    describe('success', () => {
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
              <MockedProvider mocks={mocks}>
                <UpdateDetails />
              </MockedProvider>
            </TestProvider>,
          );

          await Promise.resolve();
        });
      });

      it('should redirect you back to clients page on complete', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await findByText('New client');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          findByTestId('/my-companies/clients/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast', async () => {
        const { findAllByRole, findByText } = component;

        await findByText('New client');

        await act(async () => {
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
        const { findAllByRole, findByRole, findByText, queryByRole } =
          component;

        await findByText('New client');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await findByRole('dialog');

        await act(async () => {
          const [, , cancelButton] = await findAllByRole('button');

          fireEvent.click(cancelButton);
        });

        await waitFor(() =>
          expect(queryByRole('dialog')).not.toBeInTheDocument(),
        );
      });

      it('should delete a client', async () => {
        const { findAllByRole, findByLabelText, findByTestId, findByText } =
          component;

        await findByText('New client');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });
        });

        await act(async () => {
          const [, , , deleteButton] = await findAllByRole('button');

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await expect(
          findByTestId('/my-companies/clients/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast when deleting a client', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await findByText('New client');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });
        });

        await act(async () => {
          const [, , , deleteButton] = await findAllByRole('button');

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

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
                id: 'client-id',
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

          await Promise.resolve();
        });
      });

      it('should display an error toast when deleting a client', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await findByText('New client');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New client',
            },
          });
        });

        await act(async () => {
          const [, , , deleteButton] = await findAllByRole('button');

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

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
            data: {
              deleteClient: null,
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
              updateClient: null,
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
            <MockedProvider mocks={mocks}>
              <UpdateDetails />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a warning toast when updating a client', async () => {
      const { findAllByRole, findByText } = component;

      await findByText('New client');

      await act(async () => {
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
      const { findAllByRole, findByTestId, findByText } = component;

      await findByText('New client');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/clients/company-id'),
      ).resolves.toBeInTheDocument();
    });

    it('should display a warning toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('New client');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'New client',
          },
        });
      });

      await act(async () => {
        const [, , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

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
      const { findAllByRole, findByLabelText, findByTestId, findByText } =
        component;

      await findByText('New client');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: { focus: () => {}, value: 'New client' },
        });
      });

      await act(async () => {
        const [, , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        fireEvent.click(deleteButton);

        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/clients/company-id'),
      ).resolves.toBeInTheDocument();
    });
  });

  describe('cache', () => {
    let cache: ApolloCache<DeleteClientMutation>;

    beforeEach(() => {
      cache =
        new InMemoryCache() as unknown as ApolloCache<DeleteClientMutation>;

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

    it('should remove client from cache if item exists', () => {
      const input = {
        data: {
          deleteClient: {
            companyId: 'company-id',
            id: 'client-1',
            name: 'Client 1',
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
          items: [],
        },
        getCompany: {
          id: 'company-id',
          name: 'Test company',
        },
      });
    });

    it('should not remove client from cache if item does not exist', () => {
      const input = {
        data: {
          deleteClient: {
            companyId: 'company-id',
            id: 'client-2',
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
