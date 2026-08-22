import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createContext, createElement, useContext } from 'react';
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
interface TriggeredAlertDialogRootProps extends AlertDialogRootSharedProps {
  /** Uses a compound trigger to coordinate alert-dialog state. */
  triggerless?: false;
}
interface TriggerlessAlertDialogRootProps extends AlertDialogRootSharedProps {
  defaultOpen?: never;
  /** Called with the next externally controlled open state. */
  onOpenChange: (open: boolean) => void;
  /** Current externally controlled open state. */
  open: boolean;
  readOnly?: never;
  /** Omits a compound trigger for state controlled by an external action. */
  triggerless: true;
}
/** Props for controlled, read-only, or uncontrolled alert-dialog state. */ export type AlertDialogRootProps =

    | (TriggeredAlertDialogRootProps &
        (
          | ControlledAlertDialogRootProps
          | ReadOnlyAlertDialogRootProps
          | UncontrolledAlertDialogRootProps
        ))
    | TriggerlessAlertDialogRootProps;
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

interface AlertDialogModalState {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const AlertDialogModalStateContext = createContext<
  AlertDialogModalState | undefined
>(undefined);

/** Coordinates an accessible modal decision that requires acknowledgement. */
export function Root(props: Readonly<AlertDialogRootProps>): ReactElement {
  useBreezeContext();
  const { children, triggerless } = props;

  if (triggerless) {
    const { onOpenChange, open } = props;

    return createElement(
      AlertDialogModalStateContext.Provider,
      { value: { onOpenChange, open } },
      children,
    );
  }

  const { defaultOpen, onOpenChange, open } = props;

  return createElement(
    AlertDialogModalStateContext.Provider,
    { value: undefined },
    <AriaDialogTrigger
      defaultOpen={defaultOpen}
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </AriaDialogTrigger>,
  );
}
export function Content(
  props: Readonly<AlertDialogContentProps>,
): ReactElement {
  const modalState = useContext(AlertDialogModalStateContext);

  return createElement(SharedModalContent, {
    ...props,
    dismissible: false,
    modalState,
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
