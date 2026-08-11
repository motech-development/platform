import {
  AlertDialog,
  Button,
  Stack,
  TextField,
} from '@motech-development/breeze-ui';
import { useState } from 'react';
import { exactEntityNameSchema } from '../entity-details';

export function EntityDeleteDialog({
  cancelLabel,
  confirmationError,
  confirmationLabel,
  confirmLabel,
  deleting,
  description,
  entityName,
  onDelete,
  title,
  triggerLabel,
}: Readonly<{
  cancelLabel: string;
  confirmationError: string;
  confirmationLabel: string;
  confirmLabel: string;
  deleting: boolean;
  description: string;
  entityName: string;
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
      <AlertDialog.Content keyboardDismissDisabled={deleting}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description>{description}</AlertDialog.Description>
        <Stack gap="lg">
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
            <AlertDialog.Close appearance="outline" disabled={deleting}>
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
