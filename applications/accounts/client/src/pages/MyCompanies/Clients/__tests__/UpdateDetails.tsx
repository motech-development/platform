import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { typePolicies } from '../../../../components/ApolloClient';
import TestProvider, { add } from '../../../../utils/TestProvider';
import UpdateDetails, {
  DELETE_CLIENT,
  GET_CLIENT,
  UPDATE_CLIENT,
} from '../UpdateDetails';

describe('UpdateDetails', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/clients/company-id/update-details/client-id'];
  });

  describe('when data is returned', () => {
    describe('success', () => {
      beforeEach(async () => {
        cache = new InMemoryCache({
          addTypename: true,
          typePolicies,
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
                  __typename: 'Client',
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
                  __typename: 'Client',
                  address: {
                    __typename: 'Address',
                    line1: '1 Street',
                    line2: '',
                    line3: 'Town',
                    line4: 'County',
                    line5: 'KT1 1NE',
                  },
                  companyId: 'company-id',
                  contact: {
                    __typename: 'Contact',
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
                  __typename: 'Client',
                  address: {
                    __typename: 'Address',
                    line1: '1 Street',
                    line2: '',
                    line3: 'Town',
                    line4: 'County',
                    line5: 'KT1 1NE',
                  },
                  companyId: 'company-id',
                  contact: {
                    __typename: 'Contact',
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
                  __typename: 'Client',
                  address: {
                    __typename: 'Address',
                    line1: '1 Street',
                    line2: '',
                    line3: 'Town',
                    line4: 'County',
                    line5: 'KT1 1NE',
                  },
                  companyId: 'company-id',
                  contact: {
                    __typename: 'Contact',
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
              <MockedProvider cache={cache} mocks={mocks}>
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
        cache = new InMemoryCache({
          addTypename: true,
          typePolicies,
        });

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
                  __typename: 'Client',
                  address: {
                    __typename: 'Address',
                    line1: '1 Street',
                    line2: '',
                    line3: 'Town',
                    line4: 'County',
                    line5: 'KT1 1NE',
                  },
                  companyId: 'company-id',
                  contact: {
                    __typename: 'Contact',
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
            <MockedProvider cache={cache} mocks={mocks}>
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
});
