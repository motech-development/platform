import {
  AlertDialog,
  Button,
  IconTile,
  TextField,
} from '@motech-development/breeze-ui';
import { CloseIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { useTranslation } from 'react-i18next';

export function ClientDeleteDialog({
  clientName,
  confirmation,
  confirmationValid,
  deleting,
  onConfirmationChange,
  onDelete,
  onOpenChange,
  open,
}: Readonly<{
  clientName: string;
  confirmation: string;
  confirmationValid: boolean;
  deleting: boolean;
  onConfirmationChange: (value: string) => void;
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>) {
  const { t } = useTranslation('clients');

  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Trigger variant="danger">
        {t('Delete client')}
      </AlertDialog.Trigger>
      <AlertDialog.Content
        className="breeze-confirmation-dialog max-h-[calc(100dvh-2rem)] w-full max-w-md border-0 border-b-2 border-b-[var(--breeze-border-strong)] p-0 shadow-[0_8px_0_rgb(6_12_24_/_22%)]"
        keyboardDismissDisabled={deleting}
        overlayClassName="bg-transparent p-5 forced-colors:bg-transparent"
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
              {t('Delete {{name}}?', { name: clientName })}
            </AlertDialog.Title>
          </div>
          <AlertDialog.Close
            aria-label={t('Close delete confirmation')}
            appearance="ghost"
            className="size-11 min-h-11 border-0 p-0 text-[var(--breeze-ink)]"
            disabled={deleting}
            variant="secondary"
          >
            <CloseIcon size={20} />
          </AlertDialog.Close>
        </div>
        <AlertDialog.Description className="mb-0 p-4 text-base leading-relaxed sm:p-5">
          {t('The client will be removed. Existing transactions will remain.')}
        </AlertDialog.Description>
        <div className="px-4 pb-4 sm:px-5">
          <TextField.Root
            invalid={confirmation.length > 0 && !confirmationValid}
            onChange={onConfirmationChange}
            value={confirmation}
          >
            <TextField.Label>
              {t('Type {{name}} to confirm', { name: clientName })}
            </TextField.Label>
            <TextField.Input autoComplete="off" />
            <TextField.Error>
              {t('The client name must match exactly.')}
            </TextField.Error>
          </TextField.Root>
        </div>
        <AlertDialog.Actions className="px-4 pb-4 sm:px-5 sm:pb-5">
          <AlertDialog.Close
            appearance="outline"
            autoFocus
            className="text-[var(--breeze-ink)]"
            disabled={deleting}
            variant="secondary"
          >
            {t('Cancel')}
          </AlertDialog.Close>
          <Button
            disabled={!confirmationValid || deleting}
            loading={deleting}
            onAction={onDelete}
            variant="danger"
          >
            {t('Permanently delete client')}
          </Button>
        </AlertDialog.Actions>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
