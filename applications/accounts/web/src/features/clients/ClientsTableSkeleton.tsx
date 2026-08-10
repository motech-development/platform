import { useTranslation } from 'react-i18next';
import { EntityTableSkeleton } from '../EntityTableSkeleton';

export function ClientsTableSkeleton() {
  const { t } = useTranslation(['clients', 'routing']);

  return (
    <EntityTableSkeleton
      actionLabel={t('Action')}
      columns={{
        actions: 'actions',
        identity: 'avatar',
        primary: 'client',
        secondary: 'email',
        tertiary: 'telephone',
      }}
      identityLabel={t('Client')}
      identityShape="circle"
      loadingLabel={t('Loading clients')}
      loadingText={t('Loading', { ns: 'routing' })}
      rowCount={4}
      rowText={(index) =>
        t('Loading client row {{count}}', { count: index + 1 })
      }
      tableLabel={t('Loading clients table')}
    />
  );
}
