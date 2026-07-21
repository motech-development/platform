import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  Focusable,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components/Tooltip';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Button, type ButtonProps } from '../Button/Button';

const tooltip = tv({
  base: 'z-50 max-w-64 border border-[var(--breeze-border-strong)] bg-[var(--breeze-ink)] px-2.5 py-1.5 text-sm text-[var(--breeze-ink-inverse)] shadow-lg data-[entering]:animate-in data-[exiting]:animate-out motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
  defaultVariants: {
    variant: 'secondary',
  },
  variants: {
    variant: {
      danger:
        'border-[var(--breeze-danger)] bg-[var(--breeze-danger)] text-[var(--breeze-ink-inverse)]',
      primary:
        'border-[var(--breeze-primary)] bg-[var(--breeze-primary)] text-[var(--breeze-ink-inverse)]',
      secondary:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-ink)] text-[var(--breeze-ink-inverse)]',
    },
  },
});

const tooltipIconTrigger = tv({
  base: 'inline-flex size-5 shrink-0 cursor-help items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--breeze-focus)]',
  defaultVariants: {
    variant: 'secondary',
  },
  variants: {
    variant: {
      danger: 'text-[var(--breeze-danger)]',
      primary: 'text-[var(--breeze-primary)]',
      secondary: 'text-[var(--breeze-ink-muted)]',
    },
  },
});

interface TooltipRootSharedProps {
  /** Trigger and tooltip content. */ children: ReactNode;
  /** Delay before opening in milliseconds. Defaults to `700`. */ delay?: number;
  /** Delay before closing in milliseconds. Defaults to `0`. */ closeDelay?: number;
}
interface ControlledTooltipRootProps {
  /** Current open state. */ open: boolean;
  /** Called with next open state. */ onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}
interface ReadOnlyTooltipRootProps {
  /** Current immutable open state. */ open: boolean;
  /** Marks controlled state immutable. */ readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}
interface UncontrolledTooltipRootProps {
  /** Initial open state. */ defaultOpen?: boolean;
  /** Called with next open state. */ onOpenChange?: (open: boolean) => void;
  open?: never;
  readOnly?: false;
}
/** Props for controlled, read-only, or uncontrolled tooltip state. */ export type TooltipRootProps =
  TooltipRootSharedProps &
    (
      | ControlledTooltipRootProps
      | ReadOnlyTooltipRootProps
      | UncontrolledTooltipRootProps
    );
/** Props for the tooltip trigger action. */ export type TooltipTriggerProps =
  ButtonProps;
/** Props for a compact non-action tooltip trigger with a required accessible name. */ export interface TooltipIconTriggerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Accessible name for the informational icon. */
  'aria-label': string;
  /** Decorative icon. */
  children: ReactNode;
  /** Ref to the rendered focusable informational icon. */
  ref?: Ref<HTMLSpanElement>;
  /** Semantic icon colour. Defaults to `secondary`. */
  variant?: 'danger' | 'primary' | 'secondary';
}
/** Props for descriptive tooltip content. */ export interface TooltipContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Concise descriptive text. */ children: ReactNode;
  /** Gap from trigger. Defaults to `6`. */ offset?: number;
  /** Placement. Defaults to `top`. */ placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top start'
    | 'top end'
    | 'bottom start'
    | 'bottom end';
  /** Ref to rendered tooltip. */ ref?: Ref<HTMLDivElement>;
  /** Semantic tooltip colour. Defaults to `secondary`. */
  variant?: 'danger' | 'primary' | 'secondary';
}

/** Coordinates concise supplementary information for a trigger. */
export function Root({
  closeDelay = 0,
  defaultOpen,
  delay = 700,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ...props
}: Readonly<TooltipRootProps>): ReactElement {
  useBreezeContext();
  return createElement(AriaTooltipTrigger, {
    ...props,
    closeDelay,
    defaultOpen,
    delay,
    isOpen: open,
    onOpenChange,
  });
}
const TooltipTrigger = Button;
export function IconTrigger({
  children,
  className,
  ref,
  variant = 'secondary',
  ...props
}: Readonly<TooltipIconTriggerProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  const trigger = createElement(
    'span',
    {
      ...props,
      className: tooltipIconTrigger({ class: className, variant }),
      role: 'img',
      tabIndex: 0,
    },
    children,
  );

  return <Focusable ref={forwardedRef}>{trigger}</Focusable>;
}
export function Content({
  className,
  offset = 6,
  placement = 'top',
  ref,
  variant = 'secondary',
  ...props
}: Readonly<TooltipContentProps>): ReactElement {
  useBreezeContext();
  return createElement(AriaTooltip, {
    ...props,
    className: tooltip({ class: className, variant }),
    offset,
    placement,
    ref: useForwardedRef(ref),
  } as ComponentProps<typeof AriaTooltip>);
}
/**
 * Accessible compound descriptive tooltip primitive.
 *
 * @summary concise non-interactive help revealed from a trigger
 */
export const Tooltip = {
  /** Concise descriptive popup positioned against its trigger. */
  Content,
  /** Focusable informational icon described by the tooltip. */
  IconTrigger,
  /** Controlled, read-only, or uncontrolled hover and focus coordinator. */
  Root,
  /** Semantic action described by the tooltip. */
  Trigger: TooltipTrigger,
};
