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
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createMemoryHistory, MemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import ADD_TRANSACTION from '../../../../graphql/transaction/ADD_TRANSACTION';
import GET_TRANSACTIONS from '../../../../graphql/transaction/GET_TRANSACTIONS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import RecordTransaction, { RECORD_TRANSACTION } from '../RecordTransaction';

describe('RecordTransaction', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeAll(() => {
    advanceTo('2020-05-07T11:58:17+01:00');
  });

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/record-transaction'],
    });

    jest.spyOn(history, 'push');

    cache = new InMemoryCache({});

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
        },
        getTransactions: {
          __typename: 'Transactions',
          items: [],
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        companyId: 'company-id',
        status: 'pending',
      },
    });

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
        },
        getTransactions: {
          __typename: 'Transactions',
          items: [],
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        companyId: 'company-id',
        status: 'confirmed',
      },
    });
  });

  afterAll(() => {
    clear();
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
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    __typename: 'BalanceTransaction',
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: -20,
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    __typename: 'BalanceTransaction',
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
        {
          request: {
            query: RECORD_TRANSACTION,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getClients: {
                __typename: 'Clients',
                items: [],
              },
              getSettings: {
                __typename: 'Settings',
                categories: [
                  {
                    __typename: 'ExpenseCategory',
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                vat: {
                  __typename: 'VatSettings',
                  pay: 20,
                },
              },
            },
          },
        },
        {
          request: {
            query: ADD_TRANSACTION,
            variables: {
              input: {
                amount: -999.99,
                category: 'Equipment',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Laptop',
                id: '',
                name: 'Apple',
                status: 'confirmed',
                vat: 166.66,
              },
            },
          },
          result: {
            data: {
              addTransaction: {
                __typename: 'Transaction',
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
            path="/accounts/:companyId/record-transaction"
            history={history}
          >
            <MockedProvider mocks={mocks} cache={cache}>
              <RecordTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        fireEvent.change(supplier, {
          target: {
            focus: () => {},
            value: 'Apple',
          },
        });

        fireEvent.change(description, {
          target: {
            focus: () => {},
            value: 'Laptop',
          },
        });

        fireEvent.click(status);

        fireEvent.change(category, {
          target: {
            value: 0,
          },
        });

        fireEvent.change(amount, {
          target: {
            focus: () => {},
            value: '999.99',
          },
        });

        await wait();

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        fireEvent.change(supplier, {
          target: {
            focus: () => {},
            value: 'Apple',
          },
        });

        fireEvent.change(description, {
          target: {
            focus: () => {},
            value: 'Laptop',
          },
        });

        fireEvent.click(status);

        fireEvent.change(category, {
          target: {
            value: 0,
          },
        });

        fireEvent.change(amount, {
          target: {
            focus: () => {},
            value: '999.99',
          },
        });

        await wait();

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(add).toHaveBeenCalledWith({
        colour: 'success',
        message: 'record-transaction.success',
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
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    __typename: 'BalanceTransaction',
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18+0000',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: -20,
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    __typename: 'BalanceTransaction',
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18+0000',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: 200,
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
        {
          request: {
            query: RECORD_TRANSACTION,
            variables: {
              id: 'company-id',
            },
          },
          result: {
            data: {
              getClients: {
                __typename: 'Clients',
                items: [
                  {
                    __typename: 'Client',
                    id: 'client-id',
                    name: 'Motech Development',
                  },
                ],
              },
              getSettings: {
                __typename: 'Settings',
                categories: [
                  {
                    __typename: 'ExpenseCategory',
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                vat: {
                  __typename: 'VatSettings',
                  pay: 20,
                },
              },
            },
          },
        },
        {
          request: {
            query: ADD_TRANSACTION,
            variables: {
              input: {
                amount: 999.99,
                category: 'Sale',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: '',
                name: 'Motech Development',
                status: 'confirmed',
                vat: 200,
              },
            },
          },
          result: {
            data: {
              addTransaction: {
                __typename: 'Transaction',
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
            path="/accounts/:companyId/record-transaction"
            history={history}
          >
            <MockedProvider mocks={mocks} cache={cache}>
              <RecordTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        fireEvent.change(supplier, {
          target: {
            focus: () => {},
            value: 'Motech Development',
          },
        });

        fireEvent.change(description, {
          target: {
            focus: () => {},
            value: 'Invoice #1',
          },
        });

        fireEvent.click(status);

        fireEvent.change(amount, {
          target: {
            focus: () => {},
            value: '999.99',
          },
        });

        await wait();

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });
  });
});
