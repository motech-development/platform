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
import userEvent from '@testing-library/user-event';
import { typePolicies } from '../../../../components/ApolloClient';
import TransactionUpdates, {
  TransactionStateProvider,
} from '../../../../components/TransactionUpdates';
import { TransactionStatus } from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import PendingTransactions, {
  DELETE_TRANSACTION,
  GET_TRANSACTIONS,
} from '../PendingTransactions';

describe('PendingTransactions', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/accounts/company-id/pending-transactions'];
  });

  it.each([
    ['2026-09-07T12:00:00.000Z', false],
    ['2026-09-06T12:00:00.000Z', false],
    ['2026-09-04T12:00:00.000Z', true],
  ] as const)(
    'preserves a partial server page when a signalled row has date %s',
    async (date, visible) => {
      let signal: (() => void) | undefined;
      const first = {
        __typename: 'Transaction',
        amount: 20,
        attachment: '',
        category: 'Sales',
        companyId: 'company-id',
        date: '2026-09-05T12:00:00.000Z',
        description: 'First pending transaction',
        id: 'first',
        name: 'First customer',
        refund: false,
        scheduled: false,
        status: TransactionStatus.Pending,
        vat: 0,
      };
      const last = {
        ...first,
        date: '2026-09-06T12:00:00.000Z',
        description: 'Last loaded transaction',
        id: 'last',
        name: 'Last customer',
      };
      const changed = {
        ...first,
        date,
        description: 'Signalled transaction',
        id: 'off-page',
        name: 'Signalled customer',
      };
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
                      transactionId: changed.id,
                    },
                  },
                });
            } else if (operation.operationName === 'GetTransactions') {
              observer.next({
                data: {
                  getBalance: { currency: 'GBP', id: 'company-id' },
                  getTransactions: {
                    __typename: 'Transactions',
                    id: 'company-id',
                    items: [first, last],
                    nextToken: 'next-page',
                    status: TransactionStatus.Pending,
                  },
                },
              });
              observer.complete();
            } else if (operation.operationName === 'GetTransactionState') {
              observer.next({ data: { getTransactionState: changed } });
              observer.complete();
            }
          }),
      );
      const { findByText, queryByText, getAllByRole } = render(
        <TestProvider
          path="/accounts/:companyId/pending-transactions"
          history={history}
        >
          <MockedProvider
            link={link}
            cache={new InMemoryCache({ typePolicies })}
          >
            <TransactionStateProvider>
              <TransactionUpdates companyId="company-id" owner="user-id">
                <PendingTransactions />
              </TransactionUpdates>
            </TransactionStateProvider>
          </MockedProvider>
        </TestProvider>,
      );
      await findByText(last.description);
      await act(async () => {
        signal?.();
        await waitForApollo(10);
      });
      expect(Boolean(queryByText(changed.description))).toBe(visible);
      expect(Boolean(queryByText(last.description))).toBe(!visible);
      expect(
        getAllByRole('link', {
          name: 'pending-transactions.transactions.view',
        }),
      ).toHaveLength(2);
    },
  );

  it.each(['published', 'deleted'])(
    'dismisses the selected deletion confirmation when its transaction is %s remotely',
    async (change) => {
      let signal: ((transactionId: string) => void) | undefined;
      const selected = {
        __typename: 'Transaction',
        amount: 20,
        attachment: 'receipt.pdf',
        category: 'Sales',
        companyId: 'company-id',
        date: '2026-09-05T12:00:00.000Z',
        description: 'Selected pending transaction',
        id: 'selected-transaction',
        name: 'Selected customer',
        refund: false,
        scheduled: false,
        status: TransactionStatus.Pending,
        vat: 0,
      };
      const other = {
        ...selected,
        description: 'Other pending transaction',
        id: 'other-transaction',
        name: 'Other customer',
      };
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
            } else if (operation.operationName === 'GetTransactions') {
              observer.next({
                data: {
                  getBalance: { currency: 'GBP', id: 'company-id' },
                  getTransactions: {
                    __typename: 'Transactions',
                    id: 'company-id',
                    items: [selected, other],
                    status: TransactionStatus.Pending,
                  },
                },
              });
              observer.complete();
            } else if (operation.operationName === 'GetTransactionState') {
              const selectedState =
                change === 'deleted'
                  ? null
                  : { ...selected, status: TransactionStatus.Confirmed };
              observer.next({
                data: {
                  getTransactionState:
                    operation.variables.transactionId === selected.id
                      ? selectedState
                      : { ...other, description: 'Updated unrelated row' },
                },
              });
              observer.complete();
            }
          }),
      );
      const user = userEvent.setup();
      const {
        findByText,
        getByLabelText,
        getByRole,
        getByTestId,
        queryByRole,
        queryByText,
      } = render(
        <TestProvider
          path="/accounts/:companyId/pending-transactions"
          history={history}
        >
          <MockedProvider
            link={link}
            cache={new InMemoryCache({ typePolicies })}
          >
            <TransactionStateProvider>
              <TransactionUpdates companyId="company-id" owner="user-id">
                <PendingTransactions />
              </TransactionUpdates>
            </TransactionStateProvider>
          </MockedProvider>
        </TestProvider>,
      );
      await findByText(selected.description);
      await user.click(getByTestId('Delete Selected customer'));
      await user.type(getByLabelText('confirm-delete'), 'Selected');

      act(() => signal?.(other.id));
      await findByText('Updated unrelated row');
      expect(getByLabelText('confirm-delete')).toHaveValue('Selected');
      await user.type(getByLabelText('confirm-delete'), ' customer');
      expect(getByRole('button', { name: 'delete' })).not.toBeDisabled();

      act(() => signal?.(selected.id));
      await waitFor(() => {
        expect(queryByText(selected.description)).not.toBeInTheDocument();
        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
    },
  );

  it('shows a signalled transaction when the later index response is empty', async () => {
    let signal: (() => void) | undefined;
    let resolveTransaction: (() => void) | undefined;
    let resolveList: (() => void) | undefined;
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signal = () => {
              observer.next({
                data: {
                  onTransactionChange: {
                    id: 'company-id',
                    owner: 'user-id',
                    transactionId: 'new-transaction',
                  },
                },
              });
            };
          } else if (operation.operationName === 'GetTransactionState') {
            resolveTransaction = () => {
              observer.next({
                data: {
                  getTransactionState: {
                    amount: -20,
                    attachment: '',
                    category: 'Meals',
                    companyId: 'company-id',
                    date: '2026-09-05T12:00:00.000Z',
                    description: 'Lunch received live',
                    id: 'new-transaction',
                    name: 'New supplier',
                    refund: false,
                    scheduled: false,
                    status: TransactionStatus.Pending,
                    vat: 0,
                  },
                },
              });
              observer.complete();
            };
          } else if (operation.operationName === 'GetTransactions') {
            resolveList = () => {
              observer.next({
                data: {
                  getBalance: { currency: 'GBP', id: 'company-id' },
                  getTransactions: {
                    id: 'company-id',
                    items: [],
                    status: TransactionStatus.Pending,
                  },
                },
              });
              observer.complete();
            };
          }
        }),
    );

    const { findByText, getByTestId } = render(
      <TestProvider
        path="/accounts/:companyId/pending-transactions"
        history={history}
      >
        <MockedProvider link={link}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <PendingTransactions />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );

    await waitFor(() => expect(signal).toBeDefined());
    act(() => signal?.());
    await waitFor(() => expect(resolveTransaction).toBeDefined());
    await act(async () => {
      resolveTransaction?.();
      await waitForApollo(0);
    });
    await waitFor(() => expect(resolveList).toBeDefined());
    await act(async () => {
      resolveList?.();
      await waitForApollo(0);
    });

    expect(await findByText('Lunch received live')).toBeInTheDocument();
    expect(getByTestId('View New supplier')).toHaveAttribute(
      'href',
      '/my-companies/accounts/company-id/view-transaction/new-transaction',
    );
  });

  it('removes a cached row when reconnect refreshes a missed deletion', async () => {
    let disconnect: (() => void) | undefined;
    const pending = {
      __typename: 'Transaction',
      amount: -20,
      attachment: '',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Deleted while disconnected',
      id: 'missed-transaction',
      name: 'Old supplier',
      scheduled: false,
    };
    let connected = true;
    const list = vi.fn(() => (connected ? [pending] : []));
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => {
              connected = false;
              observer.error(new Error('Connection lost'));
            };
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetTransactions') {
            observer.next({
              data: {
                getBalance: { currency: 'GBP', id: 'company-id' },
                getTransactions: {
                  __typename: 'Transactions',
                  id: 'company-id',
                  items: list(),
                  status: TransactionStatus.Pending,
                },
              },
            });
            observer.complete();
          }
        }),
    );

    const { findByText, queryByText } = render(
      <TestProvider
        path="/accounts/:companyId/pending-transactions"
        history={history}
      >
        <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <PendingTransactions />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await findByText(pending.description);
    const previousCalls = list.mock.calls.length;
    act(() => disconnect?.());
    await waitFor(() => expect(list).toHaveBeenCalledTimes(previousCalls + 1), {
      timeout: 2000,
    });
    await waitFor(() =>
      expect(queryByText(pending.description)).not.toBeInTheDocument(),
    );
  });

  it('removes a published row after reconnect even while the index still reports pending', async () => {
    let disconnect: (() => void) | undefined;
    const pending = {
      __typename: 'Transaction',
      amount: 20,
      attachment: 'receipt.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-09-05T12:00:00.000Z',
      description: 'Published during the subscription gap',
      id: 'published-transaction',
      name: 'Published customer',
      refund: false,
      scheduled: false,
      status: TransactionStatus.Pending,
      vat: 0,
    };
    let published = false;
    const list = vi.fn(() => [pending]);
    const readState = vi.fn(() => ({
      ...pending,
      status: published
        ? TransactionStatus.Confirmed
        : TransactionStatus.Pending,
    }));
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => {
              published = true;
              observer.error(new Error('Connection lost'));
            };
            observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
          } else if (operation.operationName === 'GetTransactions') {
            observer.next({
              data: {
                getBalance: { currency: 'GBP', id: 'company-id' },
                getTransactions: {
                  __typename: 'Transactions',
                  id: 'company-id',
                  items: list(),
                  status: TransactionStatus.Pending,
                },
              },
            });
            observer.complete();
          } else if (operation.operationName === 'GetTransactionState') {
            observer.next({ data: { getTransactionState: readState() } });
            observer.complete();
          }
        }),
    );
    const { findByText, queryByText } = render(
      <TestProvider
        path="/accounts/:companyId/pending-transactions"
        history={history}
      >
        <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
          <TransactionStateProvider>
            <TransactionUpdates companyId="company-id" owner="user-id">
              <PendingTransactions />
            </TransactionUpdates>
          </TransactionStateProvider>
        </MockedProvider>
      </TestProvider>,
    );
    await findByText(pending.description);
    await waitFor(() => expect(readState).toHaveBeenCalledOnce());
    const previousLists = list.mock.calls.length;

    act(() => disconnect?.());
    await waitFor(() => expect(list).toHaveBeenCalledTimes(previousLists + 1), {
      timeout: 2000,
    });
    await findByText('no-transactions.title');
    expect(readState).toHaveBeenCalledTimes(2);
    expect(queryByText(pending.description)).not.toBeInTheDocument();
  });

  describe('success', () => {
    beforeEach(async () => {
      cache = new InMemoryCache({
        typePolicies,
      });

      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
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
                status: 'pending',
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
            <MockedProvider cache={cache} mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);
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

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await findByRole('dialog');

      const [, , cancelButton] = await findAllByRole('button');

      fireEvent.click(cancelButton);

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('pending-transactions.title');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, {
        target: {
          value: 'KFC',
        },
      });

      const [, , , deleteButton] = await findAllByRole('button');

      await waitFor(() => expect(deleteButton).not.toBeDisabled());

      fireEvent.click(deleteButton);

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'delete-transaction.success',
        }),
      );
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
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
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
                status: 'pending',
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
            <MockedProvider cache={cache} mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('pending-transactions.title');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, {
        target: {
          value: 'KFC',
        },
      });

      const [, , , deleteButton] = await findAllByRole('button');

      await waitFor(() => expect(deleteButton).not.toBeDisabled());

      fireEvent.click(deleteButton);

      await act(async () => {
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

  describe('no data', () => {
    beforeEach(async () => {
      cache = new InMemoryCache({
        typePolicies,
      });

      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
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
                status: 'pending',
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
            <MockedProvider cache={cache} mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
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
