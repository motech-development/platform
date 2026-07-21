import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components/Dialog';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
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

const alertDialogActions = tv({
  base: 'flex flex-col-reverse items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-end [&>*]:w-full sm:[&>*]:w-auto',
});

interface AlertDialogRootSharedProps {
  /** Trigger and alert content. */ children: ReactNode;
}
interface ControlledAlertDialogRootProps {
  /** Current open state. */ open: boolean;
  /** Called with the next open state. */ onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}
interface ReadOnlyAlertDialogRootProps {
  /** Current immutable open state. */ open: boolean;
  /** Marks controlled state immutable. */ readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}
interface UncontrolledAlertDialogRootProps {
  /** Initial open state. */ defaultOpen?: boolean;
  /** Called with the next open state. */ onOpenChange?: (
    open: boolean,
  ) => void;
  open?: never;
  readOnly?: false;
}
/** Props for controlled, read-only, or uncontrolled alert-dialog state. */ export type AlertDialogRootProps =
  AlertDialogRootSharedProps &
    (
      | ControlledAlertDialogRootProps
      | ReadOnlyAlertDialogRootProps
      | UncontrolledAlertDialogRootProps
    );
/** Props for the alert-dialog trigger. */ export type AlertDialogTriggerProps =
  SharedOverlayTriggerProps;
/** Props for alert-dialog content requiring explicit action. */ export type AlertDialogContentProps =
  Omit<SharedModalContentProps, 'dismissible' | 'modalState' | 'role'>;
/** Props for the required alert-dialog title. */ export type AlertDialogTitleProps =
  SharedOverlayTitleProps;
/** Props for the required alert-dialog consequence description. */ export type AlertDialogDescriptionProps =
  SharedOverlayDescriptionProps;
/** Props for an explicit alert-dialog close action. */ export type AlertDialogCloseProps =
  SharedOverlayCloseProps;
/** Props for the canonical alert-dialog action region. */
export interface AlertDialogActionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Explicit decision actions. */
  children: ReactNode;
  /** Ref to the rendered action group. */
  ref?: Ref<HTMLDivElement>;
}

/** Coordinates an accessible modal decision that requires acknowledgement. */
export function Root({
  defaultOpen,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ...props
}: Readonly<AlertDialogRootProps>): ReactElement {
  useBreezeContext();
  return createElement(AriaDialogTrigger, {
    ...props,
    defaultOpen,
    isOpen: open,
    onOpenChange,
  });
}
export function Content(
  props: Readonly<AlertDialogContentProps>,
): ReactElement {
  return createElement(SharedModalContent, {
    ...props,
    dismissible: false,
    role: 'alertdialog',
  });
}

export function Actions({
  className,
  ref,
  ...props
}: Readonly<AlertDialogActionsProps>): ReactElement {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: alertDialogActions({ class: className }),
    ref: useForwardedRef(ref),
    role: props.role ?? 'group',
  });
}
/**
 * Presents an accessible modal alert that requires an explicit decision.
 *
 * @summary modal decision requiring explicit confirmation
 */
export const AlertDialog = {
  /** Responsive, end-aligned region for explicit decision actions. */
  Actions,
  /** Explicit decision action that closes the alert dialog. */
  Close: SharedOverlayClose,
  /** Non-outside-dismissible alert-dialog surface and focus scope. */
  Content,
  /** Required accessible consequence description. */
  Description: SharedOverlayDescription,
  /** Controlled, read-only, or uncontrolled open-state coordinator. */
  Root,
  /** Required accessible alert title. */
  Title: SharedOverlayTitle,
  /** Semantic action that opens the alert dialog. */
  Trigger: SharedOverlayTrigger,
};
