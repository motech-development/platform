import {
  MockedProvider,
  MockedResponse,
  wait as apolloWait,
} from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import DELETE_TRANSACTION from '../../../../graphql/transaction/DELETE_TRANSACTION';
import GET_TRANSACTIONS from '../../../../graphql/transaction/GET_TRANSACTIONS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import PendingTransactions from '../PendingTransactions';

describe('PendingTransactions', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/pending-transactions'],
    });
  });

  describe('success', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              companyId: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                    scheduled: true,
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                    scheduled: false,
                  },
                ],
              },
            },
          },
        },
        {
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-2',
            },
          },
          result: {
            data: {
              deleteTransaction: {
                companyId: 'company-id',
                id: 'transaction-2',
                status: 'confirmed',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await wait();
      });
    });

    it('should have the correct page title', async () => {
      const { findByText } = component;
      const title = await findByText('pending-transactions.title');
      const subTitle = await findByText('pending-transactions.sub-title');

      expect(title).toBeInTheDocument();
      expect(subTitle).toBeInTheDocument();
    });

    it('should have the correct table headings', async () => {
      const { findAllByRole } = component;
      const [name, date, amount, action] = await findAllByRole('columnheader');

      expect(name).toHaveTextContent('pending-transactions.transactions.name');
      expect(date).toHaveTextContent('pending-transactions.transactions.date');
      expect(amount).toHaveTextContent(
        'pending-transactions.transactions.amount',
      );
      expect(action).toHaveTextContent(
        'pending-transactions.transactions.action',
      );
    });

    it('should display view button', async () => {
      const { findAllByText } = component;
      const [view] = await findAllByText(
        'pending-transactions.transactions.view',
      );

      expect(view).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/view-transaction/transaction-2',
      );
    });

    it('should display delete confirmation modal', async () => {
      const { findByRole, findAllByText } = component;
      const [button] = await findAllByText(
        'pending-transactions.transactions.delete',
      );

      fireEvent.click(button);

      await expect(findByRole('dialog')).resolves.toBeInTheDocument();
    });

    it('should hide the delete confirmation modal', async () => {
      const { findAllByRole, findByRole, queryByRole } = component;

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        await findByRole('dialog');

        const [, , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('pending-transactions.title');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });

        await wait();

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'delete-transaction.success',
        }),
      );
    });
  });

  describe('failure', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              companyId: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                    scheduled: true,
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                    scheduled: false,
                  },
                ],
              },
            },
          },
        },
        {
          error: new Error(),
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-2',
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await wait();
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('pending-transactions.title');

        const [button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });

        await wait();

        const [, , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'delete-transaction.error',
        }),
      );
    });
  });

  describe('no data', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              companyId: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [],
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await wait();
      });
    });

    it('should display no transactions message', async () => {
      const { findByText } = component;
      const heading = await findByText('no-transactions.title');
      const description = await findByText('no-transactions.description');

      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});
