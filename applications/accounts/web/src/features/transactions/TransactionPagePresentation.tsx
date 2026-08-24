import {
  Button,
  ButtonGroup,
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

  const pendingTransactionsLink = pendingTransactionsHref ? (
    <LinkButton appearance="outline" href={pendingTransactionsHref}>
      {t('View pending')}
    </LinkButton>
  ) : null;
  const recordTransactionLink = (
    <RecordTransactionLink href={recordTransactionHref} />
  );

  return (
    <ButtonGroup
      className="w-full sm:w-auto"
      orientation={{ base: 'verticalReverse', sm: 'horizontal' }}
    >
      {pendingTransactionsLink}
      {recordTransactionLink}
    </ButtonGroup>
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
      icon={<WarningIcon />}
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
