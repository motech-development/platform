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
  onDiscard,
  onOpenChange,
  open,
  title,
  trigger,
}: Readonly<{
  blocker: NavigationBlocker;
  closeLabel: string;
  description: string;
  onDiscard: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
  trigger: string;
}>) {
  const { t } = useTranslation('companies');
  const discardConfirmed = useRef(false);

  return (
    <span hidden>
      <ConfirmationDialog
        cancelLabel={t('Keep editing')}
        closeLabel={closeLabel}
        confirmLabel={t('Discard changes')}
        description={description}
        onConfirm={() => {
          discardConfirmed.current = true;
          onDiscard();
          if (blocker.status === 'blocked') {
            blocker.proceed?.();
          }
        }}
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
        trigger={trigger}
        variant="warning"
      />
    </span>
  );
}
