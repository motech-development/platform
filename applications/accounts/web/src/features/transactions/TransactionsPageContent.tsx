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
import { TransactionSubscriptionAlert } from './CompanyTransactionSubscription';
import { FinancialSummary } from './FinancialSummary';
import { combineTransactions } from './transaction-list';
import { TransactionLedger } from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
  TransactionPageHeaderAction,
} from './TransactionPagePresentation';
import { useTransactionPageReconciliation } from './useTransactionPageReconciliation';

function TransactionsPagination({
  confirmedLoadNextPage,
  confirmedLoading,
  confirmedNextToken,
  pendingLoadNextPage,
  pendingLoading,
  pendingNextToken,
}: Readonly<{
  confirmedLoadNextPage: () => Promise<void>;
  confirmedLoading: boolean;
  confirmedNextToken?: string | null;
  pendingLoadNextPage: () => Promise<void>;
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
          confirmedNextToken ? confirmedLoadNextPage() : Promise.resolve(),
          pendingNextToken ? pendingLoadNextPage() : Promise.resolve(),
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

function TransactionsErrorState({
  error,
  hasData,
  hasTransactions,
  initiallyLoading,
  onInitialRetry,
  onRefreshRetry,
}: Readonly<{
  error: boolean;
  hasData: boolean;
  hasTransactions: boolean;
  initiallyLoading: boolean;
  onInitialRetry: () => Promise<unknown>;
  onRefreshRetry: () => void;
}>) {
  const { t } = useTranslation('transactions');

  if (!error || initiallyLoading) return null;

  return hasData ? (
    <TransactionsRefreshAlert
      hasTransactions={hasTransactions}
      onRetry={onRefreshRetry}
    />
  ) : (
    <TransactionPageError
      onRetry={onInitialRetry}
      title={t('We could not load transactions')}
    />
  );
}

function TransactionsPaginationFailureAlert({
  retries,
}: Readonly<{
  retries: readonly (() => Promise<void>)[];
}>) {
  const { t } = useTranslation(['transactions', 'routing']);

  if (retries.length === 0) return null;

  return (
    <QueryRefreshAlert
      onRetry={() => {
        Promise.all(retries.map((retry) => retry())).catch(() => undefined);
      }}
      retryLabel={t('Try again', { ns: 'routing' })}
    >
      {t(
        'More transactions could not be loaded. Existing results are still shown.',
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

function TransactionsLoadedContent({
  companyId,
  confirmedLoadNextPage,
  confirmedLoading,
  confirmedNextToken,
  confirmedSummary,
  currencyCode,
  paginationFailed,
  pendingLoadNextPage,
  pendingLoading,
  pendingNextToken,
  transactions,
}: Readonly<{
  companyId: string;
  confirmedLoadNextPage: () => Promise<void>;
  confirmedLoading: boolean;
  confirmedNextToken?: string | null;
  confirmedSummary?: Readonly<{
    balance: number;
    currency: string;
    vat: Readonly<{ owed: number; paid: number }>;
  }>;
  currencyCode: string;
  paginationFailed: boolean;
  pendingLoadNextPage: () => Promise<void>;
  pendingLoading: boolean;
  pendingNextToken?: string | null;
  transactions: ReturnType<typeof combineTransactions>;
}>) {
  return (
    <div className="flex flex-col">
      {confirmedSummary ? (
        <FinancialSummary
          balance={confirmedSummary.balance}
          currencyCode={confirmedSummary.currency}
          vat={confirmedSummary.vat}
        />
      ) : null}
      <TransactionLedger
        companyId={companyId}
        currencyCode={currencyCode}
        transactions={transactions}
      />
      {!paginationFailed ? (
        <TransactionsPagination
          confirmedLoadNextPage={confirmedLoadNextPage}
          confirmedLoading={confirmedLoading}
          confirmedNextToken={confirmedNextToken}
          pendingLoadNextPage={pendingLoadNextPage}
          pendingLoading={pendingLoading}
          pendingNextToken={pendingNextToken}
        />
      ) : null}
    </div>
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

  const confirmedPagination = useTransactionPageReconciliation({
    fetchMore: confirmed.fetchMore,
    networkStatus: confirmed.networkStatus,
    page: confirmed.data?.getTransactions,
  });
  const pendingPagination = useTransactionPageReconciliation({
    fetchMore: pending.fetchMore,
    networkStatus: pending.networkStatus,
    page: pending.data?.getTransactions,
  });
  const paginationRetries = [
    ...(confirmedPagination.failed ? [confirmedPagination.retry] : []),
    ...(pendingPagination.failed ? [pendingPagination.retry] : []),
  ];
  const paginationFailed = paginationRetries.length > 0;

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
      <TransactionSubscriptionAlert />
      <TransactionsErrorState
        error={Boolean(error)}
        hasData={Boolean(data)}
        hasTransactions={hasTransactions}
        initiallyLoading={initiallyLoading}
        onInitialRetry={() =>
          Promise.all([confirmed.refetch(), pending.refetch()])
        }
        onRefreshRetry={() => {
          Promise.all([confirmed.refetch(), pending.refetch()]).catch(
            () => undefined,
          );
        }}
      />
      <TransactionsPaginationFailureAlert retries={paginationRetries} />
      {initiallyLoading ? <TransactionsContentSkeleton /> : null}
      {!initiallyLoading && hasTransactions && data ? (
        <TransactionsLoadedContent
          companyId={companyId}
          confirmedLoadNextPage={confirmedPagination.loadNextPage}
          confirmedLoading={confirmed.networkStatus === NetworkStatus.fetchMore}
          confirmedNextToken={confirmed.data?.getTransactions.nextToken}
          confirmedSummary={confirmed.data?.getBalance}
          currencyCode={data.getBalance.currency}
          paginationFailed={paginationFailed}
          pendingLoadNextPage={pendingPagination.loadNextPage}
          pendingLoading={pending.networkStatus === NetworkStatus.fetchMore}
          pendingNextToken={pending.data?.getTransactions.nextToken}
          transactions={transactions}
        />
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
