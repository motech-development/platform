import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Button, PageHeader, StatePanel } from '@motech-development/breeze-ui';
import { ArrowRightIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';
import {
  GET_CONFIRMED_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS,
} from '../../data/operations';
import { TransactionsContentSkeleton } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { FinancialSummary } from './FinancialSummary';
import { type LedgerTransaction, TransactionLedger } from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
  TransactionPageHeaderAction,
} from './TransactionPagePresentation';
import { useTransactionPageReconciliation } from './useTransactionPageReconciliation';

function combineTransactions(
  confirmedTransactions: readonly LedgerTransaction[] = [],
  pendingTransactions: readonly LedgerTransaction[] = [],
) {
  // Pending is the explicit status-bearing snapshot and wins while the two
  // eventually consistent status indexes overlap.
  const transactionsById = new Map<string, LedgerTransaction>([
    ...confirmedTransactions.map((transaction): [string, LedgerTransaction] => [
      transaction.id,
      {
        ...transaction,
        status: 'confirmed',
      },
    ]),
    ...pendingTransactions.map((transaction): [string, LedgerTransaction] => [
      transaction.id,
      transaction,
    ]),
  ]);

  return [...transactionsById.values()].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
}

function TransactionsPagination({
  confirmedFetchMore,
  confirmedLoading,
  confirmedNextToken,
  pendingFetchMore,
  pendingLoading,
  pendingNextToken,
}: Readonly<{
  confirmedFetchMore: (options: {
    variables: { nextToken: string };
  }) => Promise<unknown>;
  confirmedLoading: boolean;
  confirmedNextToken?: string | null;
  pendingFetchMore: (options: {
    variables: { nextToken: string };
  }) => Promise<unknown>;
  pendingLoading: boolean;
  pendingNextToken?: string | null;
}>) {
  const { t } = useTranslation('transactions');

  if (!confirmedNextToken && !pendingNextToken) return null;

  return (
    <Button
      appearance="text"
      className="mt-4 self-center"
      loading={confirmedLoading || pendingLoading}
      onAction={() => {
        Promise.all([
          confirmedNextToken
            ? confirmedFetchMore({
                variables: { nextToken: confirmedNextToken },
              })
            : Promise.resolve(),
          pendingNextToken
            ? pendingFetchMore({ variables: { nextToken: pendingNextToken } })
            : Promise.resolve(),
        ]).catch(() => undefined);
      }}
    >
      {t('Load more')}
    </Button>
  );
}

function TransactionsRefreshAlert({
  hasTransactions,
  onRetry,
}: Readonly<{
  hasTransactions: boolean;
  onRetry: () => void;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);

  return (
    <QueryRefreshAlert
      onRetry={onRetry}
      retryLabel={t('Try again', { ns: 'routing' })}
    >
      {hasTransactions
        ? t(
            'Transactions could not be refreshed. Existing results are still shown.',
          )
        : t(
            'Transactions could not be refreshed. Check your connection, then try again.',
          )}
    </QueryRefreshAlert>
  );
}

function canShowEmptyState({
  confirmedLoaded,
  hasTransactions,
  initiallyLoading,
  pendingLoaded,
}: Readonly<{
  confirmedLoaded: boolean;
  hasTransactions: boolean;
  initiallyLoading: boolean;
  pendingLoaded: boolean;
}>) {
  return (
    !initiallyLoading && !hasTransactions && confirmedLoaded && pendingLoaded
  );
}

export function TransactionsPageContent({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['transactions', 'routing', 'shell']);
  const confirmed = useQuery(GET_CONFIRMED_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      count: 100,
      id: companyId,
      status: 'confirmed',
    },
  });
  const pending = useQuery(GET_PENDING_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      count: 100,
      id: companyId,
      status: 'pending',
    },
  });

  const initiallyLoading =
    (confirmed.loading && !confirmed.data) ||
    (pending.loading && !pending.data);
  const transactions = combineTransactions(
    confirmed.data?.getTransactions.items,
    pending.data?.getTransactions.items,
  );
  const hasTransactions = transactions.length > 0;
  const recordTransactionHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/record-transaction`;
  const pendingTransactionsHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/pending-transactions`;
  const data = confirmed.data ?? pending.data;
  const error = confirmed.error ?? pending.error;
  const showEmptyState = canShowEmptyState({
    confirmedLoaded: Boolean(confirmed.data),
    hasTransactions,
    initiallyLoading,
    pendingLoaded: Boolean(pending.data),
  });

  useTransactionPageReconciliation({
    fetchMore: confirmed.fetchMore,
    networkStatus: confirmed.networkStatus,
    page: confirmed.data?.getTransactions,
  });
  useTransactionPageReconciliation({
    fetchMore: pending.fetchMore,
    networkStatus: pending.networkStatus,
    page: pending.data?.getTransactions,
  });

  return (
    <div
      className="min-w-0"
      data-testid={data ? 'connected-content' : undefined}
    >
      <PageHeader
        actions={
          <TransactionPageHeaderAction
            hasTransactions={hasTransactions}
            initiallyLoading={initiallyLoading}
            pendingTransactionsHref={pendingTransactionsHref}
            recordTransactionHref={recordTransactionHref}
          />
        }
        description={t(
          'Review money in and out, attachments, and approval status.',
          { ns: 'routing' },
        )}
        title={t('Transactions')}
      />
      {error && !data ? (
        <TransactionPageError
          onRetry={() => Promise.all([confirmed.refetch(), pending.refetch()])}
          title={t('We could not load transactions')}
        />
      ) : null}
      {error && data ? (
        <TransactionsRefreshAlert
          hasTransactions={hasTransactions}
          onRetry={() => {
            Promise.all([confirmed.refetch(), pending.refetch()]).catch(
              () => undefined,
            );
          }}
        />
      ) : null}
      {initiallyLoading && !error ? <TransactionsContentSkeleton /> : null}
      {!initiallyLoading && hasTransactions && data ? (
        <div className="flex flex-col">
          {confirmed.data ? (
            <FinancialSummary
              balance={confirmed.data.getBalance.balance}
              currencyCode={confirmed.data.getBalance.currency}
              vat={confirmed.data.getBalance.vat}
            />
          ) : null}
          <TransactionLedger
            companyId={companyId}
            currencyCode={data.getBalance.currency}
            transactions={transactions}
          />
          <TransactionsPagination
            confirmedFetchMore={confirmed.fetchMore}
            confirmedLoading={
              confirmed.networkStatus === NetworkStatus.fetchMore
            }
            confirmedNextToken={confirmed.data?.getTransactions.nextToken}
            pendingFetchMore={pending.fetchMore}
            pendingLoading={pending.networkStatus === NetworkStatus.fetchMore}
            pendingNextToken={pending.data?.getTransactions.nextToken}
          />
        </div>
      ) : null}
      {showEmptyState ? (
        <StatePanel
          action={
            <RecordTransactionLink href={recordTransactionHref} icon={false} />
          }
          description={t(
            'Record money coming in or going out of the business.',
          )}
          icon={<ArrowRightIcon />}
          title={t('No transactions yet')}
        />
      ) : null}
    </div>
  );
}
