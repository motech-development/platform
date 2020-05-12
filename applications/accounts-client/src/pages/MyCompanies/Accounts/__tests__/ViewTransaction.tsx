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
import UPDATE_TRANSACTION from '../../../../graphql/transaction/UPDATE_TRANSACTION';
import TestProvider, { add } from '../../../../utils/TestProvider';
import ViewTransaction, { VIEW_TRANSACTION } from '../ViewTransaction';

describe('ViewTransaction', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/view-transaction/transaction-id'],
    });

    jest.spyOn(history, 'push');
  });

  describe('purchase', () => {
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
            query: VIEW_TRANSACTION,
            variables: {
              companyId: 'company-id',
              transactionId: 'transaction-id',
            },
          },
          result: {
            data: {
              getClients: {
                items: [],
              },
              getSettings: {
                categories: [
                  {
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                vat: {
                  pay: 20,
                },
              },
              getTransaction: {
                amount: -999.99,
                category: 'Equipment',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Laptop',
                id: 'transaction-id',
                name: 'Apple',
                status: 'confirmed',
                vat: 166.66,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_TRANSACTION,
            variables: {
              input: {
                amount: -999.99,
                category: 'Equipment',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Laptop',
                id: 'transaction-id',
                name: 'Apple',
                status: 'confirmed',
                vat: 166.66,
              },
            },
          },
          result: {
            data: {
              updateTransaction: {
                amount: -999.99,
                category: 'Equipment',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Laptop',
                id: 'transaction-id',
                name: 'Apple',
                status: 'confirmed',
                vat: 166.66,
              },
            },
          },
        },
        {
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-id',
            },
          },
          result: {
            data: {
              deleteTransaction: {
                companyId: 'company-id',
                id: 'transaction-id',
                status: 'confirmed',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/view-transaction/:transactionId"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <ViewTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'view-transaction.success',
      });
    });

    it('should display delete confirmation modal', async () => {
      const { findByRole, findByText } = component;
      const button = await findByText('view-transaction.delete-transaction');

      fireEvent.click(button);

      await expect(findByRole('dialog')).resolves.toBeInTheDocument();
    });

    it('should hide the delete confirmation modal', async () => {
      const { findAllByRole, findByRole, findByText, queryByRole } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        await findByRole('dialog');

        const [, , , , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should delete the transaction', async () => {
      const {
        findAllByRole,
        findByLabelText,
        findByTestId,
        findByText,
      } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'Apple',
          },
        });

        await wait();

        const [, , , , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'Apple',
          },
        });

        await wait();

        const [, , , , , deleteButton] = await findAllByRole('button');

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

  describe('sale', () => {
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
            query: VIEW_TRANSACTION,
            variables: {
              companyId: 'company-id',
              transactionId: 'transaction-id',
            },
          },
          result: {
            data: {
              getClients: {
                items: [
                  {
                    id: 'client-id',
                    name: 'Motech Development',
                  },
                ],
              },
              getSettings: {
                categories: [
                  {
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                vat: {
                  pay: 20,
                },
              },
              getTransaction: {
                amount: 999.99,
                category: 'Sales',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
                status: 'confirmed',
                vat: 200,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_TRANSACTION,
            variables: {
              input: {
                amount: 999.99,
                category: 'Sales',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
                status: 'confirmed',
                vat: 200,
              },
            },
          },
          result: {
            data: {
              updateTransaction: {
                amount: 999.99,
                category: 'Sales',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
                status: 'confirmed',
                vat: 200,
              },
            },
          },
        },
        {
          error: new Error(),
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-id',
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/view-transaction/:transactionId"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <ViewTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'view-transaction.success',
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'Motech Development',
          },
        });

        await wait();

        const [, , , , , deleteButton] = await findAllByRole('button');

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
