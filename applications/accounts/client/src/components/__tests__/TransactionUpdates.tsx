import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FetchResult,
  InMemoryCache,
  Observable,
  useQuery,
} from '@apollo/client';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionStatus } from '../../graphql/graphql';
import { GET_TRANSACTIONS as LIST } from '../../pages/MyCompanies/Accounts/PendingTransactions';
import { typePolicies } from '../ApolloClient';
import TransactionUpdates, {
  TransactionStateProvider,
  useTransactionItems,
} from '../TransactionUpdates';

const transaction = (changes = {}) => ({
  __typename: 'Transaction' as const,
  amount: 12,
  attachment: 'receipt.pdf',
  category: 'Sales',
  companyId: 'company',
  date: '2026-09-05',
  description: 'Invoice',
  id: 'transaction',
  name: 'New transaction',
  refund: false,
  scheduled: true,
  status: TransactionStatus.Pending,
  vat: 2,
  ...changes,
});
type Observer = {
  complete: () => void;
  error: (error: Error) => void;
  next: (result: FetchResult) => void;
};
const deliver = async (action: () => void) => {
  await act(async () => {
    action();
    await Promise.resolve();
  });
};

function setupNetwork() {
  const signals: Observer[] = [];
  const reads: Array<{ observer: Observer; transactionId: string }> = [];
  const lists: Observer[] = [];
  const unsubscribe = vi.fn();
  const client = new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          if (operation.operationName === 'OnTransactionChange') {
            signals.push(observer as Observer);
            return unsubscribe;
          }
          if (operation.operationName === 'GetTransactionState') {
            reads.push({
              observer: observer as Observer,
              transactionId: operation.variables.transactionId as string,
            });
          } else lists.push(observer as Observer);
          return undefined;
        }),
    ),
  });
  const signal = (
    transactionId = 'transaction',
    companyId = 'company',
    owner = 'owner',
  ) => {
    act(() =>
      signals.at(-1)?.next({
        data: {
          onTransactionChange: { id: companyId, owner, transactionId },
        },
      }),
    );
  };
  const resolveRead = async (
    index: number,
    current: ReturnType<typeof transaction> | null,
  ) => {
    await deliver(() => {
      reads[index].observer.next({ data: { getTransactionState: current } });
      reads[index].observer.complete();
    });
  };
  const resolveList = async (items: ReturnType<typeof transaction>[]) => {
    await deliver(() => {
      lists.at(-1)?.next({
        data: {
          getBalance: { currency: 'GBP', id: 'company' },
          getTransactions: {
            __typename: 'Transactions',
            id: 'company',
            items,
            status: TransactionStatus.Pending,
          },
        },
      });
      lists.at(-1)?.complete();
    });
  };
  const refetchList = async () => {
    await deliver(() => {
      client.refetchQueries({ include: [LIST] }).catch(() => {});
    });
  };
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ApolloProvider client={client}>
        <TransactionStateProvider>{children}</TransactionStateProvider>
      </ApolloProvider>
    );
  }
  return {
    Wrapper,
    reads,
    refetchList,
    resolveList,
    resolveRead,
    signal,
    signals,
    unsubscribe,
  };
}
function Lists() {
  const { data } = useQuery<{
    getTransactions: { items: ReturnType<typeof transaction>[] };
  }>(LIST, { variables: { id: 'company', status: TransactionStatus.Pending } });
  const pending = useTransactionItems(
    data?.getTransactions.items,
    TransactionStatus.Pending,
  );
  const confirmed = useTransactionItems([], TransactionStatus.Confirmed);
  return (
    <>
      <div data-testid="pending">
        {pending.map((item) => (
          <p key={item.id}>
            {item.name}|{item.attachment}
          </p>
        ))}
      </div>
      <div data-testid="confirmed">
        {confirmed.map((item) => (
          <p key={item.id}>
            {item.name}|{item.attachment}
          </p>
        ))}
      </div>
    </>
  );
}
function Account({ companyId = 'company' }: { companyId?: string }) {
  return (
    <TransactionUpdates key={companyId} companyId={companyId} owner="owner">
      <Lists />
    </TransactionUpdates>
  );
}
afterEach(() => vi.useRealTimers());
describe('TransactionUpdates', () => {
  it('keeps new rows and attachment corrections when stale index responses arrive', async () => {
    const network = setupNetwork();
    render(<Account />, { wrapper: network.Wrapper });
    network.signal();
    await network.resolveRead(0, transaction());
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'New transaction|receipt.pdf',
    );
    await network.resolveList([]);
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'New transaction|receipt.pdf',
    );
    network.signal();
    await network.resolveRead(
      1,
      transaction({ attachment: null, name: 'Updated' }),
    );
    await network.refetchList();
    await network.resolveList([transaction({ name: 'Stale' })]);
    expect(screen.getByTestId('pending')).toHaveTextContent('Updated|');
    expect(screen.getByTestId('pending')).not.toHaveTextContent('receipt.pdf');
    expect(screen.queryByText(/Stale/)).not.toBeInTheDocument();
  });
  it('moves status membership and prevents deleted rows returning from a stale list', async () => {
    const network = setupNetwork();
    render(<Account />, { wrapper: network.Wrapper });
    await network.resolveList([transaction()]);
    network.signal();
    await network.resolveRead(
      0,
      transaction({ status: TransactionStatus.Confirmed }),
    );
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
    expect(screen.getByTestId('confirmed')).toHaveTextContent(
      'New transaction',
    );
    network.signal();
    await network.resolveRead(
      1,
      transaction({
        name: 'Confirmed edit',
        status: TransactionStatus.Confirmed,
      }),
    );
    expect(screen.getByTestId('confirmed')).toHaveTextContent('Confirmed edit');
    network.signal();
    await network.resolveRead(2, transaction());
    expect(screen.getByTestId('confirmed')).toBeEmptyDOMElement();
    expect(screen.getByTestId('pending')).toHaveTextContent('New transaction');
    network.signal();
    await network.resolveRead(3, null);
    await network.refetchList();
    await network.resolveList([transaction()]);
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
  });
  it('coalesces duplicate signals and discards reads superseded while in flight', async () => {
    const network = setupNetwork();
    render(<Account />, { wrapper: network.Wrapper });
    await network.resolveList([]);
    network.signal();
    network.signal();
    network.signal();
    network.signal('another');
    expect(network.reads.map(({ transactionId }) => transactionId)).toEqual([
      'transaction',
      'another',
    ]);
    await network.resolveRead(0, transaction({ name: 'Superseded' }));
    expect(screen.queryByText(/Superseded/)).not.toBeInTheDocument();
    expect(network.reads).toHaveLength(3);
    await network.resolveRead(2, transaction());
    await network.resolveRead(
      1,
      transaction({ id: 'another', name: 'Independent' }),
    );
    expect(screen.getAllByText(/New transaction/)).toHaveLength(1);
    expect(screen.getByTestId('pending')).toHaveTextContent('Independent');
  });
  it('retains tombstones across navigation and refreshes known records on return', async () => {
    const network = setupNetwork();
    const view = render(<Account />, { wrapper: network.Wrapper });
    await network.resolveList([transaction()]);
    network.signal();
    await network.resolveRead(0, null);
    view.rerender(<div>Dashboard</div>);
    view.rerender(<Account />);
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
    expect(network.reads).toHaveLength(2);
    await network.resolveRead(1, transaction({ name: 'Restored while away' }));
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'Restored while away',
    );
  });
  it('ignores other scopes and cancels obsolete reads on account change', async () => {
    const network = setupNetwork();
    const view = render(<Account />, { wrapper: network.Wrapper });
    await network.resolveList([]);
    network.signal('transaction', 'other-company');
    network.signal('transaction', 'company', 'other-owner');
    expect(network.reads).toHaveLength(0);
    network.signal();
    view.rerender(<Account companyId="other-company" />);
    await network.resolveRead(0, transaction());
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
    await waitFor(() => expect(network.unsubscribe).toHaveBeenCalled());
  });
  it('retries failed reads and stops retrying after unmount', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    const view = render(<Account />, { wrapper: network.Wrapper });
    network.signal();
    await deliver(() =>
      network.reads[0].observer.error(new Error('Temporary failure')),
    );
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.reads).toHaveLength(2);
    await network.resolveRead(1, transaction());
    expect(screen.getByTestId('pending')).toHaveTextContent('New transaction');
    network.signal();
    await deliver(() =>
      network.reads[2].observer.error(new Error('Temporary failure')),
    );
    view.unmount();
    await act(() => vi.advanceTimersByTimeAsync(30000));
    expect(network.reads).toHaveLength(3);
  });
  it('resubscribes after disconnection and receives subsequent changes', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    const view = render(<Account />, { wrapper: network.Wrapper });
    await deliver(() => network.signals[0].error(new Error('Connection lost')));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(2);
    network.signal();
    await network.resolveRead(0, transaction());
    expect(screen.getByTestId('pending')).toHaveTextContent('New transaction');
    await deliver(() => network.signals[1].complete());
    view.unmount();
    await act(() => vi.advanceTimersByTimeAsync(30000));
    expect(network.signals).toHaveLength(2);
  });
});
