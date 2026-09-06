import { ApolloError, useApolloClient } from '@apollo/client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gql } from '../graphql';
import {
  GetTransactionStateQuery,
  TransactionStatus,
} from '../graphql/graphql';

export const ON_TRANSACTION_CHANGE = gql(/* GraphQL */ `
  subscription OnTransactionChange($id: ID!, $owner: String!) {
    onTransactionChange(id: $id, owner: $owner) {
      id
      owner
      transactionId
    }
  }
`);

export const GET_TRANSACTION_STATE = gql(/* GraphQL */ `
  query GetTransactionState($companyId: ID!, $transactionId: ID!) {
    getTransactionState(companyId: $companyId, transactionId: $transactionId) {
      amount
      attachment
      category
      companyId
      date
      description
      id
      name
      refund
      scheduled
      status
      vat
    }
  }
`);

type CurrentTransaction = NonNullable<
  GetTransactionStateQuery['getTransactionState']
>;
type TransactionStates = ReadonlyMap<string, CurrentTransaction | null>;

const emptyStates: TransactionStates = new Map();
const TransactionUpdatesContext = createContext<{
  apply: (transactionId: string, current: CurrentTransaction | null) => void;
  errors: ReadonlyMap<string, ApolloError>;
  pending: ReadonlySet<string>;
  states: TransactionStates;
  watch: (transactionId: string, onReady: () => void) => () => void;
  watchList: (transactionIds: string[]) => () => void;
  watchRecovery: (recover: () => void) => () => void;
}>({
  apply: () => {},
  errors: new Map(),
  pending: new Set(),
  states: emptyStates,
  watch: () => () => {},
  watchList: () => () => {},
  watchRecovery: () => () => {},
});
const TransactionStoreContext = createContext<{
  states: ReadonlyMap<string, TransactionStates>;
  update: (
    companyId: string,
    transactionId: string,
    current: CurrentTransaction | null,
  ) => void;
}>({ states: new Map(), update: () => {} });

export function TransactionStateProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [states, setStates] = useState<ReadonlyMap<string, TransactionStates>>(
    () => new Map(),
  );
  const update = useCallback(
    (
      companyId: string,
      transactionId: string,
      current: CurrentTransaction | null,
    ) => {
      setStates((previous) =>
        new Map(previous).set(
          companyId,
          new Map(previous.get(companyId)).set(transactionId, current),
        ),
      );
    },
    [],
  );
  const value = useMemo(() => ({ states, update }), [states, update]);

  return (
    <TransactionStoreContext.Provider value={value}>
      {children}
    </TransactionStoreContext.Provider>
  );
}

export const useApplyTransactionState = () =>
  useContext(TransactionUpdatesContext).apply;

export const useTransactionRecovery = (recover: () => void) => {
  const { watchRecovery } = useContext(TransactionUpdatesContext);
  useEffect(() => watchRecovery(recover), [recover, watchRecovery]);
};

export const useTransactionState = (transactionId: string) => {
  const { states, watch } = useContext(TransactionUpdatesContext);
  const [readyFor, setReadyFor] = useState<{
    transactionId: string;
    watch: typeof watch;
  }>();
  useEffect(
    () => watch(transactionId, () => setReadyFor({ transactionId, watch })),
    [transactionId, watch],
  );
  return readyFor?.transactionId === transactionId && readyFor.watch === watch
    ? states.get(transactionId)
    : undefined;
};

export const useTransactionReadError = (
  transactionIds: string | readonly string[],
) => {
  const { errors, states } = useContext(TransactionUpdatesContext);
  if (typeof transactionIds === 'string') return errors.get(transactionIds);
  // A failed first read has no known status or list membership yet.
  return (
    transactionIds.map((id) => errors.get(id)).find(Boolean) ??
    Array.from(errors).find(([id]) => !states.has(id))?.[1]
  );
};

export const useTransactionReadPending = (transactionId: string) =>
  useContext(TransactionUpdatesContext).pending.has(transactionId);

function isPermanentReadError(error: ApolloError) {
  const status =
    error.networkError && 'statusCode' in error.networkError
      ? Number(error.networkError.statusCode)
      : undefined;
  return (
    (status !== undefined &&
      status >= 400 &&
      status < 500 &&
      status !== 408 &&
      status !== 429) ||
    error.graphQLErrors.some((graphQLError) => {
      const code =
        graphQLError.extensions?.errorType ??
        graphQLError.extensions?.code ??
        ('errorType' in graphQLError ? graphQLError.errorType : '');
      return (
        typeof code === 'string' &&
        /^(Unauthorized(?:Exception)?|AccessDenied(?:Exception)?|Forbidden|ValidationError|GRAPHQL_VALIDATION_FAILED|BAD_USER_INPUT|UNAUTHENTICATED|FORBIDDEN)$/i.test(
          code,
        )
      );
    })
  );
}

interface IReadRequest {
  dirty: boolean;
  running: boolean;
  retries: number;
  timer?: ReturnType<typeof setTimeout>;
}

interface ITransactionUpdatesProps {
  readonly children: ReactNode;
  readonly companyId: string;
  readonly owner: string;
}

function TransactionUpdates({
  children,
  companyId,
  owner,
}: ITransactionUpdatesProps) {
  const client = useApolloClient();
  const store = useContext(TransactionStoreContext);
  const states = store.states.get(companyId) ?? emptyStates;
  const statesRef = useRef(states);
  statesRef.current = states;
  const { update } = store;
  const viewedTransactions = useRef(new Map<string, Set<() => void>>());
  const loadedLists = useRef(new Set<string[]>());
  const recoveries = useRef(new Set<() => void>());
  const [errors, setErrors] = useState<ReadonlyMap<string, ApolloError>>(
    () => new Map(),
  );
  const errorsRef = useRef(errors);
  errorsRef.current = errors;
  const [pending, setPending] = useState<ReadonlySet<string>>(() => new Set());
  const refreshList = useRef<
    ((transactionIds: string[]) => void) | undefined
  >();
  const revisions = useRef(new Map<string, number>());
  const refreshTransaction = useRef<
    ((transactionId: string) => void) | undefined
  >();
  const notifyReady = useCallback((transactionId: string) => {
    viewedTransactions.current.get(transactionId)?.forEach((ready) => ready());
  }, []);
  const apply = useCallback(
    (transactionId: string, current: CurrentTransaction | null) => {
      revisions.current.set(
        transactionId,
        (revisions.current.get(transactionId) ?? 0) + 1,
      );
      update(
        companyId,
        transactionId,
        current?.companyId === companyId ? current : null,
      );
      notifyReady(transactionId);
      // A delayed mutation response may be older than an already completed read.
      refreshTransaction.current?.(transactionId);
    },
    [companyId, notifyReady, update],
  );
  const watch = useCallback((transactionId: string, onReady: () => void) => {
    const observers =
      viewedTransactions.current.get(transactionId) ?? new Set();
    observers.add(onReady);
    viewedTransactions.current.set(transactionId, observers);
    refreshTransaction.current?.(transactionId);
    return () => {
      observers.delete(onReady);
      if (observers.size === 0)
        viewedTransactions.current.delete(transactionId);
    };
  }, []);
  const watchList = useCallback((transactionIds: string[]) => {
    loadedLists.current.add(transactionIds);
    refreshList.current?.(transactionIds);
    return () => {
      loadedLists.current.delete(transactionIds);
    };
  }, []);
  const watchRecovery = useCallback((recover: () => void) => {
    recoveries.current.add(recover);
    return () => {
      recoveries.current.delete(recover);
    };
  }, []);
  const value = useMemo(
    () => ({
      apply,
      errors,
      pending,
      states,
      watch,
      watchList,
      watchRecovery,
    }),
    [apply, errors, pending, states, watch, watchList, watchRecovery],
  );

  useEffect(() => {
    let active = true;
    const requests = new Map<string, IReadRequest>();
    const queued = new Map<string, () => void>();
    let running = 0;

    const setReadPending = (transactionId: string, reading: boolean) => {
      // Only mounted details need pending state; list recovery can read many rows.
      if (reading && !viewedTransactions.current.has(transactionId)) return;
      setPending((previous) => {
        if (previous.has(transactionId) === reading) return previous;
        const next = new Set(previous);
        if (reading) next.add(transactionId);
        else next.delete(transactionId);
        return next;
      });
    };

    const clearError = (transactionId: string) => {
      setErrors((previous) => {
        if (!previous.has(transactionId)) return previous;
        const next = new Map(previous);
        next.delete(transactionId);
        return next;
      });
    };

    const readTransaction = async (
      transactionId: string,
      request: IReadRequest,
    ): Promise<number | undefined> => {
      request.dirty = false;
      const revision = revisions.current.get(transactionId);

      try {
        const { data } = await client.query({
          context: { queryDeduplication: false },
          fetchPolicy: 'no-cache',
          query: GET_TRANSACTION_STATE,
          variables: { companyId, transactionId },
        });

        if (!active) return undefined;

        // Signals and mutation responses can race. Re-read after either one
        // rather than inferring write order from response arrival.
        if (request.dirty || revision !== revisions.current.get(transactionId))
          return await readTransaction(transactionId, request);

        const current = data.getTransactionState;
        update(
          companyId,
          transactionId,
          current?.companyId === companyId ? current : null,
        );
        clearError(transactionId);
        notifyReady(transactionId);
        requests.delete(transactionId);
        setReadPending(transactionId, false);
        return undefined;
      } catch (error_) {
        if (!active) return undefined;
        if (request.dirty || revision !== revisions.current.get(transactionId))
          return readTransaction(transactionId, request);

        const error =
          error_ instanceof ApolloError
            ? error_
            : new ApolloError({ networkError: error_ as Error });
        if (isPermanentReadError(error) || request.retries >= 3) {
          requests.delete(transactionId);
          setReadPending(transactionId, false);
          setErrors((previous) => new Map(previous).set(transactionId, error));
          return undefined;
        }

        // Retry transient authoritative-read failures a bounded number of times.
        const delay = 1000 * 2 ** request.retries;
        request.retries += 1;
        return delay;
      }
    };

    const drain = () => {
      while (active && running < 5 && queued.size > 0) {
        const [transactionId, start] = queued.entries().next().value as [
          string,
          () => void,
        ];
        queued.delete(transactionId);
        start();
      }
    };

    const runRequest = async (
      transactionId: string,
      request: IReadRequest,
      retry: () => void,
    ) => {
      request.running = true;
      running += 1;
      try {
        const delay = await readTransaction(transactionId, request);
        if (active && delay !== undefined) {
          request.timer = setTimeout(retry, delay);
        }
      } finally {
        request.running = false;
        running -= 1;
        drain();
      }
    };

    const enqueue = (transactionId: string, request: IReadRequest) => {
      const retry = () => {
        request.timer = undefined;
        enqueue(transactionId, request);
      };
      queued.set(transactionId, () => {
        runRequest(transactionId, request, retry).catch(() => {});
      });
      drain();
    };

    const refresh = (transactionId: string) => {
      setReadPending(transactionId, true);
      const existing = requests.get(transactionId);
      if (existing) {
        if (existing.running) existing.dirty = true;
        if (existing.timer) {
          clearTimeout(existing.timer);
          existing.timer = undefined;
          enqueue(transactionId, existing);
        }
        return;
      }

      clearError(transactionId);
      const request = { dirty: false, retries: 0, running: false };
      requests.set(transactionId, request);
      enqueue(transactionId, request);
    };

    refreshTransaction.current = refresh;

    let subscription: { unsubscribe: () => void } | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectAttempts = 0;
    let connected = false;
    const reconciledListIds = new Set<string>();

    refreshList.current = (transactionIds) => {
      if (!connected) return;
      transactionIds.forEach((id) => {
        if (!reconciledListIds.has(id)) {
          reconciledListIds.add(id);
          refresh(id);
        }
      });
    };

    const refreshKnownTransactions = () => {
      const transactionIds = new Set([
        ...statesRef.current.keys(),
        ...errorsRef.current.keys(),
        ...viewedTransactions.current.keys(),
        ...Array.from(loadedLists.current).flat(),
      ]);
      transactionIds.forEach((id) => {
        reconciledListIds.add(id);
        refresh(id);
      });
    };

    const refreshAfterReconnect = () => {
      // Strongly check loaded rows and open details whose signals were missed.
      refreshKnownTransactions();
      recoveries.current.forEach((recover) => recover());
      client.refetchQueries({ include: ['GetTransactions'] }).catch(() => {});
    };

    const connect = () => {
      const reconnect = () => {
        if (!active || reconnectTimer) return;
        connected = false;
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
        reconnectAttempts += 1;
        reconnectTimer = setTimeout(() => {
          reconnectTimer = undefined;
          connect();
        }, delay);
      };

      subscription = client
        .subscribe({
          // AppSync emits CONNECTED only after the server acknowledges start.
          context: { controlMessages: { '@@controlEvents': true } },
          fetchPolicy: 'no-cache',
          query: ON_TRANSACTION_CHANGE,
          variables: { id: companyId, owner },
        })
        .subscribe({
          complete: reconnect,
          error: reconnect,
          next: ({ data, extensions }) => {
            if (!active) return;
            if (extensions?.controlMsgType === 'CONNECTED') {
              connected = true;
              reconciledListIds.clear();
              reconnectAttempts = 0;
              refreshAfterReconnect();
              return;
            }
            const change = data?.onTransactionChange;
            if (change?.id !== companyId || change.owner !== owner) return;
            reconnectAttempts = 0;
            refresh(change.transactionId);
          },
        });
    };

    connect();
    // Corrections survive navigation; recheck them after time away from the account.
    refreshKnownTransactions();

    return () => {
      active = false;
      refreshTransaction.current = undefined;
      refreshList.current = undefined;
      subscription?.unsubscribe();
      clearTimeout(reconnectTimer);
      requests.forEach(({ timer }) => clearTimeout(timer));
      queued.clear();
    };
  }, [client, companyId, notifyReady, owner, update]);

  return (
    <TransactionUpdatesContext.Provider value={value}>
      {children}
    </TransactionUpdatesContext.Provider>
  );
}

export const useTransactionItems = <T extends { date: string; id: string }>(
  items: T[] | undefined,
  status: TransactionStatus,
  hasMore = false,
  limit = items?.length ?? 0,
): Array<T | CurrentTransaction> => {
  const { states, watchList } = useContext(TransactionUpdatesContext);
  useEffect(
    () => watchList(items?.map(({ id }) => id) ?? []),
    [items, watchList],
  );

  return useMemo(() => {
    const existing = items ?? [];
    if (states.size === 0) return existing;

    const loadedOrder = new Map(existing.map(({ id }, index) => [id, index]));
    const ascending = status === TransactionStatus.Pending;
    const boundaryDate = existing.reduce(
      (boundary, { date }) =>
        ascending
          ? Math.max(boundary, new Date(date).getTime())
          : Math.min(boundary, new Date(date).getTime()),
      ascending ? -Infinity : Infinity,
    );

    // Keep authoritative records and tombstones separate from Apollo's index
    // results so delayed list responses cannot resurrect or overwrite them.
    const result: Array<T | CurrentTransaction> = existing.filter(
      ({ id }) => !states.has(id),
    );
    states.forEach((current) => {
      if (current?.status !== status) return;
      const date = new Date(current.date).getTime();
      if (
        !hasMore ||
        (ascending ? date < boundaryDate : date > boundaryDate) ||
        (date === boundaryDate && loadedOrder.has(current.id))
      )
        result.push(current);
    });

    result.sort((left, right) => {
      const order =
        new Date(left.date).getTime() - new Date(right.date).getTime();
      if (order === 0)
        return (
          (loadedOrder.get(left.id) ?? existing.length) -
          (loadedOrder.get(right.id) ?? existing.length)
        );
      return status === TransactionStatus.Pending ? order : -order;
    });
    // Retain the cache's boundary row for the next page, but do not expand the
    // visible window when a recent transaction is inserted ahead of it.
    return hasMore ? result.slice(0, limit) : result;
  }, [hasMore, items, limit, states, status]);
};

export default TransactionUpdates;
