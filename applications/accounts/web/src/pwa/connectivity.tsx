import { Alert, Inline, Typography } from '@motech-development/breeze-ui';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

function subscribe(listener: () => void) {
  window.addEventListener('offline', listener);
  window.addEventListener('online', listener);

  return () => {
    window.removeEventListener('offline', listener);
    window.removeEventListener('online', listener);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );
}

export function ConnectivityStatus() {
  const { t } = useTranslation('pwa');
  const online = useOnlineStatus();

  if (online) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 left-4 z-[45]">
      <Alert
        announcement="polite"
        data-testid="offline-status"
        variant="warning"
      >
        <Inline gap="compact">
          <Typography as="strong">{t('You’re offline')}</Typography>
          <Typography as="span">
            {t(
              'Previously loaded information remains available. Connection required for changes.',
            )}
          </Typography>
        </Inline>
      </Alert>
    </aside>
  );
}
