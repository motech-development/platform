import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Button, Center } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { GET_PENDING_TRANSACTIONS } from '../../data/operations';
import { LoadingSkeletonRegion } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { TransactionSubscriptionAlert } from './CompanyTransactionSubscription';
import { PendingTransactionsPageHeader } from './PendingTransactionsPageHeader';
import {
  TransactionLedger,
  TransactionLedgerSkeleton,
} from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
} from './TransactionPagePresentation';
import { useTransactionPageReconciliation } from './useTransactionPageReconciliation';

export function PendingTransactionsPageContent({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['transactions', 'routing']);
  const { data, error, fetchMore, loading, networkStatus, refetch } = useQuery(
    GET_PENDING_TRANSACTIONS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: { count: 100, id: companyId, status: 'pending' },
    },
  );
  const initiallyLoading = loading && !data;
  const hasTransactions = (data?.getTransactions.items.length ?? 0) > 0;
  const accountsHref = `/my-companies/accounts/${encodeURIComponent(companyId)}`;
  const recordTransactionHref = `${accountsHref}/pending-transactions/record-transaction`;

  useTransactionPageReconciliation({
    fetchMore,
    networkStatus,
    page: data?.getTransactions,
  });

  return (
    <div
      className="min-w-0"
      data-testid={data ? 'connected-content' : undefined}
    >
      <PendingTransactionsPageHeader
        actions={
          !initiallyLoading && hasTransactions ? (
            <RecordTransactionLink href={recordTransactionHref} />
          ) : null
        }
        backHref={accountsHref}
      />
      <TransactionSubscriptionAlert />
      {error && !data ? (
        <TransactionPageError
          onRetry={refetch}
          title={t('We could not load pending transactions')}
        />
      ) : null}
      {error && data ? (
        <QueryRefreshAlert
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Transactions could not be refreshed. Existing results are still shown.',
          )}
        </QueryRefreshAlert>
      ) : null}
      {initiallyLoading && !error ? (
        <LoadingSkeletonRegion loadingLabel={t('Loading Pending Transactions')}>
          <TransactionLedgerSkeleton pending />
        </LoadingSkeletonRegion>
      ) : null}
      {data ? (
        <>
          <TransactionLedger
            companyId={companyId}
            currencyCode={data.getBalance.currency}
            emptyAction={
              <RecordTransactionLink
                href={recordTransactionHref}
                icon={false}
              />
            }
            pending
            transactions={data.getTransactions.items}
          />
          {data.getTransactions.nextToken ? (
            <Center className="pt-4">
              <Button
                appearance="text"
                loading={networkStatus === NetworkStatus.fetchMore}
                onAction={() => {
                  fetchMore({
                    variables: { nextToken: data.getTransactions.nextToken },
                  }).catch(() => undefined);
                }}
              >
                {t('Load more')}
              </Button>
            </Center>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
