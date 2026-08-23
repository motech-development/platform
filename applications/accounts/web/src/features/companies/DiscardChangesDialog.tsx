import { ConfirmationDialog } from '@motech-development/breeze-ui';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

type NavigationBlocker = {
  proceed?: () => void;
  reset?: () => void;
  status: string;
};

export function DiscardChangesDialog({
  blocker,
  closeLabel,
  description,
  nested,
  onDiscard,
  onOpenChange,
  open,
  title,
}: Readonly<{
  blocker: NavigationBlocker;
  closeLabel: string;
  description: string;
  nested?: boolean;
  onDiscard: () => boolean | void | Promise<boolean | void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}>) {
  const { t } = useTranslation('companies');
  const discardConfirmed = useRef(false);
  const confirmDiscard = () => {
    if (discardConfirmed.current) return;

    discardConfirmed.current = true;

    Promise.resolve()
      .then(onDiscard)
      .then((discarded) => {
        if (discarded === false) {
          discardConfirmed.current = false;
          if (blocker.status === 'blocked') blocker.reset?.();
          return;
        }

        if (blocker.status === 'blocked') {
          blocker.proceed?.();
        }
      })
      .catch(() => {
        discardConfirmed.current = false;
        if (blocker.status === 'blocked') blocker.reset?.();
      });
  };

  return (
    <ConfirmationDialog
      cancelLabel={t('Keep editing')}
      closeLabel={closeLabel}
      confirmLabel={t('Discard changes')}
      description={description}
      nested={nested}
      onConfirm={confirmDiscard}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (nextOpen) {
          discardConfirmed.current = false;
          return;
        }

        queueMicrotask(() => {
          if (!discardConfirmed.current && blocker.status === 'blocked') {
            blocker.reset?.();
          }
        });
      }}
      open={open}
      title={title}
      triggerless
      variant="warning"
    />
  );
}
