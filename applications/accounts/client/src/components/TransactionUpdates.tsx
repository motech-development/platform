import { useApolloClient } from '@apollo/client';
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
  states: TransactionStates;
  watch: (transactionId: string) => () => void;
}>({ states: emptyStates, watch: () => () => {} });
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

export const useTransactionState = (transactionId: string) => {
  const { states, watch } = useContext(TransactionUpdatesContext);
  useEffect(() => watch(transactionId), [transactionId, watch]);
  return states.get(transactionId);
};

interface IReadRequest {
  dirty: boolean;
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
  const viewedTransactions = useRef(new Set<string>());
  const watch = useCallback((transactionId: string) => {
    viewedTransactions.current.add(transactionId);
    return () => {
      viewedTransactions.current.delete(transactionId);
    };
  }, []);
  const value = useMemo(() => ({ states, watch }), [states, watch]);

  useEffect(() => {
    let active = true;
    const requests = new Map<string, IReadRequest>();

    const readTransaction = async (
      transactionId: string,
      request: IReadRequest,
    ): Promise<void> => {
      request.dirty = false;

      try {
        const { data } = await client.query({
          context: { queryDeduplication: false },
          fetchPolicy: 'no-cache',
          query: GET_TRANSACTION_STATE,
          variables: { companyId, transactionId },
        });

        if (!active) return;

        // A signal arriving during this read may represent a newer write.
        if (request.dirty) {
          await readTransaction(transactionId, request);
          return;
        }

        const current = data.getTransactionState;
        update(
          companyId,
          transactionId,
          current?.companyId === companyId ? current : null,
        );
        requests.delete(transactionId);
      } catch {
        if (!active) return;

        // Retry a failed authoritative read, not the eventually consistent list.
        const delay = Math.min(1000 * 2 ** request.retries, 30000);
        request.retries += 1;
        request.timer = setTimeout(() => {
          request.timer = undefined;
          readTransaction(transactionId, request).catch(() => {});
        }, delay);
      }
    };

    const refresh = (transactionId: string) => {
      const existing = requests.get(transactionId);
      if (existing) {
        existing.dirty = true;
        if (existing.timer) {
          clearTimeout(existing.timer);
          existing.timer = undefined;
          readTransaction(transactionId, existing).catch(() => {});
        }
        return;
      }

      const request = { dirty: false, retries: 0 };
      requests.set(transactionId, request);
      readTransaction(transactionId, request).catch(() => {});
    };

    let subscription: { unsubscribe: () => void } | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectAttempts = 0;

    const refreshKnownTransactions = () => {
      const transactionIds = new Set([
        ...statesRef.current.keys(),
        ...viewedTransactions.current,
      ]);
      transactionIds.forEach(refresh);
    };

    const refreshAfterReconnect = () => {
      // Include open details even when they have never received a signal.
      refreshKnownTransactions();
      client
        .refetchQueries({ include: ['GetBalance', 'GetTransactions'] })
        .catch(() => {});
    };

    const connect = () => {
      const reconnect = () => {
        if (!active || reconnectTimer) return;
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
        reconnectAttempts += 1;
        reconnectTimer = setTimeout(() => {
          reconnectTimer = undefined;
          connect();
          refreshAfterReconnect();
        }, delay);
      };

      subscription = client
        .subscribe({
          fetchPolicy: 'no-cache',
          query: ON_TRANSACTION_CHANGE,
          variables: { id: companyId, owner },
        })
        .subscribe({
          complete: reconnect,
          error: reconnect,
          next: ({ data }) => {
            const change = data?.onTransactionChange;
            if (!active || change?.id !== companyId || change.owner !== owner)
              return;
            reconnectAttempts = 0;
            refresh(change.transactionId);
          },
        });
    };

    connect();
    // Corrections survive navigation; recheck them after time away from the account.
    statesRef.current.forEach((_state, id) => refresh(id));

    return () => {
      active = false;
      subscription?.unsubscribe();
      clearTimeout(reconnectTimer);
      requests.forEach(({ timer }) => clearTimeout(timer));
    };
  }, [client, companyId, owner, update]);

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
): Array<T | CurrentTransaction> => {
  const { states } = useContext(TransactionUpdatesContext);

  return useMemo(() => {
    const existing = items ?? [];
    if (states.size === 0) return existing;

    const loadedIds = new Set(existing.map(({ id }) => id));
    const oldestLoadedDate = existing.reduce(
      (oldest, { date }) => Math.min(oldest, new Date(date).getTime()),
      Infinity,
    );

    // Keep authoritative records and tombstones separate from Apollo's index
    // results so delayed list responses cannot resurrect or overwrite them.
    const result: Array<T | CurrentTransaction> = existing.filter(
      ({ id }) => !states.has(id),
    );
    states.forEach((current) => {
      if (
        current?.status === status &&
        (!hasMore ||
          loadedIds.has(current.id) ||
          new Date(current.date).getTime() >= oldestLoadedDate)
      )
        result.push(current);
    });

    result.sort((left, right) => {
      const order =
        new Date(left.date).getTime() - new Date(right.date).getTime();
      return status === TransactionStatus.Pending ? order : -order;
    });
    // Retain the cache's boundary row for the next page, but do not expand the
    // visible window when a recent transaction is inserted ahead of it.
    return hasMore ? result.slice(0, existing.length) : result;
  }, [hasMore, items, states, status]);
};

export default TransactionUpdates;
