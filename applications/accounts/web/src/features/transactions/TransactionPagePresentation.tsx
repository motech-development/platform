import {
  Button,
  Inline,
  LinkButton,
  StatePanel,
} from '@motech-development/breeze-ui';
import { AddIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

const WIDE_ACTIONS_QUERY = '(min-width: 73.8125rem)';

function getActionMediaQuery() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return undefined;
  }

  return window.matchMedia(WIDE_ACTIONS_QUERY);
}

function subscribeToActionLayout(listener: () => void) {
  const mediaQuery = getActionMediaQuery();

  if (!mediaQuery) {
    return () => undefined;
  }

  mediaQuery.addEventListener('change', listener);

  return () => mediaQuery.removeEventListener('change', listener);
}

function getWideActionLayout() {
  return getActionMediaQuery()?.matches ?? false;
}

function getServerActionLayout() {
  return false;
}

function useWideActionLayout() {
  return useSyncExternalStore(
    subscribeToActionLayout,
    getWideActionLayout,
    getServerActionLayout,
  );
}

export function RecordTransactionLink({
  className,
  href,
  icon = true,
}: Readonly<{ className?: string; href: string; icon?: boolean }>) {
  const { t } = useTranslation('transactions');

  return (
    <LinkButton className={className} href={href}>
      {icon ? <AddIcon /> : null}
      {t('Record transaction')}
    </LinkButton>
  );
}

export function TransactionPageHeaderAction({
  hasTransactions,
  initiallyLoading,
  pendingTransactionsHref,
  recordTransactionHref,
}: Readonly<{
  hasTransactions: boolean;
  initiallyLoading: boolean;
  pendingTransactionsHref?: string;
  recordTransactionHref: string;
}>) {
  const { t } = useTranslation('transactions');
  const wideActionLayout = useWideActionLayout();

  if (initiallyLoading) {
    return null;
  }

  if (!hasTransactions) {
    return null;
  }

  const pendingTransactionsLink = pendingTransactionsHref ? (
    <LinkButton appearance="outline" href={pendingTransactionsHref}>
      {t('View pending')}
    </LinkButton>
  ) : null;
  const recordTransactionLink = (
    <RecordTransactionLink href={recordTransactionHref} />
  );

  return (
    <Inline
      align="stretch"
      className="w-full flex-col lg:w-auto lg:flex-row lg:items-center"
      gap="compact"
      wrap={false}
    >
      {wideActionLayout ? pendingTransactionsLink : recordTransactionLink}
      {wideActionLayout ? recordTransactionLink : pendingTransactionsLink}
    </Inline>
  );
}

export function TransactionFormUnavailable({
  loading,
  onRetry,
}: Readonly<{ loading: boolean; onRetry: () => void }>) {
  const { t } = useTranslation(['transactions', 'routing']);

  return (
    <StatePanel
      action={
        <Button disabled={loading} onAction={onRetry}>
          {t('Try again', { ns: 'routing' })}
        </Button>
      }
      description={t('Transaction settings could not be loaded.')}
      icon={<span aria-hidden="true">!</span>}
      title={t('Transaction form unavailable')}
      variant="danger"
    />
  );
}

export function TransactionPageError({
  onRetry,
  title,
}: Readonly<{
  onRetry: () => Promise<unknown>;
  title: string;
}>) {
  const { t } = useTranslation('routing');

  return (
    <StatePanel
      action={
        <Button
          onAction={() => {
            onRetry().catch(() => undefined);
          }}
        >
          {t('Try again')}
        </Button>
      }
      description={t('Check your connection, then try again.')}
      icon={<WarningIcon />}
      title={title}
      variant="danger"
    />
  );
}
