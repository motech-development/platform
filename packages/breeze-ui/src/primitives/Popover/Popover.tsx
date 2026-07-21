import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useId } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
} from 'react-aria-components/Dialog';
import { Popover as AriaPopover } from 'react-aria-components/Popover';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import {
  OverlayDescriptionContext,
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

const popover = tv({
  base: 'z-50 max-h-[min(24rem,var(--available-height))] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-4 text-[var(--breeze-ink)] shadow-xl outline-none data-[entering]:animate-in data-[exiting]:animate-out motion-reduce:transition-none forced-colors:border-[CanvasText]',
});
interface PopoverRootSharedProps {
  /** Trigger and content. */ children: ReactNode;
}
interface ControlledPopoverRootProps {
  /** Current open state. */ open: boolean;
  /** Called with next open state. */ onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}
interface ReadOnlyPopoverRootProps {
  /** Current immutable open state. */ open: boolean;
  /** Marks controlled state immutable. */ readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}
interface UncontrolledPopoverRootProps {
  /** Initial open state. */ defaultOpen?: boolean;
  /** Called with next open state. */ onOpenChange?: (open: boolean) => void;
  open?: never;
  readOnly?: false;
}
/** Props for controlled, read-only, or uncontrolled popover state. */ export type PopoverRootProps =
  PopoverRootSharedProps &
    (
      | ControlledPopoverRootProps
      | ReadOnlyPopoverRootProps
      | UncontrolledPopoverRootProps
    );
/** Props for the popover trigger. */ export type PopoverTriggerProps =
  SharedOverlayTriggerProps;
/** Props for positioned popover content. */ export interface PopoverContentProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Popover anatomy. */ children: ReactNode;
  /** Allows outside pointer dismissal. Defaults to `true`. */ dismissible?: boolean;
  /** Prevents Escape dismissal. */ keyboardDismissDisabled?: boolean;
  /** Traps outside interaction when true. Defaults to `false`. */ modal?: boolean;
  /** Gap from trigger. Defaults to `8`. */ offset?: number;
  /** Logical placement. Defaults to `bottom start`. */ placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top start'
    | 'top end'
    | 'bottom start'
    | 'bottom end';
  /** Ref to rendered dialog surface. */ ref?: Ref<HTMLElement>;
}
/** Props for required popover title. */ export type PopoverTitleProps =
  SharedOverlayTitleProps;
/** Props for required popover description. */ export type PopoverDescriptionProps =
  SharedOverlayDescriptionProps;
/** Props for semantic popover close action. */ export type PopoverCloseProps =
  SharedOverlayCloseProps;

/** Coordinates non-modal contextual content anchored to a trigger. */
export function Root({
  defaultOpen,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ...props
}: PopoverRootProps): ReactElement {
  useBreezeContext();
  return createElement(AriaDialogTrigger, {
    ...props,
    defaultOpen,
    isOpen: open,
    onOpenChange,
  });
}
export function Content({
  children,
  className,
  dismissible = true,
  keyboardDismissDisabled = false,
  modal = false,
  offset = 8,
  placement = 'bottom start',
  ref,
  ...props
}: PopoverContentProps): ReactElement {
  useBreezeContext();
  const descriptionId = useId();

  return createElement(
    AriaPopover,
    {
      className: popover({ class: className }),
      isDismissable: dismissible,
      isKeyboardDismissDisabled: keyboardDismissDisabled,
      isNonModal: !modal,
      offset,
      placement,
    } as ComponentProps<typeof AriaPopover>,
    createElement(
      AriaDialog,
      {
        ...props,
        'aria-describedby': descriptionId,
        ref: useForwardedRef(ref),
      } as ComponentProps<typeof AriaDialog>,
      createElement(
        OverlayDescriptionContext,
        { value: descriptionId },
        children,
      ),
    ),
  );
}
/**
 * Accessible compound positioned popover primitive.
 *
 * @summary contextual modal or nonmodal dialog anchored to a trigger
 */
export const Popover = {
  /** Semantic action that closes the popover. */
  Close: SharedOverlayClose,
  /** Positioned modal or nonmodal dialog surface. */
  Content,
  /** Required accessible popover description. */
  Description: SharedOverlayDescription,
  /** Controlled, read-only, or uncontrolled open-state coordinator. */
  Root,
  /** Required accessible popover title. */
  Title: SharedOverlayTitle,
  /** Semantic action that opens the popover. */
  Trigger: SharedOverlayTrigger,
};
