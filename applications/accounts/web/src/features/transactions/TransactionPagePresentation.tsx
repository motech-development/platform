import { Button, LinkButton, StatePanel } from '@motech-development/breeze-ui';
import { AddIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';

export function RecordTransactionLink({ href }: Readonly<{ href: string }>) {
  const { t } = useTranslation('transactions');

  return (
    <LinkButton href={href}>
      <AddIcon />
      {t('Record transaction')}
    </LinkButton>
  );
}

export function TransactionPageHeaderAction({
  hasTransactions,
  initiallyLoading,
  recordTransactionHref,
}: Readonly<{
  hasTransactions: boolean;
  initiallyLoading: boolean;
  recordTransactionHref: string;
}>) {
  if (initiallyLoading) {
    return null;
  }

  if (!hasTransactions) {
    return null;
  }

  return <RecordTransactionLink href={recordTransactionHref} />;
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
