import { Link, PageHeader } from '@motech-development/breeze-ui';
import { ArrowLeftIcon } from '@motech-development/breeze-ui/icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function PendingTransactionsPageHeader({
  actions,
  backHref,
}: Readonly<{ actions?: ReactNode; backHref: string }>) {
  const { t } = useTranslation('transactions');

  return (
    <PageHeader
      actions={actions}
      back={
        <Link href={backHref}>
          <ArrowLeftIcon /> {t('Back')}
        </Link>
      }
      description={t(
        'Review transactions before they affect the confirmed balance.',
      )}
      title={t('Pending transactions')}
    />
  );
}
