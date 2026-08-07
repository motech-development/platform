import {
  Button,
  Inline,
  Logo,
  Stack,
  Surface,
  Typography,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

export interface AuthenticationPanelProps {
  loading?: boolean;
  onSignIn?: () => void;
}

export function AuthenticationPanel({
  loading = false,
  onSignIn,
}: Readonly<AuthenticationPanelProps>) {
  const { t } = useTranslation(['authentication', 'shell']);

  return (
    <main>
      <Surface
        as="section"
        border="none"
        className="grid min-h-dvh place-items-center"
        padding="xl"
        tone="inverse"
      >
        <Stack className="w-full max-w-md" gap="xl">
          <Inline gap="sm" justify="center">
            <Logo size="lg" />
            <Typography as="strong" colour="inverse" level="h4">
              {t('Accounts', { ns: 'shell' })}
            </Typography>
          </Inline>
          <Surface
            aria-labelledby="welcome-title"
            as="section"
            border="strong"
            padding="xxl"
          >
            <Stack align="center" gap="xl">
              <Stack align="center" gap="control">
                <Typography
                  align="center"
                  as="h1"
                  id="welcome-title"
                  level="h2"
                >
                  {t('Welcome back')}
                </Typography>
                <Typography align="center" className="max-w-96" colour="muted">
                  {t(
                    'Sign in to manage your company accounts, clients, transactions, and reports.',
                  )}
                </Typography>
              </Stack>
              <Button
                className="min-w-35"
                disabled={!onSignIn}
                loading={loading}
                onAction={onSignIn}
              >
                {t('Sign in securely')}
              </Button>
            </Stack>
          </Surface>
        </Stack>
      </Surface>
    </main>
  );
}
