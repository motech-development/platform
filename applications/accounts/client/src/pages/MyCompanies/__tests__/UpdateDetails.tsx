import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import DELETE_COMPANY from '../../../graphql/company/DELETE_COMPANY';
import GET_COMPANIES from '../../../graphql/company/GET_COMPANIES';
import GET_COMPANY from '../../../graphql/company/GET_COMPANY';
import UPDATE_COMPANY from '../../../graphql/company/UPDATE_COMPANY';
import TestProvider, { add } from '../../../utils/TestProvider';
import UpdateDetails from '../UpdateDetails';

describe('UpdateDetails', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/update-company/company-uuid'],
    });

    jest.spyOn(history, 'push');
  });

  describe('success', () => {
    beforeEach(async () => {
      cache = new InMemoryCache();

      cache.writeQuery({
        data: {
          getCompanies: {
            __typename: 'Companies',
            id: 'company-uuid',
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
                id: 'company-uuid',
                name: 'New company',
              },
            ],
          },
        },
        query: GET_COMPANIES,
      });

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
            <MockedProvider mocks={mocks} cache={cache}>
              <UpdateDetails />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you to the dashboard on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('New company');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/dashboard/company-uuid',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('New company');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
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
      const { findAllByRole, findByRole, findByText, queryByRole } = component;

      await act(async () => {
        await findByText('New company');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await findByRole('dialog');

        const [, , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should delete a client', async () => {
      const {
        findAllByRole,
        findByTestId,
        findByLabelText,
        findByText,
      } = component;

      await act(async () => {
        await findByText('New company');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: { focus: () => {}, value: 'New company' },
        });

        await wait();

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await waitForApollo(0);

        await wait();

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith('/my-companies');
    });

    it('should display a success toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('New company');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: { focus: () => {}, value: 'New company' },
        });

        await wait();

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await waitForApollo(0);

        await wait();
      });

      await wait(() =>
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
      });
    });

    it('should display an error toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('New company');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: { focus: () => {}, value: 'New company' },
        });

        await wait();

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await waitForApollo(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'delete-company.error',
        }),
      );
    });
  });
});
