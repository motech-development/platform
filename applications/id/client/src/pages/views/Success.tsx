import { Card, Typography } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

function Success() {
  const { t } = useTranslation('reset');

  return (
    <Card padding="lg">
      <Typography component="p" variant="p" align="center" margin="none">
        {t('success')}
      </Typography>
    </Card>
  );
}

export default Success;
