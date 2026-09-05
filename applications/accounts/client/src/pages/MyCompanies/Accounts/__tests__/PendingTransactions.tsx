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
    const list = vi
      .fn<() => (typeof pending)[]>()
      .mockReturnValueOnce([pending])
      .mockReturnValue([]);
    const link = new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            disconnect = () => observer.error(new Error('Connection lost'));
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
    act(() => disconnect?.());
    await waitFor(() => expect(list).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });
    await waitFor(() =>
      expect(queryByText(pending.description)).not.toBeInTheDocument(),
    );
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
          focus: () => {},
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
          focus: () => {},
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
