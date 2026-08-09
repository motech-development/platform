import { Button, StatePanel } from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';

export function QueryFailureState({
  onRetry,
  title,
}: Readonly<{ onRetry: () => void; title: string }>) {
  const { t } = useTranslation('routing');

  return (
    <StatePanel
      action={<Button onAction={onRetry}>{t('Try again')}</Button>}
      description={t('Check your connection, then try again.')}
      icon={<WarningIcon />}
      title={title}
      variant="danger"
    />
  );
}
