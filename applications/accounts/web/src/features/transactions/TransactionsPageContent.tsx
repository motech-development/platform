import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Button, PageHeader, StatePanel } from '@motech-development/breeze-ui';
import { ArrowRightIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';
import { GET_CONFIRMED_TRANSACTIONS } from '../../data/operations';
import { TransactionsContentSkeleton } from '../loading/AccountsPageSkeletons';
import { FinancialSummary } from './FinancialSummary';
import { TransactionLedger } from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
  TransactionPageHeaderAction,
} from './TransactionPagePresentation';

export function TransactionsPageContent({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['transactions', 'routing', 'shell']);
  const { data, error, fetchMore, loading, networkStatus, refetch } = useQuery(
    GET_CONFIRMED_TRANSACTIONS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: {
        count: 100,
        id: companyId,
        status: 'confirmed',
      },
    },
  );

  const initiallyLoading = loading && !data;
  const hasTransactions = Boolean(data?.getTransactions.items.length);
  const recordTransactionHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/record-transaction`;

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
            recordTransactionHref={recordTransactionHref}
          />
        }
        description={t(
          'Review money in and out, attachments, and approval status.',
          { ns: 'routing' },
        )}
        title={t('Accounts', { ns: 'shell' })}
      />
      {error ? (
        <TransactionPageError
          onRetry={refetch}
          title={t('We could not load transactions')}
        />
      ) : null}
      {initiallyLoading ? <TransactionsContentSkeleton /> : null}
      {data?.getTransactions.items.length ? (
        <div className="flex flex-col">
          <FinancialSummary
            balance={data.getBalance.balance}
            currencyCode={data.getBalance.currency}
            vat={data.getBalance.vat}
          />
          <TransactionLedger
            companyId={companyId}
            currencyCode={data.getBalance.currency}
            transactions={data.getTransactions.items}
          />
          {data.getTransactions.nextToken ? (
            <Button
              appearance="text"
              className="mt-4 self-center"
              loading={networkStatus === NetworkStatus.fetchMore}
              onAction={() => {
                fetchMore({
                  variables: { nextToken: data.getTransactions.nextToken },
                }).catch(() => undefined);
              }}
            >
              {t('Load more')}
            </Button>
          ) : null}
        </div>
      ) : null}
      {!initiallyLoading &&
      !error &&
      data?.getTransactions.items.length === 0 ? (
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
