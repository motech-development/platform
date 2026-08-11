import { Button } from '@motech-development/breeze-ui';
import { AddIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function AddClientAction({
  companyId,
  icon = true,
}: Readonly<{ companyId: string; icon?: boolean }>) {
  const { t } = useTranslation('clients');
  const navigate = useNavigate();

  return (
    <Button
      aria-label={t('Add a new client')}
      onAction={() => {
        navigate({
          params: { companyId },
          to: '/my-companies/clients/$companyId/add-client',
        }).catch(() => undefined);
      }}
    >
      {icon ? <AddIcon /> : null}
      {t('Add client')}
    </Button>
  );
}
