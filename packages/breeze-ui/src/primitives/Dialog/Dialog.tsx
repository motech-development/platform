import type { ReactElement, ReactNode } from 'react';
import { createElement } from 'react';
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components/Dialog';
import {
  SharedModalContent,
  type SharedModalContentProps,
  SharedOverlayClose,
  type SharedOverlayCloseProps,
  SharedOverlayDescription,
  type SharedOverlayDescriptionProps,
  SharedOverlayTitle,
  type SharedOverlayTitleProps,
  SharedOverlayTrigger,
  type SharedOverlayTriggerProps,
} from '../../internal/react-aria/OverlayParts';
import { useBreezeContext } from '../../provider/BreezeContext';

interface DialogRootSharedProps {
  /** Trigger and content parts. */ children: ReactNode;
}
interface ControlledDialogRootProps {
  /** Current open state. */ open: boolean;
  /** Called with the next open state. */ onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}
interface ReadOnlyDialogRootProps {
  /** Current immutable open state. */ open: boolean;
  /** Marks controlled state as intentionally immutable. */ readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}
interface UncontrolledDialogRootProps {
  /** Initial open state. Defaults to `false`. */ defaultOpen?: boolean;
  /** Called with the next open state. */ onOpenChange?: (
    open: boolean,
  ) => void;
  open?: never;
  readOnly?: false;
}
/** Props for controlled, read-only, or uncontrolled dialog state. */
export type DialogRootProps = DialogRootSharedProps &
  (
    | ControlledDialogRootProps
    | ReadOnlyDialogRootProps
    | UncontrolledDialogRootProps
  );
/** Props for the dialog trigger action. */ export type DialogTriggerProps =
  SharedOverlayTriggerProps;
/** Props for modal dialog content. */ export interface DialogContentProps
  extends Omit<SharedModalContentProps, 'modalState'> {
  /** Allows pointer dismissal outside the dialog. Defaults to `true`. */ dismissible?: boolean;
  /** Prevents Escape dismissal. Defaults to `false`. */ keyboardDismissDisabled?: boolean;
}
/** Props for the required accessible dialog title. */ export type DialogTitleProps =
  SharedOverlayTitleProps;
/** Props for the required accessible dialog description. */ export type DialogDescriptionProps =
  SharedOverlayDescriptionProps;
/** Props for a semantic dialog close action. */ export type DialogCloseProps =
  SharedOverlayCloseProps;

/** Coordinates dialog trigger, open state, focus, and restoration. */
export function Root({
  defaultOpen,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ...props
}: Readonly<DialogRootProps>): ReactElement {
  useBreezeContext();
  return createElement(AriaDialogTrigger, {
    ...props,
    defaultOpen,
    isOpen: open,
    onOpenChange,
  });
}

/**
 * Accessible compound modal dialog primitive.
 *
 * @summary modal content with focus containment and restoration
 */
export const Dialog = {
  /** Semantic action that closes the dialog and restores trigger focus. */
  Close: SharedOverlayClose,
  /** Modal surface, focus scope, backdrop, and dismissal boundary. */
  Content: SharedModalContent,
  /** Required accessible dialog description. */
  Description: SharedOverlayDescription,
  /** Controlled, read-only, or uncontrolled open-state coordinator. */
  Root,
  /** Required accessible dialog title. */
  Title: SharedOverlayTitle,
  /** Semantic action that opens the dialog. */
  Trigger: SharedOverlayTrigger,
};
