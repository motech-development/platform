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

  it.each([101, 100])(
    'preserves an expanded list after reconnect when the server returns at most %i rows',
    async (pageSize) => {
      let disconnect: (() => void) | undefined;
      const rows = Array.from({ length: 101 }, (_, index) => ({
        __typename: 'Transaction',
        amount: 20,
        attachment: '',
        category: 'Sales',
        companyId: 'company-id',
        date: new Date(Date.UTC(2026, 8, 5 - index)).toISOString(),
        description: `Loaded transaction ${index}`,
        id: `transaction-${index}`,
        name: `Customer ${index}`,
        refund: false,
        scheduled: false,
        status: TransactionStatus.Confirmed,
        vat: 0,
      }));
      const list =
        vi.fn<(variables: { count: number; nextToken?: string }) => void>();
      const link = new ApolloLink(
        (operation) =>
          new Observable((observer) => {
            if (operation.operationName === 'OnTransactionChange') {
              disconnect = () => observer.error(new Error('Connection lost'));
              observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
            } else if (operation.operationName === 'GetTransactionState') {
              observer.next({
                data: {
                  getTransactionState: rows.find(
                    ({ id }) => id === operation.variables.transactionId,
                  ),
                },
              });
              observer.complete();
            } else if (operation.operationName === 'GetBalance') {
              list({
                count: Number(operation.variables.count),
                ...(operation.variables.nextToken
                  ? { nextToken: String(operation.variables.nextToken) }
                  : {}),
              });
              const offset = Number(operation.variables.nextToken ?? 0);
              const count = Math.min(
                Number(operation.variables.count),
                pageSize,
              );
              const items = rows.slice(offset, offset + count);
              observer.next({
                data: {
                  getBalance: {
                    balance: 2020,
                    currency: 'GBP',
                    id: 'company-id',
                    vat: { owed: 0, paid: 0 },
                  },
                  getTransactions: {
                    __typename: 'Transactions',
                    id: 'company-id',
                    items,
                    nextToken:
                      offset + count < rows.length
                        ? String(offset + count)
                        : null,
                    status: TransactionStatus.Confirmed,
                  },
                },
              });
              observer.complete();
            }
          }),
      );
      const { findByText, getByRole, getByText } = render(
        <TestProvider path="/accounts/:companyId" history={history}>
          <MockedProvider
            link={link}
            cache={new InMemoryCache({ typePolicies })}
          >
            <TransactionStateProvider>
              <TransactionUpdates companyId="company-id" owner="user-id">
                <Accounts />
              </TransactionUpdates>
            </TransactionStateProvider>
          </MockedProvider>
        </TestProvider>,
      );
      await findByText(rows[99].description);
      fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
      await findByText(rows[100].description);
      const previousCalls = list.mock.calls.length;
      act(() => disconnect?.());
      await waitFor(
        () => expect(list.mock.calls.length).toBeGreaterThan(previousCalls),
        {
          timeout: 2000,
        },
      );
      await act(() => waitForApollo(0));
      await waitFor(() => {
        expect(getByText(rows[0].description)).toBeInTheDocument();
        expect(getByText(rows[100].description)).toBeInTheDocument();
      });
      expect(list.mock.calls[previousCalls][0].count).toBe(101);
      const finalRequest =
        pageSize === 100 ? { count: 1, nextToken: '100' } : { count: 101 };
      await waitFor(() => expect(list).toHaveBeenLastCalledWith(finalRequest));
    },
  );

  it.each(['before', 'after'])(
    'discards an obsolete page arriving %s a replacement cursor request after reconnect',
    async (releaseOrder) => {
      let disconnect: (() => void) | undefined;
      let releasePage: (() => void) | undefined;
      let reconnected = false;
      const rows = Array.from({ length: 2 }, (_, index) => ({
        __typename: 'Transaction',
        amount: 20,
        attachment: '',
        category: 'Sales',
        companyId: 'company-id',
        date: new Date(Date.UTC(2026, 8, 5 - index)).toISOString(),
        description: `Loaded transaction ${index}`,
        id: `transaction-${index}`,
        name: `Customer ${index}`,
        refund: false,
        scheduled: false,
        status: TransactionStatus.Confirmed,
        vat: 0,
      }));
      const inserted = {
        ...rows[0],
        date: new Date(new Date(rows[0].date).getTime() - 1000).toISOString(),
        description: 'Transaction inserted while disconnected',
        id: 'inserted-transaction',
        name: 'Inserted customer',
      };
      const recoveredList = vi.fn();
      const cursorRequests = vi.fn();
      const link = new ApolloLink(
        (operation) =>
          new Observable((observer) => {
            if (operation.operationName === 'OnTransactionChange') {
              disconnect = () => {
                reconnected = true;
                observer.error(new Error('Connection lost'));
              };
              observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
            } else if (operation.operationName === 'GetTransactionState') {
              observer.next({
                data: {
                  getTransactionState: [...rows, inserted].find(
                    ({ id }) => id === operation.variables.transactionId,
                  ),
                },
              });
              observer.complete();
            } else if (operation.operationName === 'GetBalance') {
              const reply = (items: typeof rows, nextToken: string | null) => {
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
                      items,
                      nextToken,
                      status: TransactionStatus.Confirmed,
                    },
                  },
                });
                observer.complete();
              };
              if (operation.variables.nextToken) cursorRequests();
              if (operation.variables.nextToken && !reconnected) {
                releasePage = () => reply(rows.slice(1), null);
                return;
              }
              if (reconnected) recoveredList(operation.variables);
              const current = reconnected ? [rows[0], inserted, rows[1]] : rows;
              const offset = Number(operation.variables.nextToken ?? 0);
              const count = Math.min(Number(operation.variables.count), 1);
              reply(
                current.slice(offset, offset + count),
                offset + count < current.length ? String(offset + count) : null,
              );
            }
          }),
      );
      const { findByText, getAllByRole, getByRole, queryByText } = render(
        <TestProvider path="/accounts/:companyId" history={history}>
          <MockedProvider
            link={link}
            cache={new InMemoryCache({ typePolicies })}
          >
            <TransactionStateProvider>
              <TransactionUpdates companyId="company-id" owner="user-id">
                <Accounts />
              </TransactionUpdates>
            </TransactionStateProvider>
          </MockedProvider>
        </TestProvider>,
      );
      await findByText(rows[0].description);
      await act(() => waitForApollo(30));
      fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
      await waitFor(() => expect(releasePage).toBeDefined());

      act(() => disconnect?.());
      await waitFor(() => expect(recoveredList).toHaveBeenCalled(), {
        timeout: 2000,
      });
      await act(() => waitForApollo(30));
      if (releaseOrder === 'before')
        await act(async () => {
          releasePage?.();
          await waitForApollo(30);
        });

      expect(
        getAllByRole('link', { name: 'transactions-list.view' }),
      ).toHaveLength(1);
      expect(queryByText(rows[1].description)).not.toBeInTheDocument();
      const loadMore = getByRole('button', { name: 'accounts.load-more' });
      expect(loadMore).not.toBeDisabled();
      fireEvent.click(loadMore);

      await waitFor(() => expect(cursorRequests).toHaveBeenCalledTimes(2));
      await findByText(inserted.description);
      if (releaseOrder === 'after')
        await act(async () => {
          releasePage?.();
          await waitForApollo(30);
        });
      expect(queryByText(inserted.description)).toBeInTheDocument();
      expect(
        getAllByRole('link', { name: 'transactions-list.view' }),
      ).toHaveLength(2);
      expect(
        getByRole('button', { name: 'accounts.load-more' }),
      ).not.toBeDisabled();
      expect(recoveredList).toHaveBeenLastCalledWith({
        count: 100,
        id: 'company-id',
        nextToken: '1',
        status: TransactionStatus.Confirmed,
      });
    },
  );

  it('ignores an old cursor response after leaving and returning to accounts', async () => {
    let releasePage: (() => void) | undefined;
    let returning = false;
    const rows = Array.from({ length: 3 }, (_, index) => ({
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      category: 'Sales',
      companyId: 'company-id',
      date: new Date(Date.UTC(2026, 8, 5 - index)).toISOString(),
      description: `Loaded transaction ${index}`,
      id: `transaction-${index}`,
      name: `Customer ${index}`,
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    }));
    const inserted = {
      ...rows[0],
      date: new Date(new Date(rows[0].date).getTime() - 1000).toISOString(),
      description: 'Transaction inserted while viewing the dashboard',
      id: 'inserted-transaction',
      name: 'Inserted customer',
    };
    const list = vi.fn();
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: [...rows, inserted].find(
                  ({ id }) => id === operation.variables.transactionId,
                ),
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
            list(operation.variables);
            const reply = (items: typeof rows, nextToken: string | null) => {
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
                    items,
                    nextToken,
                    status: TransactionStatus.Confirmed,
                  },
                },
              });
              observer.complete();
            };
            if (operation.variables.nextToken && !returning) {
              releasePage = () => reply(rows.slice(1, 2), '2');
              return;
            }
            const current = returning
              ? [rows[0], inserted, ...rows.slice(1)]
              : rows;
            const offset = Number(operation.variables.nextToken ?? 0);
            const count = Math.min(Number(operation.variables.count), 1);
            reply(
              current.slice(offset, offset + count),
              offset + count < current.length ? String(offset + count) : null,
            );
          }
        }),
    );
    const { findByText, getAllByRole, getByRole, queryByText } = render(
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
    await findByText(rows[0].description);
    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await waitFor(() => expect(releasePage).toBeDefined());
    fireEvent.click(getByRole('link', { name: 'accounts.dashboard.button' }));
    await findByText('Return to accounts');
    returning = true;
    fireEvent.click(getByRole('link', { name: 'Return to accounts' }));
    await waitFor(() => expect(list).toHaveBeenCalledTimes(3));
    await findByText(rows[0].description);
    await act(() => waitForApollo(30));

    await act(async () => {
      releasePage?.();
      await waitForApollo(30);
    });
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(1);
    expect(queryByText(rows[1].description)).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await waitFor(() =>
      expect(list).toHaveBeenLastCalledWith({
        count: 100,
        id: 'company-id',
        nextToken: '1',
        status: TransactionStatus.Confirmed,
      }),
    );
    await findByText(inserted.description);
  });

  it('recovers only the visible window after a deletion automatically refills it', async () => {
    let disconnect: (() => void) | undefined;
    let removeFirst: (() => void) | undefined;
    let deleted = false;
    const rows = Array.from({ length: 103 }, (_, index) => ({
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      category: 'Sales',
      companyId: 'company-id',
      date: new Date(Date.UTC(2026, 8, 5 - index)).toISOString(),
      description: `Loaded transaction ${index}`,
      id: `transaction-${index}`,
      name: `Customer ${index}`,
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    }));
    const list = vi.fn();
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => observer.error(new Error('Connection lost'));
            removeFirst = () => {
              deleted = true;
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId: rows[0].id,
                  },
                },
              });
            };
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState:
                  deleted && operation.variables.transactionId === rows[0].id
                    ? null
                    : rows.find(
                        ({ id }) => id === operation.variables.transactionId,
                      ),
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
            list(operation.variables);
            const offset = operation.variables.nextToken
              ? Number(operation.variables.nextToken)
              : Number(deleted);
            const count = Number(operation.variables.count);
            observer.next({
              data: {
                getBalance: {
                  balance: 2060,
                  currency: 'GBP',
                  id: 'company-id',
                  vat: { owed: 0, paid: 0 },
                },
                getTransactions: {
                  __typename: 'Transactions',
                  id: 'company-id',
                  items: rows.slice(offset, offset + count),
                  nextToken:
                    offset + count < rows.length
                      ? String(offset + count)
                      : null,
                  status: TransactionStatus.Confirmed,
                },
              },
            });
            observer.complete();
          }
        }),
    );
    const { findByText, getAllByRole, queryByText } = render(
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
    await findByText(rows[99].description);
    await act(() => waitForApollo(30));
    act(() => removeFirst?.());
    await findByText(rows[100].description);
    expect(list).toHaveBeenLastCalledWith({
      count: 1,
      id: 'company-id',
      nextToken: '100',
      status: TransactionStatus.Confirmed,
    });
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(100);
    const previousCalls = list.mock.calls.length;

    act(() => disconnect?.());
    await waitFor(
      () => expect(list.mock.calls.length).toBeGreaterThan(previousCalls),
      { timeout: 2000 },
    );
    await act(() => waitForApollo(30));

    expect(list.mock.calls[previousCalls][0]).toEqual({
      count: 100,
      id: 'company-id',
      status: TransactionStatus.Confirmed,
    });
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(100);
    expect(queryByText(rows[0].description)).not.toBeInTheDocument();
    expect(queryByText(rows[101].description)).not.toBeInTheDocument();
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

  it('checks a stale older page loaded after connection acknowledgement without a transaction signal', async () => {
    const current = {
      __typename: 'Transaction',
      amount: 20,
      attachment: 'receipt.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Current first page transaction',
      id: 'current-transaction',
      name: 'Current customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const deleted = {
      ...current,
      date: '2026-09-01T12:00:00.000Z',
      description: 'Deleted historical transaction in stale index',
      id: 'deleted-transaction',
      name: 'Deleted customer',
    };
    const readState = vi.fn((id: string) =>
      id === current.id ? current : null,
    );
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetBalance') {
            const hasOlderPage = !operation.variables.nextToken;
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
                  items: hasOlderPage ? [current] : [deleted],
                  nextToken: hasOlderPage ? 'older-page' : null,
                  status: TransactionStatus.Confirmed,
                },
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: readState(
                  operation.variables.transactionId as string,
                ),
              },
            });
            observer.complete();
          }
        }),
    );
    const { findByText, getByRole, queryByRole, queryByText } = render(
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
    await findByText(current.description);
    await waitFor(() =>
      expect(readState).toHaveBeenCalledExactlyOnceWith(current.id),
    );
    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));

    await waitFor(() => expect(readState).toHaveBeenCalledWith(deleted.id));
    await waitFor(() =>
      expect(queryByText(deleted.description)).not.toBeInTheDocument(),
    );
    expect(queryByText(current.description)).toBeInTheDocument();
    expect(
      queryByRole('button', { name: 'accounts.load-more' }),
    ).not.toBeInTheDocument();
    expect(readState).toHaveBeenCalledTimes(2);
  });

  it.each([
    [
      'beyond the next page',
      '2026-09-01T12:00:00.000Z',
      ['Boundary customer', 'Next customer'],
    ],
    [
      'within the replenished page',
      '2026-09-03T18:00:00.000Z',
      ['Boundary customer', 'Moved customer'],
    ],
  ])(
    'replenishes a loaded transaction moved %s without expanding the visible page',
    async (_, date, expectedNames) => {
      let signal: (() => void) | undefined;
      const first = {
        __typename: 'Transaction',
        amount: 20,
        attachment: 'receipt.pdf',
        category: 'Sales',
        companyId: 'company-id',
        date: '2026-09-05T12:00:00.000Z',
        description: 'Originally newest transaction',
        id: 'moved-transaction',
        name: 'Moved customer',
        refund: false,
        scheduled: false,
        status: TransactionStatus.Confirmed,
        vat: 0,
      };
      const boundary = {
        ...first,
        date: '2026-09-04T12:00:00.000Z',
        description: 'Existing boundary transaction',
        id: 'boundary-transaction',
        name: 'Boundary customer',
      };
      const next = {
        ...first,
        date: '2026-09-03T12:00:00.000Z',
        description: 'Replenished boundary transaction',
        id: 'next-transaction',
        name: 'Next customer',
      };
      const moved = {
        ...first,
        date,
        description: 'Transaction with corrected date',
      };
      const list = vi.fn((_count: number, nextToken: string | undefined) => {
        if (nextToken === 'page-2')
          return { items: [next], nextToken: 'page-3' };
        if (nextToken === 'page-3') return { items: [moved], nextToken: null };
        return { items: [first, boundary], nextToken: 'page-2' };
      });
      const link = new ApolloLink(
        (operation) =>
          new Observable((observer) => {
            if (operation.operationName === 'OnTransactionChange') {
              signal = () =>
                observer.next({
                  data: {
                    onTransactionChange: {
                      id: 'company-id',
                      owner: 'user-id',
                      transactionId: first.id,
                    },
                  },
                });
            } else if (operation.operationName === 'GetTransactionState') {
              observer.next({ data: { getTransactionState: moved } });
              observer.complete();
            } else if (operation.operationName === 'GetBalance') {
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
                    ...list(
                      operation.variables.count as number,
                      operation.variables.nextToken as string | undefined,
                    ),
                    status: TransactionStatus.Confirmed,
                  },
                },
              });
              observer.complete();
            }
          }),
      );
      const { findByText, getAllByRole, getByRole, queryByRole, queryByText } =
        render(
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider
              link={link}
              cache={new InMemoryCache({ typePolicies })}
            >
              <TransactionStateProvider>
                <TransactionUpdates companyId="company-id" owner="user-id">
                  <Accounts />
                </TransactionUpdates>
              </TransactionStateProvider>
            </MockedProvider>
          </TestProvider>,
        );
      await findByText(first.description);
      act(() => signal?.());

      await waitFor(() => expect(list).toHaveBeenCalledWith(1, 'page-2'));
      await waitFor(() =>
        expect(
          getAllByRole('link', { name: 'transactions-list.view' }).map((item) =>
            item.getAttribute('data-testid'),
          ),
        ).toEqual(expectedNames.map((name) => `View ${name}`)),
      );
      expect(queryByText(first.description)).not.toBeInTheDocument();
      expect(list).toHaveBeenCalledTimes(2);

      fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
      await waitFor(() => expect(list).toHaveBeenCalledWith(100, 'page-3'));
      await findByText(moved.description);
      expect(
        getAllByRole('link', { name: 'transactions-list.view' }),
      ).toHaveLength(3);
      expect(queryByText(boundary.description)).toBeInTheDocument();
      expect(queryByText(next.description)).toBeInTheDocument();
      expect(
        queryByRole('button', { name: 'accounts.load-more' }),
      ).not.toBeInTheDocument();
      expect(list.mock.calls).toEqual([
        [100, undefined],
        [1, 'page-2'],
        [100, 'page-3'],
      ]);
    },
  );

  it('stops a failed automatic refill and keeps manual loading available', async () => {
    let signal: (() => void) | undefined;
    const row = {
      __typename: 'Transaction',
      amount: 20,
      attachment: '',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Moved outside the loaded window',
      id: 'moved-transaction',
      name: 'Moved customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const refill = vi.fn();
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signal = () =>
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId: row.id,
                  },
                },
              });
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: {
                  ...row,
                  date: '2026-09-01T12:00:00.000Z',
                },
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
            if (operation.variables.nextToken) {
              refill(operation.variables.count);
              observer.error(new Error('Temporary page failure'));
              return;
            }
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
                  items: [
                    row,
                    {
                      ...row,
                      date: '2026-09-04T12:00:00.000Z',
                      description: 'Boundary transaction',
                      id: 'boundary',
                      name: 'Boundary customer',
                    },
                  ],
                  nextToken: 'next-page',
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
    await findByText(row.description);
    act(() => signal?.());
    await waitFor(() => expect(refill).toHaveBeenCalledWith(1));
    const loadMore = getByRole('button', { name: 'accounts.load-more' });
    await waitFor(() => expect(loadMore).not.toBeDisabled());
    expect(refill).toHaveBeenCalledOnce();
    expect(queryByText(row.description)).not.toBeInTheDocument();

    fireEvent.click(loadMore);
    await waitFor(() => expect(refill).toHaveBeenCalledWith(100));
    await waitFor(() => expect(loadMore).not.toBeDisabled());
    expect(refill).toHaveBeenCalledTimes(2);
  });

  it('preserves the server page for equal dates despite out-of-order authoritative reads', async () => {
    let signal: (() => void) | undefined;
    const resolveReads = new Map<string, () => void>();
    const first = {
      __typename: 'Transaction',
      amount: 20,
      attachment: 'receipt.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T00:00:00.000Z',
      description: 'First server row',
      id: 'first-transaction',
      name: 'First customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const second = {
      ...first,
      description: 'Second server row',
      id: 'second-transaction',
      name: 'Second customer',
    };
    const offPage = {
      ...first,
      description: 'Equal-date row beyond the cursor',
      id: 'off-page-transaction',
      name: 'Off-page customer',
    };
    const transactions = new Map(
      [first, second, offPage].map((item) => [item.id, item]),
    );
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signal = () =>
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId: offPage.id,
                  },
                },
              });
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetTransactionState') {
            const id = operation.variables.transactionId as string;
            resolveReads.set(id, () => {
              observer.next({
                data: { getTransactionState: transactions.get(id) },
              });
              observer.complete();
            });
          } else if (operation.operationName === 'GetBalance') {
            const hasMore = !operation.variables.nextToken;
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
                  items: hasMore ? [first, second] : [offPage],
                  nextToken: hasMore ? 'next-page' : null,
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
    const visibleRows = () =>
      getAllByRole('link', { name: 'transactions-list.view' }).map((item) =>
        item.getAttribute('data-testid'),
      );
    await findByText(second.description);
    await waitFor(() =>
      expect(resolveReads.has(first.id) && resolveReads.has(second.id)).toBe(
        true,
      ),
    );
    act(() => signal?.());
    await waitFor(() => expect(resolveReads.has(offPage.id)).toBe(true));
    await act(async () => {
      resolveReads.get(offPage.id)?.();
      await waitForApollo(0);
    });
    expect(visibleRows()).toEqual([
      'View First customer',
      'View Second customer',
    ]);

    await act(async () => {
      resolveReads.get(second.id)?.();
      await waitForApollo(0);
    });
    expect(visibleRows()).toEqual([
      'View First customer',
      'View Second customer',
    ]);
    await act(async () => {
      resolveReads.get(first.id)?.();
      await waitForApollo(0);
    });
    expect(visibleRows()).toEqual([
      'View First customer',
      'View Second customer',
    ]);
    expect(queryByText(offPage.description)).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await findByText(offPage.description);
    expect(visibleRows()).toEqual([
      'View First customer',
      'View Second customer',
      'View Off-page customer',
    ]);
  });

  it('initializes the visible page from the fresh response rather than a shorter cached page', async () => {
    let resolveFresh: (() => void) | undefined;
    let signal: (() => void) | undefined;
    const first = {
      __typename: 'Transaction',
      amount: 20,
      attachment: 'receipt.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'First cached row',
      id: 'first-transaction',
      name: 'First customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const second = {
      ...first,
      date: '2026-09-04T12:00:00.000Z',
      description: 'Second cached row',
      id: 'second-transaction',
      name: 'Second customer',
    };
    const fresh = {
      ...first,
      date: '2026-09-06T12:00:00.000Z',
      description: 'New first-page row',
      id: 'fresh-transaction',
      name: 'Fresh customer',
    };
    const older = {
      ...first,
      date: '2026-09-03T12:00:00.000Z',
      description: 'Older next-page row',
      id: 'older-transaction',
      name: 'Older customer',
    };
    const transactions = new Map(
      [first, second, fresh, older].map((item) => [item.id, item]),
    );
    const response = (items: (typeof first)[], nextToken: string | null) => ({
      getBalance: {
        balance: 80,
        currency: 'GBP',
        id: 'company-id',
        vat: { owed: 0, paid: 0 },
      },
      getTransactions: {
        __typename: 'Transactions',
        id: 'company-id',
        items,
        nextToken,
        status: TransactionStatus.Confirmed,
      },
    });
    const savedCache = new InMemoryCache({ typePolicies });
    savedCache.writeQuery({
      data: response([first, second], 'cached-next-page'),
      query: GET_BALANCE,
      variables: {
        count: 100,
        id: 'company-id',
        status: TransactionStatus.Confirmed,
      },
    });
    const requests = vi.fn();
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signal = () =>
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId: first.id,
                  },
                },
              });
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: transactions.get(
                  operation.variables.transactionId as string,
                ),
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
            requests(operation.variables.count, operation.variables.nextToken);
            if (operation.variables.nextToken) {
              observer.next({ data: response([older], null) });
              observer.complete();
            } else {
              resolveFresh = () => {
                observer.next({
                  data: response([fresh, first, second], 'fresh-next-page'),
                });
                observer.complete();
              };
            }
          }
        }),
    );
    const { findByText, getAllByRole, getByRole } = render(
      <TestProvider path="/accounts/:companyId" history={history}>
        <MockedProvider link={link} cache={savedCache}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <Accounts />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await waitFor(() => expect(resolveFresh).toBeDefined());
    await act(async () => {
      signal?.();
      await waitForApollo(0);
    });
    await act(async () => {
      resolveFresh?.();
      await waitForApollo(0);
    });

    await findByText(fresh.description);
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }).map((item) =>
        item.getAttribute('data-testid'),
      ),
    ).toEqual([
      'View Fresh customer',
      'View First customer',
      'View Second customer',
    ]);
    expect(requests).toHaveBeenCalledExactlyOnceWith(100, undefined);
    fireEvent.click(getByRole('button', { name: 'accounts.load-more' }));
    await findByText(older.description);
    expect(
      getAllByRole('link', { name: 'transactions-list.view' }),
    ).toHaveLength(4);
    expect(requests.mock.calls).toEqual([
      [100, undefined],
      [100, 'fresh-next-page'],
    ]);
  });

  it('adopts a larger first-page window after reconnecting from a previously complete short list', async () => {
    let disconnect: (() => void) | undefined;
    let reconnected = false;
    const first = {
      __typename: 'Transaction',
      amount: 20,
      attachment: 'receipt.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'First existing row',
      id: 'first-transaction',
      name: 'First customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Confirmed,
      vat: 0,
    };
    const second = {
      ...first,
      date: '2026-09-04T12:00:00.000Z',
      description: 'Second existing row',
      id: 'second-transaction',
      name: 'Second customer',
    };
    const fresh = {
      ...first,
      date: '2026-09-06T12:00:00.000Z',
      description: 'New first-page row after reconnect',
      id: 'fresh-transaction',
      name: 'Fresh customer',
    };
    const transactions = new Map(
      [first, second, fresh].map((item) => [item.id, item]),
    );
    const list = vi.fn(() => ({
      items: reconnected ? [fresh, first, second] : [first, second],
      nextToken: reconnected ? 'next-page' : null,
    }));
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => {
              reconnected = true;
              observer.error(new Error('Connection lost'));
            };
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({
              data: {
                getTransactionState: transactions.get(
                  operation.variables.transactionId as string,
                ),
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetBalance') {
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
                  ...list(),
                  status: TransactionStatus.Confirmed,
                },
              },
            });
            observer.complete();
          }
        }),
    );
    const { findByText, getAllByRole, getByRole, queryByRole } = render(
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
    await findByText(second.description);
    expect(
      queryByRole('button', { name: 'accounts.load-more' }),
    ).not.toBeInTheDocument();
    const previousLists = list.mock.calls.length;
    act(() => disconnect?.());
    await waitFor(() => expect(list).toHaveBeenCalledTimes(previousLists + 1), {
      timeout: 2000,
    });
    await findByText(fresh.description);

    expect(
      getAllByRole('link', { name: 'transactions-list.view' }).map((item) =>
        item.getAttribute('data-testid'),
      ),
    ).toEqual([
      'View Fresh customer',
      'View First customer',
      'View Second customer',
    ]);
    expect(
      getByRole('button', { name: 'accounts.load-more' }),
    ).toBeInTheDocument();
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
