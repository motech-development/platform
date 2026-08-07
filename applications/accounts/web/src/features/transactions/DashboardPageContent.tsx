import { useQuery } from '@apollo/client/react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  IconTile,
  PageHeader,
  SectionHeader,
  Skeleton,
  StatePanel,
  Surface,
  Typography,
} from '@motech-development/breeze-ui';
import {
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAccountsOwnerId } from '../../auth/owner';
import { GET_COMPANY_DASHBOARD } from '../../data/operations';
import { OverviewContentSkeleton } from '../loading/AccountsPageSkeletons';
import { CompanyTransactionSubscription } from './CompanyTransactionSubscription';
import { FinancialSummary } from './FinancialSummary';
import { TransactionLedger } from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
  TransactionPageHeaderAction,
} from './TransactionPagePresentation';

function OverviewAttentionPanel({
  missingAttachmentCount,
}: Readonly<{ missingAttachmentCount: number }>) {
  const { t } = useTranslation('overview');
  const needsAttention = missingAttachmentCount > 0;
  let attentionDescription = t('Recent transactions have source documents');

  if (needsAttention) {
    attentionDescription = t(
      missingAttachmentCount === 1
        ? '{{count}} recent transaction has no invoice or receipt'
        : '{{count}} recent transactions have no invoice or receipt',
      { count: missingAttachmentCount },
    );
  }

  return (
    <aside
      aria-label={t('Needs attention')}
      className="self-start bg-[var(--breeze-shell)] text-[var(--breeze-ink-inverse)]"
    >
      <div className="flex items-start gap-4 px-5 pb-4 pt-5">
        <IconTile size="md" variant={needsAttention ? 'warning' : 'success'}>
          {needsAttention ? <WarningIcon /> : <CheckIcon />}
        </IconTile>
        <div className="grid gap-1">
          <Typography as="h2" colour="inverse" level="h3">
            {t('Needs attention')}
          </Typography>
          <Typography colour="inverse-muted">{attentionDescription}</Typography>
        </div>
      </div>
      <div className="grid gap-1 border-t border-[var(--breeze-shell-soft)] px-5 py-4">
        <Typography as="strong" colour="inverse" weight="semibold">
          {needsAttention
            ? t('Review source documents')
            : t('Recent records are complete')}
        </Typography>
        <Typography as="span" colour="inverse-muted">
          {needsAttention
            ? t('Missing evidence is marked in the transaction list')
            : t('No missing evidence in this overview')}
        </Typography>
      </div>
    </aside>
  );
}

export function DashboardPageContent({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['overview', 'routing', 'transactions']);
  const { user } = useAuth0();
  const ownerId = useAccountsOwnerId();
  const { data, error, loading, refetch } = useQuery(GET_COMPANY_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { count: 5, id: companyId, status: 'confirmed' },
  });
  const initiallyLoading = loading && !data;
  const hasTransactions = Boolean(data?.getTransactions.items.length);
  const firstName =
    user?.given_name || user?.name?.trim().split(/\s+/)[0] || t('there');
  const recordTransactionHref = `/my-companies/dashboard/${encodeURIComponent(companyId)}/record-transaction`;

  return (
    <CompanyTransactionSubscription companyId={companyId} owner={ownerId}>
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
            'Your financial position and the work that needs attention.',
            { ns: 'routing' },
          )}
          title={
            initiallyLoading ? (
              <Skeleton
                as="span"
                className="block h-[2.8rem] w-64 max-w-full"
              />
            ) : (
              data?.getCompany.name ??
              t('Good afternoon, {{firstName}}', { firstName })
            )
          }
        />
        {error ? (
          <TransactionPageError
            onRetry={refetch}
            title={t('We could not load your overview')}
          />
        ) : null}
        {initiallyLoading ? <OverviewContentSkeleton /> : null}
        {!initiallyLoading &&
        !error &&
        data?.getTransactions.items.length === 0 ? (
          <StatePanel
            action={<RecordTransactionLink href={recordTransactionHref} />}
            description={t(
              'Record your first transaction to start building your financial overview.',
            )}
            icon={<InfoIcon />}
            title={t('No financial activity yet')}
          />
        ) : null}
        {data?.getTransactions.items.length ? (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]">
            <div className="flex min-w-0 flex-col">
              <FinancialSummary
                balance={data.getBalance.balance}
                currencyCode={data.getBalance.currency}
                fullWidth
                vat={data.getBalance.vat}
              />
              <Surface className="min-w-0" padding="none">
                <SectionHeader
                  action={
                    <Link
                      className="inline-flex items-center gap-1.5 font-bold text-[var(--breeze-primary)] underline decoration-1 underline-offset-[0.2em]"
                      params={{ companyId }}
                      to="/my-companies/accounts/$companyId"
                    >
                      {t('View all')}
                      <ArrowRightIcon />
                    </Link>
                  }
                  description={t('Latest confirmed activity')}
                  title={t('Recent transactions')}
                />
                <TransactionLedger
                  compact
                  companyId={companyId}
                  currencyCode={data.getBalance.currency}
                  transactions={data.getTransactions.items.slice(0, 5)}
                />
              </Surface>
            </div>
            <OverviewAttentionPanel
              missingAttachmentCount={
                data.getTransactions.items.filter(
                  (transaction) => !transaction.attachment,
                ).length
              }
            />
          </div>
        ) : null}
      </div>
    </CompanyTransactionSubscription>
  );
}
