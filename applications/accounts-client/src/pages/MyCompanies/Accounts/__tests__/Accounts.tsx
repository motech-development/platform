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
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import DELETE_TRANSACTION from '../../../../graphql/transaction/DELETE_TRANSACTION';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Accounts from '../Accounts';

describe('Accounts', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id'],
    });
  });

  describe('success', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_BALANCE,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [
                      {
                        amount: -20,
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    balance: 0,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [],
                  },
                  {
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  owed: 100,
                  paid: 0,
                },
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
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await wait();
      });
    });

    it('should show the correct page title', async () => {
      const { findAllByRole } = component;
      const [, title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.title');
    });

    it('should show the overview card', async () => {
      const { findAllByRole } = component;
      const [, , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.overview.title');
    });

    it('should show the balance', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.balance'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the VAT owed', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.vat-owed'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the VAT paid', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.vat-paid'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the add transaction card', async () => {
      const { findAllByRole } = component;
      const [, , , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.record-transaction.title');
    });

    it('should have the correct add transaction link', async () => {
      const { findAllByRole } = component;
      const [link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/record-transaction',
      );
    });

    it('should show the pending transactions card', async () => {
      const { findAllByRole } = component;
      const [, , , , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.pending-transactions.title');
    });

    it('should have the correct pending transactions link', async () => {
      const { findAllByRole } = component;
      const [, link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/pending-transactions',
      );
    });

    it('should show the dashboard card', async () => {
      const { findAllByRole } = component;
      const [, , , , , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.dashboard.title');
    });

    it('should have the correct dashboard link', async () => {
      const { findAllByRole } = component;
      const [, , link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/dashboard/company-id',
      );
    });

    it('should show the transaction list table', async () => {
      const { findByRole } = component;

      await expect(findByRole('table')).resolves.toBeInTheDocument();
    });

    it('should display delete confirmation modal', async () => {
      const { findByRole, findAllByText } = component;
      const [button] = await findAllByText('transactions-list.delete');

      fireEvent.click(button);

      await expect(findByRole('dialog')).resolves.toBeInTheDocument();
    });

    it('should hide the delete confirmation modal', async () => {
      const { findAllByRole, findByRole, findByText, queryByRole } = component;

      await act(async () => {
        await findByText('accounts.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        await findByRole('dialog');

        const [, , , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('accounts.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });

        await wait();

        const [, , , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'delete-transaction.success',
      });
    });
  });

  describe('failure', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_BALANCE,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [
                      {
                        amount: -20,
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    balance: 0,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [],
                  },
                  {
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  owed: 100,
                  paid: 0,
                },
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
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await wait();
      });
    });

    it('should display an error toast when deleting a client', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('accounts.title');

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });

        await wait();

        const [, , , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'danger',
        message: 'delete-transaction.error',
      });
    });
  });
});
