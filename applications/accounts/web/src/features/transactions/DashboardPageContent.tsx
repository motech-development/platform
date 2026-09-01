import { useQuery } from '@apollo/client/react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  IconTile,
  Inline,
  Link,
  PageHeader,
  SectionHeader,
  Separator,
  Skeleton,
  Stack,
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
import { useTranslation } from 'react-i18next';
import { useAccountsOwnerId } from '../../auth/owner';
import { GET_COMPANY_DASHBOARD } from '../../data/operations';
import { OverviewContentSkeleton } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import {
  CompanyTransactionSubscription,
  TransactionSubscriptionAlert,
} from './CompanyTransactionSubscription';
import { FinancialSummary } from './FinancialSummary';
import { combineTransactions } from './transaction-list';
import { TransactionLedger } from './TransactionLedger';
import {
  RecordTransactionLink,
  TransactionPageError,
  TransactionPageHeaderAction,
} from './TransactionPagePresentation';

type GreetingKey =
  | 'Good afternoon, {{firstName}}'
  | 'Good evening, {{firstName}}'
  | 'Good morning, {{firstName}}';

const dayPeriodFormatter = new Intl.DateTimeFormat('en-GB', {
  dayPeriod: 'long',
  hour: 'numeric',
  hourCycle: 'h12',
});

function getGreetingKey(now = new Date()): GreetingKey {
  const dayPeriod = dayPeriodFormatter
    .formatToParts(now)
    .find(({ type }) => type === 'dayPeriod')?.value;

  if (dayPeriod?.includes('afternoon') || dayPeriod === 'noon') {
    return 'Good afternoon, {{firstName}}';
  }

  if (dayPeriod?.includes('evening') || dayPeriod?.includes('night')) {
    return 'Good evening, {{firstName}}';
  }

  return 'Good morning, {{firstName}}';
}

function OverviewAttentionPanel({
  companyId,
  hasPendingTransactions,
}: Readonly<{ companyId: string; hasPendingTransactions: boolean }>) {
  const { t } = useTranslation('overview');
  const pendingTransactionsHref = `/my-companies/accounts/${encodeURIComponent(companyId)}/pending-transactions`;

  return (
    <aside aria-label={t('Needs attention')} className="self-start">
      <Surface border="none" padding="none" tone="inverse">
        <Inline align="start" className="px-5 pb-4 pt-5" gap="md">
          <IconTile
            size="md"
            variant={hasPendingTransactions ? 'warning' : 'success'}
          >
            {hasPendingTransactions ? <WarningIcon /> : <CheckIcon />}
          </IconTile>
          <Stack gap="xs">
            <Typography as="h2" colour="inverse" level="h3">
              {t('Needs attention')}
            </Typography>
            <Typography colour="inverse-muted">
              {hasPendingTransactions
                ? t('Pending transactions are waiting for review')
                : t('No pending transactions are waiting for review')}
            </Typography>
          </Stack>
        </Inline>
        <Separator className="opacity-20" decorative tone="strong" />
        <Link
          className="block px-5 py-4 no-underline"
          href={pendingTransactionsHref}
          variant="inverse"
        >
          <Inline gap="md" justify="between" wrap={false}>
            <Stack className="min-w-0" gap="xs">
              <Typography as="strong" colour="inverse" weight="semibold">
                {t('View pending transactions')}
              </Typography>
              <Typography as="span" colour="inverse-muted">
                {hasPendingTransactions
                  ? t('Review them before they affect your balance')
                  : t('All recorded transactions have been reviewed')}
              </Typography>
            </Stack>
            <ArrowRightIcon aria-hidden="true" className="shrink-0" />
          </Inline>
        </Link>
      </Surface>
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
    variables: {
      count: 5,
      id: companyId,
      pendingStatus: 'pending',
      status: 'confirmed',
    },
  });
  const initiallyLoading = loading && !data;
  const transactions = combineTransactions(
    data?.getTransactions.items,
    data?.pendingTransactions.items,
  ).slice(0, 5);
  const hasTransactions = transactions.length > 0;
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
              t(getGreetingKey(), { firstName })
            )
          }
        />
        <TransactionSubscriptionAlert />
        {error && !data ? (
          <TransactionPageError
            onRetry={refetch}
            title={t('We could not load your overview')}
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
              'Overview could not be refreshed. Existing results are still shown.',
            )}
          </QueryRefreshAlert>
        ) : null}
        {initiallyLoading ? <OverviewContentSkeleton /> : null}
        {!initiallyLoading && data && !hasTransactions ? (
          <StatePanel
            action={<RecordTransactionLink href={recordTransactionHref} />}
            description={t(
              'Record your first transaction to start building your financial overview.',
            )}
            icon={<InfoIcon />}
            title={t('No financial activity yet')}
          />
        ) : null}
        {data && hasTransactions ? (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]">
            <Stack className="min-w-0" gap="none">
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
                      className="inline-flex items-center gap-1.5 font-bold"
                      href={`/my-companies/accounts/${encodeURIComponent(companyId)}`}
                    >
                      {t('View all')}
                      <ArrowRightIcon />
                    </Link>
                  }
                  description={t('Latest confirmed and pending activity')}
                  title={t('Recent transactions')}
                />
                <TransactionLedger
                  compact
                  companyId={companyId}
                  currencyCode={data.getBalance.currency}
                  origin="dashboard"
                  transactions={transactions}
                />
              </Surface>
            </Stack>
            <OverviewAttentionPanel
              companyId={companyId}
              hasPendingTransactions={data.pendingTransactions.items.length > 0}
            />
          </div>
        ) : null}
      </div>
    </CompanyTransactionSubscription>
  );
}
