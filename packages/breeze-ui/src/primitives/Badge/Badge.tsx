import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const variants = {
  base: {
    badge:
      'breeze:inline-grid breeze:shrink-0 breeze:items-center breeze:whitespace-nowrap breeze:rounded-breeze-chip breeze:ps-breeze-2 breeze:pe-breeze-2 breeze:py-breeze-px breeze:text-breeze-2xs breeze:font-bold breeze:leading-breeze-snug breeze:tracking-breeze-wide',
    content: 'breeze:[grid-area:1/1]',
    skeleton: 'breeze:[grid-area:1/1] breeze:inline-size-full',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    brand: 'breeze:bg-breeze-brand-soft breeze:text-breeze-brand-text',
    danger: 'breeze:bg-breeze-danger/10 breeze:text-breeze-danger',
    neutral: 'breeze:bg-breeze-sunken breeze:text-breeze-ink-2',
    positive: 'breeze:bg-breeze-pos-soft breeze:text-breeze-pos',
    warning: 'breeze:bg-breeze-warn-soft breeze:text-breeze-warn',
  },
} as const;

/** Badge-specific status treatments. */
export type BadgeVariant = keyof typeof variants.variant;

export interface BadgeProps {
  'aria-label'?: string;
  children: number | string;
  loading?: boolean;
  variant?: BadgeVariant;
}

/**
 * Marks a short status or count with a Badge-specific treatment.
 *
 * @summary Compact, non-interactive status content.
 */
export function Badge({
  'aria-label': ariaLabel,
  children,
  loading = false,
  variant = 'neutral',
}: Readonly<BadgeProps>) {
  const { messages } = useBreezeContext();
  const accessibleLabel = ariaLabel?.trim() || undefined;
  let statusContent;

  if (loading) {
    statusContent = (
      <span className={variants.base.skeleton}>
        <Skeleton
          blockSize="1lh"
          inlineSize="100%"
          label={messages.loading}
          shape="rectangle"
        />
      </span>
    );
  } else if (accessibleLabel !== undefined) {
    statusContent = <VisuallyHidden>{accessibleLabel}</VisuallyHidden>;
  }

  return (
    <span
      aria-busy={loading || undefined}
      className={[variants.base.badge, variants.variant[variant]].join(' ')}
    >
      <span
        aria-hidden={
          loading || accessibleLabel !== undefined ? true : undefined
        }
        className={[variants.base.content, loading && 'breeze:opacity-0']
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </span>
      {statusContent}
    </span>
  );
}
