import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement, useId } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const metricCard = tv({
  defaultVariants: {
    density: 'regular',
    tone: 'default',
  },
  slots: {
    description: 'text-base',
    label: 'font-[family-name:var(--breeze-font-display)] text-base leading-5',
    root: 'grid min-w-0 content-center border-b-2 p-5 sm:p-7',
    value:
      'font-[family-name:var(--breeze-font-display)] text-[2rem] font-bold leading-[1.2] tabular-nums',
  },
  variants: {
    density: {
      regular: {
        root: 'gap-2',
      },
      spacious: {
        root: 'gap-3',
      },
    },
    tone: {
      default: {
        description: 'text-[var(--breeze-ink-soft)]',
        label: 'font-bold',
        root: 'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
      },
      inverse: {
        description: 'text-[var(--breeze-ink-inverse-muted)]',
        label: 'font-normal text-[var(--breeze-ink-inverse-muted)]',
        root: 'border-[var(--breeze-shell-border)] bg-[var(--breeze-shell-soft)] text-[var(--breeze-ink-inverse)]',
      },
      subtle: {
        description: 'text-[var(--breeze-ink-soft)]',
        label: 'font-bold',
        root: 'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]',
      },
    },
  },
});

/** Internal rhythm supported by a metric card. */
export type MetricCardDensity = 'regular' | 'spacious';

/** Semantic surface tones supported by a metric card. */
export type MetricCardTone = 'default' | 'subtle' | 'inverse';

/** Props for one prominent domain-neutral metric summary. */
export interface MetricCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style'> {
  /** Internal content rhythm. Defaults to `regular`. */
  density?: MetricCardDensity;
  /** Optional supporting explanation or comparison. */
  description?: ReactNode;
  /** Persistent metric label. */
  label: ReactNode;
  /** Ref to the rendered article. */
  ref?: Ref<HTMLElement>;
  /** Semantic surface tone. Defaults to `default`. */
  tone?: MetricCardTone;
  /** Prominent application-formatted value. */
  value: ReactNode;
}

/**
 * Presents one prominent application-formatted metric without domain
 * calculation.
 *
 * @summary prominent labelled metric with optional supporting context
 */
export function MetricCard({
  className,
  density = 'regular',
  description,
  label,
  ref,
  tone = 'default',
  value,
  ...props
}: Readonly<MetricCardProps>): ReactElement {
  useBreezeContext();

  const labelId = useId();
  const styles = metricCard({ density, tone });

  return createElement(
    'article',
    {
      ...props,
      'aria-labelledby': labelId,
      className: styles.root({ class: className }),
      ref: useForwardedRef(ref),
    },
    <>
      <div className={styles.label()} id={labelId}>
        {label}
      </div>
      <div className={styles.value()}>{value}</div>
      {description === null || description === undefined ? null : (
        <div className={styles.description()}>{description}</div>
      )}
    </>,
  );
}
