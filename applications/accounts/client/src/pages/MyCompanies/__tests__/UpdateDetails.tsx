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
import { Companies, DeleteClientMutation } from '../../../graphql/graphql';
import TestProvider, { add } from '../../../utils/TestProvider';
import { GET_COMPANIES } from '../MyCompanies';
import UpdateDetails, {
  DELETE_COMPANY,
  GET_COMPANY,
  update,
  UPDATE_COMPANY,
} from '../UpdateDetails';

describe('UpdateDetails', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/update-company/company-uuid'];
  });

  describe('when data is returned', () => {
    describe('success', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: DELETE_COMPANY,
              variables: {
                id: 'company-uuid',
              },
            },
            result: {
              data: {
                deleteCompany: {
                  id: 'company-uuid',
                  name: 'New company',
                  owner: 'user-id',
                },
              },
            },
          },
          {
            request: {
              query: GET_COMPANY,
              variables: {
                id: 'company-uuid',
              },
            },
            result: {
              data: {
                getCompany: {
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
                  id: 'company-uuid',
                  name: 'New company',
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_COMPANY,
              variables: {
                input: {
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
                  id: 'company-uuid',
                  name: 'New company',
                },
              },
            },
            result: {
              data: {
                updateCompany: {
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
                  id: 'company-uuid',
                  name: 'New company',
                },
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider path="/update-company/:companyId" history={history}>
              <MockedProvider mocks={mocks}>
                <UpdateDetails />
              </MockedProvider>
            </TestProvider>,
          );

          await Promise.resolve();
        });
      });

      it('should redirect you to the dashboard on complete', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await findByText('New company');

        await act(async () => {
          const [button] = await findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          findByTestId('/my-companies/dashboard/company-uuid'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast', async () => {
        const { findAllByRole, findByText } = component;

        await findByText('New company');

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
        const button = await findByText('update-details.delete-company');

        fireEvent.click(button);

        await expect(findByRole('dialog')).resolves.toBeInTheDocument();
      });

      it('should hide the delete confirmation modal', async () => {
        const { findAllByRole, findByRole, findByText, queryByRole } =
          component;

        await findByText('New company');

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

      it('should delete a company', async () => {
        const { findAllByRole, findByLabelText, findByTestId, findByText } =
          component;

        await findByText('New company');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New company',
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
          findByTestId('/my-companies'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast when deleting a company', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await findByText('New company');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New company',
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
            message: 'delete-company.success',
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
              query: DELETE_COMPANY,
              variables: {
                id: 'company-uuid',
              },
            },
          },
          {
            request: {
              query: GET_COMPANY,
              variables: {
                id: 'company-uuid',
              },
            },
            result: {
              data: {
                getCompany: {
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
                  id: 'company-uuid',
                  name: 'New company',
                },
              },
            },
          },
        ];

        await act(async () => {
          component = render(
            <TestProvider path="/update-company/:companyId" history={history}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <UpdateDetails />
              </MockedProvider>
            </TestProvider>,
          );

          await Promise.resolve();
        });
      });

      it('should display an error toast when deleting a company', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await findByText('New company');

        await act(async () => {
          const [, button] = await findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'New company',
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
            message: 'delete-company.error',
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
            query: DELETE_COMPANY,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              deleteCompany: null,
            },
          },
        },
        {
          request: {
            query: GET_COMPANY,
            variables: {
              id: 'company-uuid',
            },
          },
          result: {
            data: {
              getCompany: {
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
                id: 'company-uuid',
                name: 'New company',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_COMPANY,
            variables: {
              input: {
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
                id: 'company-uuid',
                name: 'New company',
              },
            },
          },
          result: {
            data: {
              updateCompany: null,
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/update-company/:companyId" history={history}>
            <MockedProvider mocks={mocks}>
              <UpdateDetails />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a warning toast when updating a company', async () => {
      const { findAllByRole, findByText } = component;

      await findByText('New company');

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

    it('should redirect you to the right place when updating a company', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await findByText('New company');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);
      });

      await expect(
        findByTestId('/my-companies/dashboard/company-uuid'),
      ).resolves.toBeInTheDocument();
    });

    it('should display a warning toast when deleting a company', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('New company');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'New company',
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
          message: 'delete-company.retry',
        }),
      );
    });

    it('should redirect you to the right place when deleting a company', async () => {
      const { findAllByRole, findByLabelText, findByTestId, findByText } =
        component;

      await findByText('New company');

      await act(async () => {
        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'New company',
          },
        });
      });

      await act(async () => {
        const [, , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        fireEvent.click(deleteButton);

        await waitForApollo(0);
      });

      await expect(findByTestId('/my-companies')).resolves.toBeInTheDocument();
    });
  });

  describe('cache', () => {
    let cache: ApolloCache<DeleteClientMutation>;

    beforeEach(() => {
      cache =
        new InMemoryCache() as unknown as ApolloCache<DeleteClientMutation>;

      cache.writeQuery({
        data: {
          getCompanies: {
            __typename: 'Companies',
            id: 'user-id',
            items: [
              {
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
          } as Companies,
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

      update(cache, input, {});

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

      update(cache, input, {});

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
      update(cache, {}, {});

      expect(cache.modify).not.toHaveBeenCalled();
    });
  });
});
