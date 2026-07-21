import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useId } from 'react';
import type { ProgressBarRenderProps } from 'react-aria-components/ProgressBar';
import { ProgressBar as AriaProgressBar } from 'react-aria-components/ProgressBar';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const progressRoot = tv({ base: 'grid min-w-0 gap-2 text-sm' });
const progressHeader = tv({
  base: 'flex min-w-0 items-baseline justify-between gap-4',
});
const progressTrack = tv({
  base: 'h-3 w-full overflow-hidden border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] forced-colors:border-[CanvasText]',
});
const progressFill = tv({
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

type ProgressBarNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'style'
>;

interface ProgressBarSharedProps extends ProgressBarNativeProps {
  /** Visible application-owned translated progress label. */
  label: ReactNode;
  /** Maximum range value. Defaults to `100`. */
  maximum?: number;
  /** Minimum range value. Defaults to `0`. */
  minimum?: number;
  /** Ref to the rendered progress element. */
  ref?: Ref<HTMLDivElement>;
  /** Bootstrap-aligned semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

interface DeterminateProgressBarProps {
  /** Excluded or false when progress has a measurable value. */
  indeterminate?: false;
  /** Current progress value within the configured range. */
  value: number;
  /** Optional translated value announced instead of the numeric value. */
  valueText?: string;
}

interface IndeterminateProgressBarProps {
  /** Marks progress as ongoing without a measurable value. */
  indeterminate: true;
  /** Excluded because indeterminate progress has no current value. */
  value?: never;
  /** Excluded because indeterminate progress has no current value text. */
  valueText?: never;
}

/** Props for determinate or indeterminate operation progress. */
export type ProgressBarProps = ProgressBarSharedProps &
  (DeterminateProgressBarProps | IndeterminateProgressBarProps);

/**
 * Shows measurable or indeterminate operation progress with range semantics.
 *
 * @summary labelled determinate or indeterminate operation progress
 */
export function ProgressBar({
  className,
  indeterminate = false,
  label,
  maximum = 100,
  minimum = 0,
  ref,
  value,
  valueText,
  variant = 'primary',
  ...props
}: Readonly<ProgressBarProps>): ReactElement {
  useBreezeContext();

  const labelId = useId();
  const renderProgress = ({
    percentage,
    valueText: formattedValue,
  }: ProgressBarRenderProps): ReactElement =>
    createElement(
      'div',
      {
        className: 'contents',
      },
      createElement(
        'div',
        {
          className: progressHeader(),
        },
        createElement('span', { id: labelId }, label),
        indeterminate
          ? null
          : createElement('span', { 'aria-hidden': 'true' }, formattedValue),
      ),
      createElement(
        'div',
        {
          'aria-hidden': 'true',
          className: progressTrack(),
        },
        createElement('div', {
          className: progressFill({
            class: indeterminate
              ? 'w-2/5 animate-pulse motion-reduce:animate-none'
              : undefined,
            variant,
          }),
          style: indeterminate
            ? undefined
            : {
                width: `${percentage ?? 0}%`,
              },
        }),
      ),
    );
  const progressProps = {
    ...props,
    'aria-labelledby': labelId,
    children: renderProgress,
    className: progressRoot({ class: className }),
    'data-variant': variant,
    isIndeterminate: indeterminate,
    maxValue: maximum,
    minValue: minimum,
    ref: useForwardedRef(ref),
    value,
    valueLabel: valueText,
  } as unknown as ComponentProps<typeof AriaProgressBar>;

  return createElement(AriaProgressBar, progressProps);
}
