import { Card, Typography } from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const Success: FC = () => {
  const { t } = useTranslation('reset');

  return (
    <Card padding="lg">
      <Typography component="p" variant="p" align="center" margin="none">
        {t('success')}
      </Typography>
    </Card>
  );
};

export default memo(Success);
