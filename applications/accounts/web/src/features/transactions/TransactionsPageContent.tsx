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
  // Pending is the explicit status-bearing snapshot and wins while the two
  // eventually consistent status indexes overlap.
  const transactionsById = new Map<string, LedgerTransaction>([
    ...(confirmed.data?.getTransactions.items ?? []).map(
      (transaction): [string, LedgerTransaction] => [
        transaction.id,
        {
          ...transaction,
          status: 'confirmed',
        },
      ],
    ),
    ...(pending.data?.getTransactions.items ?? []).map(
      (transaction): [string, LedgerTransaction] => [
        transaction.id,
        transaction,
      ],
    ),
  ]);

  const transactions = [...transactionsById.values()].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
  const hasTransactions = transactions.length > 0;
  const recordTransactionHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/record-transaction`;
  const pendingTransactionsHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/pending-transactions`;
  const data = confirmed.data ?? pending.data;
  const error = confirmed.error ?? pending.error;

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
        <QueryRefreshAlert
          onRetry={() => {
            Promise.all([confirmed.refetch(), pending.refetch()]).catch(
              () => undefined,
            );
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Transactions could not be refreshed. Existing results are still shown.',
          )}
        </QueryRefreshAlert>
      ) : null}
      {initiallyLoading ? <TransactionsContentSkeleton /> : null}
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
          {confirmed.data?.getTransactions.nextToken ||
          pending.data?.getTransactions.nextToken ? (
            <Button
              appearance="text"
              className="mt-4 self-center"
              loading={
                confirmed.networkStatus === NetworkStatus.fetchMore ||
                pending.networkStatus === NetworkStatus.fetchMore
              }
              onAction={() => {
                Promise.all([
                  confirmed.data?.getTransactions.nextToken
                    ? confirmed.fetchMore({
                        variables: {
                          nextToken: confirmed.data.getTransactions.nextToken,
                        },
                      })
                    : Promise.resolve(),
                  pending.data?.getTransactions.nextToken
                    ? pending.fetchMore({
                        variables: {
                          nextToken: pending.data.getTransactions.nextToken,
                        },
                      })
                    : Promise.resolve(),
                ]).catch(() => undefined);
              }}
            >
              {t('Load more')}
            </Button>
          ) : null}
        </div>
      ) : null}
      {!initiallyLoading &&
      !error &&
      confirmed.data &&
      pending.data &&
      !hasTransactions ? (
        <StatePanel
          action={<RecordTransactionLink href={recordTransactionHref} />}
          description={t('Record a confirmed sale for the business.')}
          icon={<ArrowRightIcon />}
          title={t('No transactions yet')}
        />
      ) : null}
    </div>
  );
}
