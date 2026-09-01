import type { ReactElement, ReactNode } from 'react';
import { CloseIcon, WarningIcon } from '../../icons';
import type { VisualAppearance } from '../../internal/styling/visual';
import { AlertDialog } from '../../primitives/AlertDialog/AlertDialog';
import { IconTile } from '../../primitives/IconTile/IconTile';

interface ConfirmationDialogSharedProps {
  /** Visible label for the non-confirming close action. */
  cancelLabel: ReactNode;
  /** Accessible label for the icon-only header close action. */
  closeLabel: string;
  /** Visible label for the confirming action. */
  confirmLabel: ReactNode;
  /** Consequence or decision context announced by the dialog. */
  description: ReactNode;
  /** Prevents the confirming action. Defaults to `false`. */
  disabled?: boolean;
  /** Dims and centres within the nearest existing modal layer. Defaults to `false`. */
  nested?: boolean;
  /** Reports the explicit confirming decision. */
  onConfirm: () => void;
  /** Dialog heading. */
  title: ReactNode;
  /** Semantic confirming action colour. Defaults to `danger`. */
  variant?: 'danger' | 'warning' | 'primary';
}

interface ControlledConfirmationDialogProps {
  /** Current open state. */
  open: boolean;
  /** Called with the next open state. */
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}

interface ReadOnlyConfirmationDialogProps {
  /** Current immutable open state. */
  open: boolean;
  /** Marks controlled state as intentionally immutable. */
  readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}

interface UncontrolledConfirmationDialogProps {
  /** Initial open state. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void;
  open?: never;
  readOnly?: false;
}

interface TriggeredConfirmationDialogProps {
  /** Semantic action content that opens the dialog. */
  trigger: ReactNode;
  /** Visual treatment for the trigger. Defaults to `solid`. */
  triggerAppearance?: VisualAppearance;
  /** Uses the pattern's semantic trigger to coordinate dialog state. */
  triggerless?: false;
}

interface TriggerlessConfirmationDialogProps {
  defaultOpen?: never;
  /** Called with the next externally controlled open state. */
  onOpenChange: (open: boolean) => void;
  /** Current externally controlled open state. */
  open: boolean;
  readOnly?: never;
  trigger?: never;
  triggerAppearance?: never;
  /** Omits the pattern trigger for state controlled by an external action. */
  triggerless: true;
}

/** Props for a controlled, read-only, or uncontrolled confirmation dialog. */
export type ConfirmationDialogProps = ConfirmationDialogSharedProps &
  (
    | (TriggeredConfirmationDialogProps &
        (
          | ControlledConfirmationDialogProps
          | ReadOnlyConfirmationDialogProps
          | UncontrolledConfirmationDialogProps
        ))
    | TriggerlessConfirmationDialogProps
  );

/**
 * Presents a focused explicit decision while retaining focus restoration.
 *
 * @summary consequential decision pattern with safe initial focus
 */
export function ConfirmationDialog({
  cancelLabel,
  closeLabel,
  confirmLabel,
  defaultOpen,
  description,
  disabled = false,
  nested = false,
  onConfirm,
  onOpenChange,
  open,
  readOnly,
  title,
  trigger,
  triggerAppearance,
  triggerless = false,
  variant = 'danger',
}: Readonly<ConfirmationDialogProps>): ReactElement {
  const content = (
    <>
      {triggerless ? null : (
        <AlertDialog.Trigger appearance={triggerAppearance} variant={variant}>
          {trigger}
        </AlertDialog.Trigger>
      )}
      <AlertDialog.Content
        className="breeze-confirmation-dialog max-h-[calc(100dvh-2rem)] w-full max-w-md border-0 border-b-2 border-b-[var(--breeze-border-strong)] p-0 shadow-[0_8px_0_rgb(6_12_24_/_22%)]"
        modalClassName={nested ? 'breeze-modal-nested' : undefined}
        nested={nested}
        overlayClassName={`p-5 ${nested ? 'breeze-modal-overlay-nested' : ''}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--breeze-border)] p-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <IconTile
              bordered={false}
              data-confirmation-icon
              size="sm"
              variant={variant}
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
            variant="secondary"
          >
            <CloseIcon size={20} />
          </AlertDialog.Close>
        </div>
        <AlertDialog.Description className="mb-0 p-4 text-base leading-relaxed sm:p-5">
          {description}
        </AlertDialog.Description>
        <AlertDialog.Actions className="px-4 pb-4 sm:px-5 sm:pb-5">
          <AlertDialog.Close
            appearance="outline"
            autoFocus
            className="text-[var(--breeze-ink)]"
            variant="secondary"
          >
            {cancelLabel}
          </AlertDialog.Close>
          <AlertDialog.Close
            disabled={disabled}
            onAction={onConfirm}
            variant={variant}
          >
            {confirmLabel}
          </AlertDialog.Close>
        </AlertDialog.Actions>
      </AlertDialog.Content>
    </>
  );

  if (triggerless) {
    if (open === undefined || onOpenChange === undefined) {
      throw new Error(
        'Triggerless ConfirmationDialog requires controlled open state.',
      );
    }

    return (
      <AlertDialog.Root onOpenChange={onOpenChange} open={open} triggerless>
        {content}
      </AlertDialog.Root>
    );
  }

  if (open === undefined) {
    return (
      <AlertDialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {content}
      </AlertDialog.Root>
    );
  }

  if (readOnly === true) {
    return (
      <AlertDialog.Root open={open} readOnly>
        {content}
      </AlertDialog.Root>
    );
  }

  if (onOpenChange === undefined) {
    throw new Error('Controlled ConfirmationDialog requires onOpenChange.');
  }

  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      {content}
    </AlertDialog.Root>
  );
}
