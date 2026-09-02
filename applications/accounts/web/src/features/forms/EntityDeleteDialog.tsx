import {
  AlertDialog,
  Button,
  IconTile,
  Stack,
  TextField,
} from '@motech-development/breeze-ui';
import { CloseIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { useState } from 'react';
import { exactEntityNameSchema } from '../entity-details';

export function EntityDeleteDialog({
  cancelLabel,
  closeLabel,
  confirmationError,
  confirmationLabel,
  confirmLabel,
  deleting,
  description,
  entityName,
  nested = false,
  onDelete,
  title,
  triggerLabel,
}: Readonly<{
  cancelLabel: string;
  closeLabel: string;
  confirmationError: string;
  confirmationLabel: string;
  confirmLabel: string;
  deleting: boolean;
  description: string;
  entityName: string;
  nested?: boolean;
  onDelete: () => Promise<boolean>;
  title: string;
  triggerLabel: string;
}>) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const confirmationValid =
    exactEntityNameSchema(entityName).safeParse(confirmation).success;

  return (
    <AlertDialog.Root
      onOpenChange={(nextOpen) => {
        if (!nextOpen && deleting) return;
        setOpen(nextOpen);
        if (!nextOpen) setConfirmation('');
      }}
      open={open}
    >
      <AlertDialog.Trigger variant="danger">{triggerLabel}</AlertDialog.Trigger>
      <AlertDialog.Content
        className="breeze-confirmation-dialog max-h-[calc(100dvh-2rem)] w-full max-w-md border-0 border-b-2 border-b-[var(--breeze-border-strong)] p-0 shadow-[0_8px_0_rgb(6_12_24_/_22%)]"
        keyboardDismissDisabled={deleting}
        nested={nested}
        overlayClassName="p-5"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--breeze-border)] p-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <IconTile
              bordered={false}
              data-confirmation-icon
              size="sm"
              variant="danger"
            >
              <WarningIcon size={20} />
            </IconTile>
            <AlertDialog.Title className="mb-0 text-2xl leading-[1.2]">
              {title}
            </AlertDialog.Title>
          </div>
          <AlertDialog.Close
            aria-label={closeLabel}
            appearance="ghost"
            className="size-11 min-h-11 border-0 p-0 text-[var(--breeze-ink)]"
            disabled={deleting}
            variant="secondary"
          >
            <CloseIcon size={20} />
          </AlertDialog.Close>
        </div>
        <AlertDialog.Description className="mb-0 px-4 pt-4 text-base leading-relaxed sm:px-5 sm:pt-5">
          {description}
        </AlertDialog.Description>
        <Stack className="p-4 sm:p-5" gap="lg">
          <TextField.Root
            invalid={confirmation.length > 0 && !confirmationValid}
            onChange={setConfirmation}
            value={confirmation}
          >
            <TextField.Label>{confirmationLabel}</TextField.Label>
            <TextField.Input autoComplete="off" />
            <TextField.Error>{confirmationError}</TextField.Error>
          </TextField.Root>
          <AlertDialog.Actions>
            <AlertDialog.Close
              appearance="outline"
              autoFocus
              disabled={deleting}
            >
              {cancelLabel}
            </AlertDialog.Close>
            <Button
              disabled={!confirmationValid || deleting}
              loading={deleting}
              onAction={() => {
                onDelete()
                  .then((deleted) => {
                    if (!deleted) return;
                    setOpen(false);
                    setConfirmation('');
                  })
                  .catch(() => undefined);
              }}
              variant="danger"
            >
              {confirmLabel}
            </Button>
          </AlertDialog.Actions>
        </Stack>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
