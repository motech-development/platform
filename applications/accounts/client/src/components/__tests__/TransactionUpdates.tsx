import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  ApolloProvider,
  FetchResult,
  InMemoryCache,
  Observable,
  useQuery,
} from '@apollo/client';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { GraphQLError } from 'graphql';
import { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionStatus } from '../../graphql/graphql';
import { GET_TRANSACTIONS as LIST } from '../../pages/MyCompanies/Accounts/PendingTransactions';
import { typePolicies } from '../ApolloClient';
import TransactionUpdates, {
  TransactionStateProvider,
  useApplyTransactionState,
  useTransactionItems,
  useTransactionReadError,
  useTransactionRecovery,
  useTransactionState,
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

function setupNetwork(acknowledgeOnSubscribe = false) {
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
            if (acknowledgeOnSubscribe)
              observer.next({ extensions: { controlMsgType: 'CONNECTED' } });
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
  const acknowledge = () =>
    deliver(() =>
      signals.at(-1)?.next({ extensions: { controlMsgType: 'CONNECTED' } }),
    );
  return {
    Wrapper,
    acknowledge,
    reads,
    refetchList,
    resolveList,
    resolveRead,
    signal,
    signals,
    unsubscribe,
  };
}
function Lists({ paginated = false }: { paginated?: boolean }) {
  const { data } = useQuery<{
    getTransactions: { items: ReturnType<typeof transaction>[] };
  }>(LIST, { variables: { id: 'company', status: TransactionStatus.Pending } });
  const pending = useTransactionItems(
    data?.getTransactions.items,
    TransactionStatus.Pending,
    paginated,
  );
  const confirmed = useTransactionItems([], TransactionStatus.Confirmed);
  const error = useTransactionReadError(
    data?.getTransactions.items.map(({ id }) => id) ?? [],
  );
  return (
    <>
      <div data-testid="read-error">{error?.message}</div>
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
function LocalChanges() {
  const apply = useApplyTransactionState();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          apply('transaction', transaction({ name: 'Local update' }))
        }
      >
        Save locally
      </button>
      <button type="button" onClick={() => apply('transaction', null)}>
        Delete locally
      </button>
    </>
  );
}

function Details() {
  const current = useTransactionState('transaction');
  return <p>{current?.description ?? 'Original detail'}</p>;
}

function Recovery({ onRecover }: { onRecover: () => void }) {
  useTransactionRecovery(onRecover);
  return null;
}

function ReadableDetails() {
  const current = useTransactionState('transaction');
  const error = useTransactionReadError('transaction');
  if (error) return <p role="alert">{error.message}</p>;
  return (
    <p>
      {current === undefined
        ? 'Loading current transaction'
        : current?.description ?? 'Deleted transaction'}
    </p>
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
  it.each(['before', 'after'])(
    'does not carry a detail-only failure to an unrelated list when it fails %s navigation',
    async (timing) => {
      const network = setupNetwork();
      const view = render(
        <TransactionUpdates companyId="company" owner="owner">
          <ReadableDetails />
        </TransactionUpdates>,
        { wrapper: network.Wrapper },
      );
      const fail = () =>
        deliver(() =>
          network.reads[0].observer.error(
            Object.assign(new Error('Invalid detail'), { statusCode: 403 }),
          ),
        );
      if (timing === 'before') await fail();
      view.rerender(
        <TransactionUpdates companyId="company" owner="owner">
          <Lists />
        </TransactionUpdates>,
      );
      await network.resolveList([
        transaction({ id: 'healthy-row', name: 'Healthy transaction' }),
      ]);
      if (timing === 'after') await fail();
      expect(screen.getByTestId('pending')).toHaveTextContent(
        'Healthy transaction',
      );
      expect(screen.getByTestId('read-error')).toBeEmptyDOMElement();
    },
  );

  it('registers recovery before a synchronous subscription acknowledgement', async () => {
    const network = setupNetwork(true);
    const recover = vi.fn();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <Recovery onRecover={recover} />
        <Lists />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await waitFor(() => expect(recover).toHaveBeenCalledOnce());
  });

  it('calls the current recovery callback on acknowledgement and removes it when its screen closes', async () => {
    const network = setupNetwork();
    const original = vi.fn();
    const current = vi.fn();
    const view = render(
      <TransactionUpdates companyId="company" owner="owner">
        <Recovery onRecover={original} />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await network.acknowledge();
    expect(original).toHaveBeenCalledOnce();
    view.rerender(
      <TransactionUpdates companyId="company" owner="owner">
        <Recovery onRecover={current} />
      </TransactionUpdates>,
    );
    await network.acknowledge();
    expect(original).toHaveBeenCalledOnce();
    expect(current).toHaveBeenCalledOnce();
    view.rerender(
      <TransactionUpdates companyId="company" owner="owner">
        <p>Another screen</p>
      </TransactionUpdates>,
    );
    await network.acknowledge();
    expect(current).toHaveBeenCalledOnce();
  });

  it('keeps Pending corrections inside the ascending page boundary and preserves equal-date membership', async () => {
    const network = setupNetwork();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <Lists paginated />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    const first = transaction({
      date: '2026-09-01',
      id: 'first',
      name: 'First',
    });
    const second = transaction({
      date: '2026-09-03',
      id: 'second',
      name: 'Second',
    });
    const third = transaction({
      date: '2026-09-03',
      id: 'third',
      name: 'Third',
    });
    await network.resolveList([first, second, third]);
    network.signal('second');
    await network.resolveRead(
      0,
      transaction({ ...second, name: 'Updated second' }),
    );
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'First|receipt.pdfUpdated second|receipt.pdfThird|receipt.pdf',
    );

    network.signal('unseen-tie');
    await network.resolveRead(
      1,
      transaction({ date: '2026-09-03', id: 'unseen-tie', name: 'Unseen tie' }),
    );
    expect(screen.queryByText(/Unseen tie/)).not.toBeInTheDocument();
    network.signal('later');
    await network.resolveRead(
      2,
      transaction({ date: '2026-09-04', id: 'later', name: 'Off page' }),
    );
    expect(screen.queryByText(/Off page/)).not.toBeInTheDocument();

    network.signal('first');
    await network.resolveRead(
      3,
      transaction({ ...first, date: '2026-09-02', name: 'Moved within page' }),
    );
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'Moved within page|receipt.pdfUpdated second|receipt.pdfThird|receipt.pdf',
    );
    network.signal('earlier');
    await network.resolveRead(
      4,
      transaction({ date: '2026-08-30', id: 'earlier', name: 'New earliest' }),
    );
    expect(screen.getByTestId('pending')).toHaveTextContent(
      'New earliest|receipt.pdfMoved within page|receipt.pdfUpdated second|receipt.pdf',
    );
    expect(screen.getByTestId('pending').children).toHaveLength(3);
  });

  it('reconciles every loaded row with at most five strong reads active', async () => {
    const network = setupNetwork();
    render(<Account />, { wrapper: network.Wrapper });
    const rows = Array.from({ length: 100 }, (_, index) =>
      transaction({ id: `row-${index}` }),
    );
    await network.resolveList(rows);
    await network.acknowledge();
    expect(network.reads).toHaveLength(5);
    network.signal('row-50');
    expect(network.reads).toHaveLength(5);
    const resolveNext = async (index: number): Promise<void> => {
      await network.resolveRead(index, null);
      expect(network.reads).toHaveLength(Math.min(index + 6, rows.length));
      if (index + 1 < rows.length) await resolveNext(index + 1);
    };
    await resolveNext(0);
    expect(
      new Set(network.reads.map(({ transactionId }) => transactionId)).size,
    ).toBe(100);
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
  });

  it('does not start queued strong reads after leaving the account', async () => {
    const network = setupNetwork();
    const view = render(<Account />, { wrapper: network.Wrapper });
    await network.resolveList(
      Array.from({ length: 10 }, (_, index) =>
        transaction({ id: `row-${index}` }),
      ),
    );
    await network.acknowledge();
    expect(network.reads).toHaveLength(5);
    view.unmount();
    await deliver(() =>
      network.reads.forEach(({ observer }) => {
        observer.next({ data: { getTransactionState: null } });
        observer.complete();
      }),
    );
    expect(network.reads).toHaveLength(5);
  });

  it.each([
    [
      'HTTP authorization',
      Object.assign(new Error('Access denied'), { statusCode: 403 }),
    ],
    [
      'GraphQL validation',
      new ApolloError({
        graphQLErrors: [
          new GraphQLError('Invalid request', {
            extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
          }),
        ],
      }),
    ],
    [
      'AppSync configuration',
      new ApolloError({
        graphQLErrors: [
          Object.assign(new GraphQLError('Transaction state is unavailable'), {
            errorType: 'ConfigurationError',
          }),
        ],
      }),
    ],
    [
      'AppSync authorization',
      new ApolloError({
        graphQLErrors: [
          Object.assign(new GraphQLError('Unauthorized'), {
            errorType: 'UnauthorizedException',
          }),
        ],
      }),
    ],
  ])(
    'exposes permanent %s failures immediately and retries after a new signal',
    async (_, failure) => {
      vi.useFakeTimers();
      const network = setupNetwork();
      render(
        <TransactionUpdates companyId="company" owner="owner">
          <ReadableDetails />
        </TransactionUpdates>,
        { wrapper: network.Wrapper },
      );
      await deliver(() => network.reads[0].observer.error(failure));
      expect(screen.getByRole('alert')).toHaveTextContent(failure.message);
      expect(screen.queryByText('Deleted transaction')).not.toBeInTheDocument();
      await act(() => vi.advanceTimersByTimeAsync(60000));
      expect(network.reads).toHaveLength(1);
      network.signal();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByText('Loading current transaction'),
      ).toBeInTheDocument();
      await network.resolveRead(1, transaction());
      expect(screen.getByText('Invoice')).toBeInTheDocument();
    },
  );

  it.each([
    ['loaded', [transaction()]],
    ['signal-only', []],
  ])(
    'bounds transient %s read retries, exposes the failure to lists, and recovers on reconnect',
    async (_, initialRows) => {
      vi.useFakeTimers();
      const network = setupNetwork();
      render(<Account />, { wrapper: network.Wrapper });
      await network.resolveList(initialRows);
      network.signal();
      const rejectRead = (index: number) =>
        deliver(() =>
          network.reads[index].observer.error(new Error('Service unavailable')),
        );
      await rejectRead(0);
      await act(() => vi.advanceTimersByTimeAsync(1000));
      await rejectRead(1);
      await act(() => vi.advanceTimersByTimeAsync(2000));
      await rejectRead(2);
      await act(() => vi.advanceTimersByTimeAsync(4000));
      await rejectRead(3);
      expect(screen.getByTestId('read-error')).toHaveTextContent(
        'Service unavailable',
      );
      expect(screen.getByTestId('pending').children).toHaveLength(
        initialRows.length,
      );
      await act(() => vi.advanceTimersByTimeAsync(60000));
      expect(network.reads).toHaveLength(4);
      await network.acknowledge();
      expect(screen.getByTestId('read-error')).toBeEmptyDOMElement();
      await network.resolveRead(
        4,
        transaction({ name: 'Recovered transaction' }),
      );
      expect(screen.getByTestId('pending')).toHaveTextContent(
        'Recovered transaction',
      );
    },
  );

  it('strongly checks list rows loaded after acknowledgement without repeated reads for stale refetches', async () => {
    const network = setupNetwork();
    render(<Account />, { wrapper: network.Wrapper });
    await network.acknowledge();
    await network.resolveList([transaction({ name: 'Stale index row' })]);

    expect(network.reads.map(({ transactionId }) => transactionId)).toEqual([
      'transaction',
    ]);
    await network.resolveRead(
      0,
      transaction({ attachment: null, name: 'Current row' }),
    );
    await network.refetchList();
    await network.resolveList([transaction({ name: 'Stale index row' })]);

    expect(network.reads).toHaveLength(1);
    expect(screen.getByTestId('pending')).toHaveTextContent('Current row|');
    expect(screen.queryByText(/Stale index row/)).not.toBeInTheDocument();

    await network.refetchList();
    await network.resolveList([
      transaction(),
      transaction({ id: 'another', name: 'Another stale row' }),
    ]);
    expect(network.reads.map(({ transactionId }) => transactionId)).toEqual([
      'transaction',
      'another',
    ]);
    await network.resolveRead(1, null);
    expect(screen.queryByText(/Another stale row/)).not.toBeInTheDocument();
  });

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
  it('refreshes an open detail after reconnect without any prior transaction signal', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <Details />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    expect(screen.getByText('Original detail')).toBeInTheDocument();
    expect(network.reads).toHaveLength(1);
    await network.resolveRead(
      0,
      transaction({ description: 'Original detail' }),
    );
    await deliver(() => network.signals[0].error(new Error('Connection lost')));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    await network.acknowledge();
    expect(network.reads.map(({ transactionId }) => transactionId)).toEqual([
      'transaction',
      'transaction',
    ]);
    await network.resolveRead(
      1,
      transaction({ description: 'Changed while disconnected' }),
    );
    expect(screen.getByText('Changed while disconnected')).toBeInTheDocument();
  });

  it('does not refresh a detail that was closed during the outage', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    const view = render(
      <TransactionUpdates companyId="company" owner="owner">
        <Details />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await deliver(() => network.signals[0].error(new Error('Connection lost')));
    view.rerender(
      <TransactionUpdates companyId="company" owner="owner">
        <p>Account page</p>
      </TransactionUpdates>,
    );
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(2);
    await network.acknowledge();
    expect(network.reads).toHaveLength(1);
  });

  it('resets quiet successful connections but backs off attempts that never receive an acknowledgement', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <p>Account</p>
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await network.acknowledge();
    await deliver(() => network.signals.at(-1)?.error(new Error('First drop')));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(2);
    await network.acknowledge();
    await deliver(() =>
      network.signals.at(-1)?.error(new Error('Second independent drop')),
    );
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(3);
    await deliver(() =>
      network.signals.at(-1)?.error(new Error('Failed attempt')),
    );
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(3);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.signals).toHaveLength(4);
    await deliver(() =>
      network.signals.at(-1)?.error(new Error('Another failed attempt')),
    );
    await act(() => vi.advanceTimersByTimeAsync(3999));
    expect(network.signals).toHaveLength(4);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(network.signals).toHaveLength(5);
    expect(network.reads).toHaveLength(0);
  });

  it('does not overwrite completed local mutations with older in-flight reads', async () => {
    const network = setupNetwork();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <Lists />
        <LocalChanges />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await network.resolveList([]);
    network.signal();
    fireEvent.click(screen.getByText('Save locally'));
    await network.resolveRead(0, transaction({ name: 'Older server state' }));
    expect(screen.getByTestId('pending')).toHaveTextContent('Local update');
    expect(network.reads).toHaveLength(2);
    await network.resolveRead(1, transaction({ name: 'Local update' }));
    network.signal();
    fireEvent.click(screen.getByText('Delete locally'));
    await network.resolveRead(2, transaction());
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
    expect(network.reads).toHaveLength(4);
    await network.resolveRead(3, null);
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
  });

  it.each([
    ['deletion', null, ''],
    [
      'edit',
      transaction({ name: 'Later external edit' }),
      'Later external edit|receipt.pdf',
    ],
  ])(
    'rechecks a later external %s after a delayed local save response overlaps its read',
    async (_, current, expected) => {
      const network = setupNetwork();
      render(
        <TransactionUpdates companyId="company" owner="owner">
          <Lists />
          <LocalChanges />
        </TransactionUpdates>,
        { wrapper: network.Wrapper },
      );
      await network.resolveList([]);
      network.signal();
      fireEvent.click(screen.getByText('Save locally'));
      await network.resolveRead(0, current);

      expect(network.reads).toHaveLength(2);
      expect(screen.getByTestId('pending')).toHaveTextContent('Local update');
      await network.resolveRead(1, current);
      expect(screen.getByTestId('pending').textContent).toBe(expected);
    },
  );

  it.each([
    ['deletion', null, ''],
    [
      'edit',
      transaction({ name: 'Already-read external edit' }),
      'Already-read external edit|receipt.pdf',
    ],
  ])(
    'restores an already-read external %s after an older local mutation response arrives',
    async (_, current, expected) => {
      const network = setupNetwork();
      render(
        <TransactionUpdates companyId="company" owner="owner">
          <Lists />
          <LocalChanges />
        </TransactionUpdates>,
        { wrapper: network.Wrapper },
      );
      await network.resolveList([]);
      network.signal();
      await network.resolveRead(0, current);
      expect(screen.getByTestId('pending').textContent).toBe(expected);

      fireEvent.click(screen.getByText('Save locally'));
      expect(screen.getByTestId('pending')).toHaveTextContent('Local update');
      expect(network.reads).toHaveLength(2);
      await network.resolveRead(1, current);
      expect(screen.getByTestId('pending').textContent).toBe(expected);
    },
  );

  it('rechecks ordering after a read fails across a delayed mutation response and retries subsequent failures', async () => {
    vi.useFakeTimers();
    const network = setupNetwork();
    render(
      <TransactionUpdates companyId="company" owner="owner">
        <Lists />
        <LocalChanges />
      </TransactionUpdates>,
      { wrapper: network.Wrapper },
    );
    await network.resolveList([]);
    network.signal();
    fireEvent.click(screen.getByText('Save locally'));
    await deliver(() =>
      network.reads[0].observer.error(new Error('Interrupted read')),
    );

    expect(network.reads).toHaveLength(2);
    expect(screen.getByTestId('pending')).toHaveTextContent('Local update');
    await deliver(() =>
      network.reads[1].observer.error(new Error('Temporary failure')),
    );
    expect(network.reads).toHaveLength(2);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(network.reads).toHaveLength(3);
    expect(screen.getByTestId('pending')).toHaveTextContent('Local update');
    await network.resolveRead(2, null);
    expect(screen.getByTestId('pending')).toBeEmptyDOMElement();
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
