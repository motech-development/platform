import { ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Link, Route, Routes } from 'react-router-dom';
import { typePolicies } from '../../../../components/ApolloClient';
import TransactionUpdates, {
  TransactionStateProvider,
} from '../../../../components/TransactionUpdates';
import { TransactionStatus } from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Accounts, {
  DELETE_TRANSACTION,
  GET_BALANCE,
  ON_TRANSACTION,
} from '../Accounts';

describe('Accounts', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/accounts/company-id'];
  });

  it('appends older pages but replaces cached rows when reconnect recovers missed changes', async () => {
    let disconnect: (() => void) | undefined;
    const first = {
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      date: '2026-09-05T12:00:00.000Z',
      description: 'First page transaction',
      id: 'first-transaction',
      name: 'First customer',
    };
    const older = {
      ...first,
      description: 'Older page transaction',
      id: 'older-transaction',
      name: 'Older customer',
    };
    let connected = true;
    const list = vi.fn((nextToken: string | undefined) => {
      if (nextToken) return { items: [older], nextToken: null };
      return connected
        ? { items: [first], nextToken: 'older-page' }
        : { items: [], nextToken: null };
    });
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => {
              connected = false;
              observer.error(new Error('Connection lost'));
            };
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetBalance') {
            observer.next({
              data: {
                getBalance: {
                  balance: 40,
                  currency: 'GBP',
                  id: 'company-id',
                  vat: { owed: 0, paid: 0 },
                },
                getTransactions: {
                  __typename: 'Transactions',
                  id: 'company-id',
                  ...list(operation.variables.nextToken as string | undefined),
                  status: TransactionStatus.Confirmed,
                },
              },
            });
            observer.complete();
          }
        }),
    );
    const { findByText, getByRole, queryByText } = render(
      <TestProvider path="/accounts/:companyId" history={history}>
        <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <Accounts />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await findByText(first.description);
    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await findByText(older.description);
    expect(queryByText(first.description)).toBeInTheDocument();
    const previousCalls = list.mock.calls.length;
    act(() => disconnect?.());
    await waitFor(() => expect(list).toHaveBeenCalledTimes(previousCalls + 1), {
      timeout: 2000,
    });
    await waitFor(() => {
      expect(queryByText(first.description)).not.toBeInTheDocument();
      expect(queryByText(older.description)).not.toBeInTheDocument();
    });
    expect(list).toHaveBeenLastCalledWith(undefined);
  });

  it('keeps live corrections within loaded pages until older transactions are fetched', async () => {
    let signal: ((transactionId: string) => void) | undefined;
    const newest = {
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Newest loaded transaction',
      id: 'newest-transaction',
      name: 'Newest customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const boundary = {
      ...newest,
      date: '2026-09-04T12:00:00.000Z',
      description: 'Oldest loaded transaction',
      id: 'boundary-transaction',
      name: 'Boundary customer',
    };
    const historical = {
      ...newest,
      date: '2026-09-01T12:00:00.000Z',
      description: 'Historical transaction before edit',
      id: 'historical-transaction',
      name: 'Historical customer',
    };
    const recent = {
      ...newest,
      date: '2026-09-06T12:00:00.000Z',
      description: 'New transaction received live',
      id: 'recent-transaction',
      name: 'Recent customer',
    };
    const corrections = new Map([
      [newest.id, { ...newest, description: 'Newest transaction edited live' }],
      [
        historical.id,
        { ...historical, description: 'Historical transaction edited live' },
      ],
      [recent.id, recent],
    ]);
    const readState = vi.fn((id: string) => corrections.get(id));
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signal = (transactionId) =>
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId,
                  },
                },
              });
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: readState(
                  operation.variables.transactionId as string,
                ),
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
            const hasOlderPage = !operation.variables.nextToken;
            observer.next({
              data: {
                getBalance: {
                  balance: 60,
                  currency: 'GBP',
                  id: 'company-id',
                  vat: { owed: 0, paid: 0 },
                },
                getTransactions: {
                  __typename: 'Transactions',
                  id: 'company-id',
                  items: hasOlderPage ? [newest, boundary] : [historical],
                  nextToken: hasOlderPage ? 'older-page' : null,
                  status: TransactionStatus.Confirmed,
                },
              },
            });
            observer.complete();
          }
        }),
    );
    const { findByText, getAllByRole, getByRole, queryByText } = render(
      <TestProvider path="/accounts/:companyId" history={history}>
        <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <Accounts />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await findByText(boundary.description);
    await act(async () => {
      signal?.(historical.id);
      await waitForApollo(0);
    });
    expect(readState).toHaveBeenCalledWith(historical.id);
    expect(
      queryByText('Historical transaction edited live'),
    ).not.toBeInTheDocument();

    act(() => signal?.(newest.id));
    await findByText('Newest transaction edited live');
    expect(queryByText(newest.description)).not.toBeInTheDocument();

    act(() => signal?.(recent.id));
    await findByText(recent.description);
    expect(queryByText(boundary.description)).not.toBeInTheDocument();
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(2);

    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await findByText('Historical transaction edited live');
    expect(queryByText(historical.description)).not.toBeInTheDocument();
    expect(queryByText(boundary.description)).toBeInTheDocument();
    expect(queryByText('Newest transaction edited live')).toBeInTheDocument();
    expect(queryByText(recent.description)).toBeInTheDocument();
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(4);
  });

  it('refreshes an uncorrected cached transaction after returning from the dashboard', async () => {
    let resolveReturn: (() => void) | undefined;
    const unsubscribe = vi.fn();
    const list = vi.fn();
    const cachedTransaction = {
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Deleted while viewing dashboard',
      id: 'missed-transaction',
      name: 'Missed customer',
    };
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            return unsubscribe;
          }
          if (operation.operationName === 'GetBalance') {
            list();
            const respond = (items: (typeof cachedTransaction)[]) => {
              observer.next({
                data: {
                  getBalance: {
                    balance: 20,
                    currency: 'GBP',
                    id: 'company-id',
                    vat: { owed: 0, paid: 0 },
                  },
                  getTransactions: {
                    __typename: 'Transactions',
                    id: 'company-id',
                    items,
                    nextToken: null,
                    status: TransactionStatus.Confirmed,
                  },
                },
              });
              observer.complete();
            };
            if (list.mock.calls.length === 1) respond([cachedTransaction]);
            else resolveReturn = () => respond([]);
          }
          return undefined;
        }),
    );
    const { findByText, getByRole, queryByText } = render(
      <TestProvider
        path="/my-companies/*"
        history={['/my-companies/accounts/company-id']}
      >
        <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
          <TransactionStateProvider>
            <Routes>
              <Route
                path="accounts/:companyId"
                element={
                  <TransactionUpdates companyId="company-id" owner="user-id">
                    <Accounts />
                  </TransactionUpdates>
                }
              />
              <Route
                path="dashboard/:companyId"
                element={
                  <Link to="/my-companies/accounts/company-id">
                    Return to accounts
                  </Link>
                }
              />
            </Routes>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await findByText(cachedTransaction.description);
    fireEvent.click(getByRole('link', { name: 'accounts.dashboard.button' }));
    await findByText('Return to accounts');
    expect(unsubscribe).toHaveBeenCalledOnce();

    fireEvent.click(getByRole('link', { name: 'Return to accounts' }));
    await waitFor(() => expect(list).toHaveBeenCalledTimes(2));
    await act(async () => {
      resolveReturn?.();
      await waitForApollo(0);
    });

    await findByText('no-transactions.title');
    expect(queryByText(cachedTransaction.description)).not.toBeInTheDocument();
  });

  describe('success', () => {
    beforeEach(async () => {
      cache = new InMemoryCache({
        typePolicies,
      });
      mocks = [
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
              getTransactions: {
                __typename: 'Transactions',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Transaction',
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                  },
                  {
                    __typename: 'Transaction',
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: 'sdiflhoiheow',
                status: 'confirmed',
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                __typename: 'Balance',
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 0,
                },
              },
              getTransactions: {
                __typename: 'Transactions',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Transaction',
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: 'sdiflhoiheow',
                status: 'confirmed',
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              nextToken: 'sdiflhoiheow',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                __typename: 'Balance',
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 0,
                },
              },
              getTransactions: {
                __typename: 'Transactions',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Transaction',
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
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
        {
          request: {
            query: ON_TRANSACTION,
            variables: {
              id: 'company-id',
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onTransaction: {
                __typename: 'Balance',
                balance: 180,
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider addTypename cache={cache} mocks={mocks}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should show the correct page title', async () => {
      const { findAllByRole } = component;
      const [title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.title');
    });

    it('should show the overview card', async () => {
      const { findAllByRole } = component;
      const [, title] = await findAllByRole('heading');

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
      const [, , title] = await findAllByRole('heading');

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
      const [, , , title] = await findAllByRole('heading');

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
      const [, , , , title] = await findAllByRole('heading');

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

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await findByRole('dialog');

      await act(async () => {
        const [, , , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });
      });

      await act(async () => {
        const [, , , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        fireEvent.click(deleteButton);

        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'delete-transaction.success',
        }),
      );
    });

    it('should load more items', async () => {
      const { findAllByRole, findByText } = component;

      await findByText('accounts.title');

      const [, , button] = await findAllByRole('button');

      await act(async () => {
        fireEvent.click(button);

        await waitForApollo(0);
      });

      await waitFor(() => expect(button).not.toBeInTheDocument());
    });
  });

  describe('failure', () => {
    beforeEach(async () => {
      cache = new InMemoryCache({
        typePolicies,
      });

      mocks = [
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
              getTransactions: {
                __typename: 'Transactions',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Transaction',
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                  },
                  {
                    __typename: 'Transaction',
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                __typename: 'Balance',
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 0,
                },
              },
              getTransactions: {
                __typename: 'Transactions',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Transaction',
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
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
        {
          request: {
            query: ON_TRANSACTION,
            variables: {
              id: 'company-id',
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onTransaction: {
                __typename: 'Balance',
                balance: 180,
                vat: {
                  __typename: 'BalanceVat',
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider cache={cache} mocks={mocks}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
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
          message: 'delete-transaction.error',
        }),
      );
    });
  });
});
