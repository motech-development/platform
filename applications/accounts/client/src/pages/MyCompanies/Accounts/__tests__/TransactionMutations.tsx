import { ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { typePolicies } from '../../../../components/ApolloClient';
import TransactionUpdates, {
  TransactionStateProvider,
} from '../../../../components/TransactionUpdates';
import { TransactionStatus } from '../../../../graphql/graphql';
import TestProvider from '../../../../utils/TestProvider';
import Accounts from '../Accounts';
import PendingTransactions from '../PendingTransactions';
import ViewTransaction from '../ViewTransaction';

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'pdfjs-dist/build/pdf.worker.min.mjs',
}));

function renderTransactions(
  status: TransactionStatus,
  details: boolean,
  deferReads = false,
) {
  const current = {
    __typename: 'Transaction',
    amount: -20,
    attachment: '',
    category: 'Equipment',
    companyId: 'company-id',
    date: '2026-09-05T12:00:00.000Z',
    description: 'Before local mutation',
    id: 'transaction-id',
    name: 'Supplier',
    refund: false,
    scheduled: false,
    status,
    vat: 0,
  };
  const stale = { ...current, description: 'Stale index description' };
  const saved = { ...current, description: 'Locally saved description' };
  const read = vi.fn(() => current);
  const detailQuery = vi.fn();
  const pendingReads: Array<(transaction: typeof current) => void> = [];
  const update = vi.fn(() => saved);
  const remove = vi.fn(() => ({
    companyId: current.companyId,
    id: current.id,
    status,
  }));
  let signal: (() => void) | undefined;
  const link = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        const respond = (data: Record<string, unknown>) => {
          observer.next({ data });
          observer.complete();
        };
        if (operation.operationName === 'OnTransactionChange') {
          signal = () =>
            observer.next({
              data: {
                onTransactionChange: {
                  id: 'company-id',
                  owner: 'user-id',
                  transactionId: current.id,
                },
              },
            });
        } else if (operation.operationName === 'GetTransactionState') {
          const transaction = read();
          if (deferReads) {
            pendingReads.push((result) =>
              respond({ getTransactionState: result }),
            );
          } else {
            respond({ getTransactionState: transaction });
          }
        } else if (operation.operationName === 'UpdateTransaction') {
          respond({ updateTransaction: update() });
        } else if (operation.operationName === 'DeleteTransaction') {
          respond({ deleteTransaction: remove() });
        } else if (operation.operationName === 'ViewTransaction') {
          detailQuery();
          respond({
            getClients: { id: 'company-id', items: [] },
            getSettings: {
              categories: [{ name: 'Equipment', vatRate: 20 }],
              id: 'company-id',
              vat: { pay: 20 },
            },
            getTransaction: stale,
            getTypeahead: {
              id: 'company-id',
              purchases: [],
              sales: [],
              suppliers: [],
            },
          });
        } else if (
          operation.operationName === 'GetBalance' ||
          operation.operationName === 'GetTransactions'
        ) {
          respond({
            getBalance: {
              balance: -20,
              currency: 'GBP',
              id: 'company-id',
              vat: { owed: 0, paid: 0 },
            },
            getTransactions: {
              __typename: 'Transactions',
              id: 'company-id',
              items: [stale],
              nextToken: null,
              status,
            },
          });
        }
      }),
  );
  const accountPath = '/my-companies/accounts/company-id';
  const listPath =
    status === TransactionStatus.Pending
      ? `${accountPath}/pending-transactions`
      : accountPath;
  render(
    <TestProvider
      path="*"
      history={[
        details ? `${accountPath}/view-transaction/transaction-id` : listPath,
      ]}
    >
      <MockedProvider link={link} cache={new InMemoryCache({ typePolicies })}>
        <TransactionStateProvider>
          <TransactionUpdates companyId="company-id" owner="user-id">
            <Routes>
              <Route
                path="/my-companies/accounts/:companyId"
                element={<Accounts />}
              />
              <Route
                path="/my-companies/accounts/:companyId/pending-transactions"
                element={<PendingTransactions />}
              />
              <Route
                path="/my-companies/accounts/:companyId/view-transaction/:transactionId"
                element={<ViewTransaction />}
              />
            </Routes>
          </TransactionUpdates>
        </TransactionStateProvider>
      </MockedProvider>
    </TestProvider>,
  );
  return {
    current,
    detailQuery,
    read,
    remove,
    resolveRead: (index: number, transaction: typeof current) =>
      pendingReads[index]?.(transaction),
    saved,
    signal: () => signal?.(),
    update,
  };
}

describe('opening transaction details', () => {
  it('waits for the authoritative record before editing and keeps later live reads from resetting dirty fields', async () => {
    const network = renderTransactions(TransactionStatus.Pending, true, true);
    await waitFor(() => expect(network.detailQuery).toHaveBeenCalledOnce());
    await waitFor(() => expect(network.read).toHaveBeenCalledOnce());

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'transaction-form.save' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'view-transaction.delete-transaction',
      }),
    ).not.toBeInTheDocument();

    const latest = { ...network.current, status: TransactionStatus.Confirmed };
    act(() => network.resolveRead(0, latest));
    const description = await screen.findByLabelText(
      'transaction-form.transaction-details.description.label',
    );
    expect(description).toHaveValue(latest.description);
    expect(
      screen.getByLabelText(
        'transaction-form.transaction-amount.status.options.confirmed',
      ),
    ).toBeChecked();

    fireEvent.change(description, { target: { value: 'Unsaved local edit' } });
    act(() => network.signal());
    await waitFor(() => expect(network.read).toHaveBeenCalledTimes(2));
    expect(description).toBeInTheDocument();
    expect(description).toHaveValue('Unsaved local edit');
    act(() =>
      network.resolveRead(1, {
        ...latest,
        description: 'Later server edit',
        name: 'Updated supplier',
      }),
    );
    await screen.findByDisplayValue('Updated supplier');
    expect(description).toHaveValue('Unsaved local edit');
  });

  it('waits for a new detail read even when an older authoritative correction is retained', async () => {
    const network = renderTransactions(TransactionStatus.Pending, false, true);
    await screen.findByText('pending-transactions.title');
    act(() => network.signal());
    await waitFor(() => expect(network.read).toHaveBeenCalledOnce());
    act(() => network.resolveRead(0, network.current));
    await screen.findByText(network.current.description);
    fireEvent.click(screen.getByTestId(`View ${network.current.name}`));
    await waitFor(() => expect(network.detailQuery).toHaveBeenCalledOnce());
    await waitFor(() => expect(network.read).toHaveBeenCalledTimes(2));

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'transaction-form.save' }),
    ).not.toBeInTheDocument();

    act(() =>
      network.resolveRead(1, {
        ...network.current,
        description: 'Current on opening',
      }),
    );
    expect(
      await screen.findByLabelText(
        'transaction-form.transaction-details.description.label',
      ),
    ).toHaveValue('Current on opening');
  });
});

describe('local mutations with existing transaction corrections', () => {
  it('shows a successful detail edit on returning to the list without another signal', async () => {
    const network = renderTransactions(TransactionStatus.Pending, true);
    const description = await screen.findByLabelText(
      'transaction-form.transaction-details.description.label',
    );
    act(() => network.signal());
    await waitFor(() =>
      expect(description).toHaveValue(network.current.description),
    );
    fireEvent.change(description, {
      target: { value: network.saved.description },
    });
    const save = screen.getByRole('button', { name: 'transaction-form.save' });
    await waitFor(() => expect(save).not.toBeDisabled());
    const readsBeforeMutation = network.read.mock.calls.length;
    fireEvent.click(save);

    await screen.findByText('pending-transactions.title');
    expect(
      await screen.findByText(network.saved.description),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(network.current.description),
    ).not.toBeInTheDocument();
    expect(network.update).toHaveBeenCalledOnce();
    expect(network.read).toHaveBeenCalledTimes(readsBeforeMutation);
  });

  it.each([
    [TransactionStatus.Pending, false, 'pending-transactions.title'],
    [TransactionStatus.Confirmed, false, 'accounts.title'],
    [TransactionStatus.Pending, true, 'view-transaction.title'],
  ])(
    'removes a locally deleted %s transaction (detail page: %s) without another signal',
    async (status, details, title) => {
      const network = renderTransactions(status, details);
      await screen.findByText(title);
      act(() => network.signal());
      if (details) {
        await screen.findByDisplayValue(network.current.description);
        fireEvent.click(
          screen.getByText('view-transaction.delete-transaction'),
        );
      } else {
        await screen.findByText(network.current.description);
        fireEvent.click(screen.getByTestId(`Delete ${network.current.name}`));
      }
      const dialog = await screen.findByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText('confirm-delete'), {
        target: { value: network.current.name },
      });
      const confirm = within(dialog).getByRole('button', { name: 'delete' });
      await waitFor(() => expect(confirm).not.toBeDisabled());
      const readsBeforeMutation = network.read.mock.calls.length;
      fireEvent.click(confirm);

      await waitFor(() => expect(network.remove).toHaveBeenCalledOnce());
      if (details) await screen.findByText('pending-transactions.title');
      await waitFor(() =>
        expect(
          screen.queryByText(network.current.description),
        ).not.toBeInTheDocument(),
      );
      expect(
        screen.queryByTestId(`View ${network.current.name}`),
      ).not.toBeInTheDocument();
      expect(network.read).toHaveBeenCalledTimes(readsBeforeMutation);
    },
  );
});

describe('deletion before the initial detail query completes', () => {
  it.each([
    [
      TransactionStatus.Pending,
      '/my-companies/accounts/company-id/pending-transactions',
    ],
    [TransactionStatus.Confirmed, '/my-companies/accounts/company-id'],
    [null, '/my-companies/accounts/company-id'],
  ])(
    'returns a transaction with last known status %s to %s',
    async (status, destination) => {
      let resolveDetails: (() => void) | undefined;
      const readState = vi.fn();
      const link = new ApolloLink(
        (operation) =>
          new Observable((observer) => {
            if (operation.operationName === 'GetTransactionState') {
              readState();
              observer.next({ data: { getTransactionState: null } });
              observer.complete();
            } else if (operation.operationName === 'ViewTransaction') {
              resolveDetails = () => {
                observer.next({
                  data: {
                    getClients: { id: 'company-id', items: [] },
                    getSettings: {
                      categories: [],
                      id: 'company-id',
                      vat: { pay: 20 },
                    },
                    getTransaction: status
                      ? {
                          __typename: 'Transaction',
                          amount: -20,
                          attachment: '',
                          category: 'Equipment',
                          companyId: 'company-id',
                          date: '2026-09-05T12:00:00.000Z',
                          description: 'Already deleted transaction',
                          id: 'transaction-id',
                          name: 'Supplier',
                          refund: false,
                          scheduled: false,
                          status,
                          vat: 0,
                        }
                      : null,
                    getTypeahead: {
                      id: 'company-id',
                      purchases: [],
                      sales: [],
                      suppliers: [],
                    },
                  },
                });
                observer.complete();
              };
            }
          }),
      );

      render(
        <TestProvider
          path="/accounts/:companyId/view-transaction/:transactionId"
          history={['/accounts/company-id/view-transaction/transaction-id']}
        >
          <MockedProvider
            link={link}
            cache={new InMemoryCache({ typePolicies })}
          >
            <TransactionStateProvider>
              <TransactionUpdates companyId="company-id" owner="user-id">
                <ViewTransaction />
              </TransactionUpdates>
            </TransactionStateProvider>
          </MockedProvider>
        </TestProvider>,
      );

      await waitFor(() => expect(readState).toHaveBeenCalledOnce());
      expect(
        screen.queryByTestId('/my-companies/accounts/company-id'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('view-transaction.title'),
      ).not.toBeInTheDocument();

      act(() => resolveDetails?.());

      expect(await screen.findByTestId(destination)).toBeInTheDocument();
      expect(
        screen.queryByText('Already deleted transaction'),
      ).not.toBeInTheDocument();
    },
  );
});
