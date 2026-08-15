import {
  Button,
  Inline,
  LinkButton,
  StatePanel,
} from '@motech-development/breeze-ui';
import {
  AddIcon,
  CalendarIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';

export function RecordTransactionLink({
  className,
  href,
}: Readonly<{ className?: string; href: string }>) {
  const { t } = useTranslation('transactions');

  return (
    <LinkButton className={className} href={href}>
      <AddIcon />
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
    <Inline gap="sm" wrap>
      <RecordTransactionLink
        className="sm:order-2"
        href={recordTransactionHref}
      />
      {pendingTransactionsHref ? (
        <LinkButton
          appearance="outline"
          className="sm:order-1"
          href={pendingTransactionsHref}
        >
          <CalendarIcon />
          {t('View Pending Transactions')}
        </LinkButton>
      ) : null}
    </Inline>
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
