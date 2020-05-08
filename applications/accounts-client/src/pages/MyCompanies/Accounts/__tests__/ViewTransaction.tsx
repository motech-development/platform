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
import TestProvider, { add } from '../../../../utils/TestProvider';
import ViewTransaction, {
  UPDATE_TRANSACTION,
  VIEW_TRANSACTION,
} from '../ViewTransaction';

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
                category: 'Sale',
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
                category: 'Sale',
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
                category: 'Sale',
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
  });
});
