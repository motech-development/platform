import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { useMeter } from 'react-aria/useMeter';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const meterRoot = tv({ base: 'grid min-w-0 gap-2 text-sm' });
const meterHeader = tv({
  base: 'flex min-w-0 items-baseline justify-between gap-4',
});
const meterTrack = tv({
  base: 'h-3 w-full overflow-hidden border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] forced-colors:border-[CanvasText]',
});
const meterFill = tv({
  base: 'h-full forced-colors:bg-[Highlight]',
  defaultVariants: {
    variant: 'primary',
  },
  variants: {
    variant: {
      danger: 'bg-[var(--breeze-danger)]',
      dark: 'bg-[var(--breeze-shell)]',
      info: 'bg-[var(--breeze-info)]',
      light: 'bg-[var(--breeze-surface)]',
      primary: 'bg-[var(--breeze-primary)]',
      secondary: 'bg-[var(--breeze-ink-soft)]',
      success: 'bg-[var(--breeze-success)]',
      warning: 'bg-[var(--breeze-warning)]',
    },
  },
});

type MeterNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'style'
>;

/** Props for a scalar measurement within a known range. */
export interface MeterProps extends MeterNativeProps {
  /** Visible application-owned translated measurement label. */
  label: ReactNode;
  /** Finite maximum range value, greater than or equal to `minimum`. Defaults to `100`. */
  maximum?: number;
  /** Finite minimum range value. Defaults to `0`. */
  minimum?: number;
  /** Ref to the rendered meter element. */
  ref?: Ref<HTMLDivElement>;
  /** Current measurement. Finite values are clamped to the configured range. */
  value: number;
  /** Optional translated value announced instead of the numeric value. */
  valueText?: ReactNode;
  /** Bootstrap-aligned semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

/**
 * Displays a scalar measurement with explicit range semantics.
 *
 * @summary labelled scalar measurement within a known finite range
 */
export function Meter({
  className,
  label,
  maximum = 100,
  minimum = 0,
  ref,
  value,
  valueText,
  variant = 'primary',
  ...props
}: MeterProps): ReactElement {
  useBreezeContext();

  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) ||
    maximum < minimum
  ) {
    throw new RangeError(
      'Meter bounds must be finite and maximum must be greater than or equal to minimum.',
    );
  }

  const clampedValue = Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : value;
  const { labelProps, meterProps } = useMeter({
    label,
    maxValue: maximum,
    minValue: minimum,
    value: clampedValue,
    valueLabel: valueText,
  });
  const range = maximum - minimum;
  const percentage =
    range === 0
      ? 0
      : Math.min(100, Math.max(0, ((clampedValue - minimum) / range) * 100));
  const rootProps: ComponentPropsWithRef<'div'> & {
    'data-variant': VisualVariant;
  } = {
    ...props,
    ...meterProps,
    className: meterRoot({ class: className }),
    'data-variant': variant,
    ref: useForwardedRef(ref),
    role: 'meter',
  };

  return createElement(
    'div',
    rootProps,
    createElement(
      'div',
      {
        className: meterHeader(),
      },
      createElement('span', labelProps, label),
      createElement(
        'span',
        { 'aria-hidden': 'true' },
        valueText ?? clampedValue,
      ),
    ),
    createElement(
      'div',
      {
        'aria-hidden': 'true',
        className: meterTrack(),
      },
      createElement('div', {
        className: meterFill({ variant }),
        style: {
          width: `${Number.isFinite(percentage) ? percentage : 0}%`,
        },
      }),
    ),
  );
}
