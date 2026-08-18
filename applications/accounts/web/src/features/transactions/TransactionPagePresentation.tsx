import {
  Button,
  Inline,
  LinkButton,
  StatePanel,
} from '@motech-development/breeze-ui';
import { AddIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';

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

  if (initiallyLoading) {
    return null;
  }

  if (!hasTransactions) {
    return null;
  }

  return (
    <Inline
      align="stretch"
      className="w-full flex-col lg:w-auto lg:flex-row lg:items-center"
      gap="compact"
      wrap={false}
    >
      {pendingTransactionsHref ? (
        <LinkButton
          appearance="outline"
          className="order-2 w-full lg:order-1 lg:w-auto"
          href={pendingTransactionsHref}
        >
          {t('View pending')}
        </LinkButton>
      ) : null}
      <RecordTransactionLink
        className="order-1 w-full lg:order-2 lg:w-auto"
        href={recordTransactionHref}
      />
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
