import { Card, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const NoTransactions: FC = () => {
  const { t } = useTranslation('accounts');

  return (
    <Card padding="lg">
      <Typography rule align="center" component="h2" variant="h2" margin="lg">
        {t('no-transactions.title')}
      </Typography>

      <Typography align="center" component="p" variant="lead" margin="none">
        {t('no-transactions.description')}
      </Typography>
    </Card>
  );
};

export default memo(NoTransactions);
