import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  Typography,
  Window,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

function LogIn() {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation('log-in');
  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/my-companies',
      },
    }).catch(() => {});
  };

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
}

export default LogIn;
