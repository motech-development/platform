import { useAuth } from '@motech-development/auth';
import {
  Button,
  Card,
  Typography,
  Window,
} from '@motech-development/breeze-ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LogIn: FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation('log-in');
  const login = () =>
    loginWithRedirect({
      appState: {
        targetUrl: '/my-companies',
      },
    });

  return (
    <Window>
      <Typography align="center" component="h1" variant="h1" margin="lg">
        {t('global:app-name')}
      </Typography>

      <Card padding="lg">
        <Typography rule align="center" component="h2" variant="h2">
          {t('welcome')}
        </Typography>

        <Typography align="center" component="p" variant="lead" margin="none">
          {t('intro')}
        </Typography>
      </Card>

      <Button block type="button" size="lg" onClick={login}>
        {t('log-in')}
      </Button>
    </Window>
  );
};

export default LogIn;
