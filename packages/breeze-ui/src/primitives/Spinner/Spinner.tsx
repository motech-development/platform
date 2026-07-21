import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useId } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize, VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const spinner = tv({
  base: 'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-e-transparent motion-reduce:animate-none forced-colors:border-[CanvasText] forced-colors:border-e-transparent',
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
  variants: {
    size: {
      lg: 'size-8',
      md: 'size-6',
      sm: 'size-4',
    },
    variant: {
      danger: 'text-[var(--breeze-danger)]',
      dark: 'text-[var(--breeze-shell)]',
      info: 'text-[var(--breeze-info)]',
      light: 'text-[var(--breeze-surface)]',
      primary: 'text-[var(--breeze-primary)]',
      secondary: 'text-[var(--breeze-ink-soft)]',
      success: 'text-[var(--breeze-success)]',
      warning: 'text-[var(--breeze-warning)]',
    },
  },
});

type SpinnerNativeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'role' | 'style'
>;

/** Props for a labelled or decorative activity spinner. */
export interface SpinnerProps extends SpinnerNativeProps {
  /** Application-owned translated status label. Omit for a decorative spinner. */
  label?: ReactNode;
  /** Ref to the rendered spinner element. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical spinner size. Defaults to `md`. */
  size?: ControlSize;
  /** Bootstrap-aligned semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

/**
 * Indicates ongoing activity, announcing only an explicit translated label
 * and otherwise remaining decorative beside an existing status message.
 *
 * @summary labelled or decorative indeterminate activity indicator
 */
export function Spinner({
  className,
  label,
  ref,
  size = 'md',
  variant = 'primary',
  ...props
}: Readonly<SpinnerProps>): ReactElement {
  useBreezeContext();

  const labelId = useId();
  const spinnerProps: ComponentPropsWithRef<'span'> & {
    'data-variant': VisualVariant;
  } = {
    ...props,
    'aria-hidden': label === undefined ? 'true' : undefined,
    'aria-labelledby': label === undefined ? undefined : labelId,
    className: spinner({ class: className, size, variant }),
    'data-variant': variant,
    ref: useForwardedRef(ref),
    role: label === undefined ? undefined : 'status',
  };

  return createElement(
    'span',
    spinnerProps,
    label === undefined
      ? null
      : createElement(VisuallyHidden, { id: labelId }, label),
  );
}
